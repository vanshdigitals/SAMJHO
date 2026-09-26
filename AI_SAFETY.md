# Samjo: AI Safety Model

The disclaimer is not the safety strategy. It is the smallest part of it. Safety is built into the pipeline, so that unsafe output is structurally difficult to produce rather than merely discouraged.

## 1. The boundary

| Tier | Definition | Samjo |
|---|---|---|
| Legal information | What the law or a document generally says | Yes, grounded in the user's document |
| Legal guidance | General pathways and options, not personalised | Limited, conservative, from curated templates |
| Legal advice | Applying law to your facts to tell you what to do | Never |
| Legal representation | Acting for you | Never |

The line in practice: Samjo will say "this clause requires 30 days notice, and here is where it says that." It will not say "you should give notice on Tuesday" or "this clause is unenforceable."

## 2. Why grounding is the primary control

Published research on legal tasks has repeatedly found substantial hallucination rates in general-purpose models, and meaningful rates even in purpose-built commercial legal research tools. Courts have sanctioned filings built on fabricated citations, and the count of such cases has grown quickly.

The response is structural rather than exhortative. Samjo does not ask a model to recall law. It asks a model to interpret a document the user supplied, and then verifies every quote against that document. The task class where hallucination is most dangerous, retrieving statutes and cases from model memory, is simply not in the product.

Residual risk remains in interpretation, which is why confidence, verification flags and professional escalation are mandatory rather than optional.

## 3. Refusal behaviour

Refusals reframe rather than stonewall. A user who asks for a prediction still has a real need underneath the question, and Samjo redirects to the part it can legitimately serve.

| Request | Response |
|---|---|
| "Will I win?" | The standard line, plus an offer of lawyer preparation |
| "Should I sign this?" | What the document requires, what is unusual, and the questions to ask before signing |
| "Is this clause illegal?" | What the clause says, that enforceability is a question for a qualified professional, and a prepared question |
| "Decide for me" | Samjo provides information so the user and their professional can decide |
| "Draft my court reply" | Declines, offers a summary and questions to take to a professional |
| "What's the punishment for X?" | Declines to assert law from memory; if the document states a consequence, quotes it |

The canonical prediction response:

> I can help you understand the document, identify what it says, highlight issues to discuss with a legal professional, and prepare questions. I can't predict the outcome of a legal dispute.

## 4. Uncertainty, shown rather than hidden

Uncertainty is surfaced, never smoothed over. Low confidence produces a visible "Verify" marker. Conflicting clauses are reported as conflicts rather than silently resolved in favour of one reading. Missing context is named in `uncertainty[]`. When characterization confidence is low, the briefing says what Samjo thinks the document is and that it is not sure.

A product that sounds equally confident about everything teaches users to trust it uniformly, which is the opposite of what this domain needs.

## 5. High-risk handling

Categories: eviction proceedings, court summons, criminal notices, anything with a deadline inside seven days, and anything involving a minor.

On detection: `is_high_risk` is set, a banner appears, professional help moves above self-help content, and the next-steps list leads with getting help rather than with reading further. Self-service content is de-emphasised rather than removed, because hiding information from someone in trouble is its own harm.

### Minors

If the user indicates they are under 18, or the matter concerns a child's safety, Samjo adds a prompt to involve a trusted adult or guardian alongside professional help, and holds to information only with no guidance component.

## 6. Jurisdiction

The MVP assumes India and says so, on screen and in every export. Because analysis is grounded in the user's own document, the core extraction is largely jurisdiction-portable: it reports what the document says, not what the law is. Guidance, which is jurisdiction-specific, stays limited to curated pathways for India.

Samjo never claims a legal conclusion valid across jurisdictions, and never presents statutory consequences unless the document itself states them.

## 7. Prohibited outputs

Never: a predicted outcome; a definitive enforceability conclusion; a statute or case citation absent from the document; a claim without a verified span; a filing or court document presented as valid; encouragement toward unlawful action; a fabricated lawyer directory; a claim that Samjo is or replaces a lawyer.

## 8. Disclosure placement

Contextual, not a permanent banner, because a banner on every screen becomes invisible within two sessions. One line in the hero, one at the top of a user's first briefing, inline next to next steps and professional help, and always in the export. The high-risk escalation message is styled distinctly from a disclaimer so it does not inherit the disclaimer's learned invisibility.

## 9. Testing the safety model

Safety behaviour is asserted in the test suite, not assumed. See TESTING.md sections on refusal, hallucination and adversarial documents. Every case runs against `MockProvider` in CI, and against a real provider before release.
