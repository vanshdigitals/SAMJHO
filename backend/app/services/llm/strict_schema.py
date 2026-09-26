"""Turn a Pydantic JSON Schema into the strict form constrained decoding wants.

Groq's `strict: true` mode (and OpenAI's, which it mirrors) guarantees the
output matches the schema exactly — but only accepts schemas where every
property is listed in `required` and every object sets
`additionalProperties: false`. SAMJO's `AnalysisResponse` has 81 fields with
Pydantic defaults, so it is not in that form.

The fix is an adapter, not a contract change. `AnalysisResponse` is the public
contract and stays exactly as it is; this module derives a strict *view* of it
for one provider, and the response is still validated against the original
Pydantic model on the way back. Nothing downstream — evidence verification,
the drop rule, the API shape — sees any difference.

Two things make that round trip safe:

* An optional field becomes nullable rather than disappearing, so the model
  can still decline to answer it.
* `strip_nulls` removes those nulls before validation, letting Pydantic apply
  its own defaults. Without it, a `null` emitted for `title: str = ""` would
  fail validation for a field that has a perfectly good default.

The schema is generated from the model, never hand-maintained.
"""

from typing import Any

# Keywords Pydantic emits that constrained decoding does not accept. Dropping
# them costs nothing: they are bounds, not structure, and the Pydantic model
# re-applies every one of them when it validates the response.
_UNSUPPORTED_KEYWORDS = frozenset(
    {
        "default",
        "format",
        "minLength",
        "maxLength",
        "minimum",
        "maximum",
        "exclusiveMinimum",
        "exclusiveMaximum",
        "minItems",
        "maxItems",
        "pattern",
        "multipleOf",
        "examples",
    }
)


def _enum_target(ref: str, defs: dict[str, Any]) -> dict[str, Any] | None:
    """The definition behind a $ref, but only when it is a plain enum."""
    prefix = "#/$defs/"
    if not ref.startswith(prefix):
        return None
    target = defs.get(ref[len(prefix) :])
    if isinstance(target, dict) and isinstance(target.get("enum"), list):
        return target
    return None


def _make_nullable(node: dict[str, Any], defs: dict[str, Any]) -> dict[str, Any]:
    """Allow null for a property the original model did not require."""
    if "anyOf" in node:
        variants = node["anyOf"]
        if not any(v.get("type") == "null" for v in variants if isinstance(v, dict)):
            node["anyOf"] = [*variants, {"type": "null"}]
        return node

    if "$ref" in node:
        ref = node["$ref"]

        # An optional enum cannot become `anyOf: [$ref, null]`: constrained
        # decoding rejects that as ambiguous, because neither branch carries a
        # discriminator it can use to tell them apart. Inlining the enum and
        # adding null to its own value list says the same thing unambiguously.
        enum_def = _enum_target(ref, defs)
        if enum_def is not None:
            declared = enum_def.get("type", "string")
            values = list(enum_def["enum"])
            if None not in values:
                values.append(None)
            rest = {k: v for k, v in node.items() if k != "$ref"}
            return {
                **rest,
                "type": [declared, "null"] if isinstance(declared, str) else declared,
                "enum": values,
            }

        # An object reference is disambiguated from null by its own shape, so
        # the wrap is accepted here.
        rest = {k: v for k, v in node.items() if k != "$ref"}
        return {**rest, "anyOf": [{"$ref": ref}, {"type": "null"}]}

    declared = node.get("type")
    if isinstance(declared, str):
        node["type"] = [declared, "null"]
    elif isinstance(declared, list) and "null" not in declared:
        node["type"] = [*declared, "null"]
    return node


def _transform(node: Any, defs: dict[str, Any]) -> Any:
    if isinstance(node, list):
        return [_transform(item, defs) for item in node]
    if not isinstance(node, dict):
        return node

    out: dict[str, Any] = {k: v for k, v in node.items() if k not in _UNSUPPORTED_KEYWORDS}

    properties = out.get("properties")
    if isinstance(properties, dict):
        originally_required = set(out.get("required") or [])

        transformed: dict[str, Any] = {}
        for name, prop in properties.items():
            child = _transform(prop, defs)
            if name not in originally_required and isinstance(child, dict):
                child = _make_nullable(child, defs)
            transformed[name] = child

        out["properties"] = transformed
        # Strict mode: every property required, nothing extra allowed.
        out["required"] = list(transformed.keys())
        out["additionalProperties"] = False

    for key, value in list(out.items()):
        if key == "properties":
            continue
        out[key] = _transform(value, defs)

    return out


def to_strict_schema(schema: dict[str, Any]) -> dict[str, Any]:
    """Derive the strict-mode schema from a Pydantic `model_json_schema()`."""
    defs = schema.get("$defs") or {}
    return _transform(schema, defs)


def strip_nulls(value: Any) -> Any:
    """Drop explicit nulls so Pydantic can apply the model's own defaults.

    A field the model declined to fill comes back as `null` because the strict
    schema made it nullable. For a field typed `str` with a default of `""`,
    passing that null to Pydantic is a validation error about a field that was
    never really missing. Removing it restores the original semantics: absent
    means default.
    """
    if isinstance(value, dict):
        return {k: strip_nulls(v) for k, v in value.items() if v is not None}
    if isinstance(value, list):
        return [strip_nulls(v) for v in value]
    return value
