/* ONE icon family for all of Samjo: Lucide.

   Chosen over the previous hand-drawn set because coherence has to be
   guaranteed rather than maintained by hand — a 24px grid, uniform stroke,
   round caps and silhouettes that stay legible at 16px. Tree-shaken, so only
   the icons below ship.

   Everything is re-exported under a semantic name. Import sites never name a
   Lucide glyph directly, so swapping one (or the whole family) is a change in
   this file alone.

   Stroke is 1.75 everywhere, a touch lighter than Lucide's 2 default, so icons
   never out-weigh DM Sans beside them. Every icon is decorative: the control
   or label that owns it carries the accessible name. */

import {
  ArrowLeft,
  BadgeCheck,
  Camera,
  ChevronRight,
  Calendar,
  CalendarClock,
  Check,
  ChevronDown,
  CircleAlert,
  CircleHelp,
  ClipboardList,
  Clock,
  EyeOff,
  FileSearch,
  FileText,
  FileUp,
  FolderOpen,
  Keyboard,
  Languages,
  Lock,
  Menu,
  ListChecks,
  MessageCircle,
  MessageCircleQuestion,
  Moon,
  Receipt,
  ScanSearch,
  Server,
  Smartphone,
  Timer,
  Trash2,
  TriangleAlert,
  Sun,
  UserRoundX,
  Volume2,
  X,
  type LucideIcon,
} from 'lucide-react';

type IconProps = { className?: string; size?: number };

function make(Glyph: LucideIcon, defaultSize: number, stroke = 1.75) {
  return function Icon({ className, size = defaultSize }: IconProps) {
    return (
      <Glyph
        width={size}
        height={size}
        strokeWidth={stroke}
        className={className}
        aria-hidden
        focusable={false}
      />
    );
  };
}

/* Header controls */
export const MenuIcon = make(Menu, 22);
export const CloseIcon = make(X, 22);
export const ChevronDownIcon = make(ChevronDown, 16, 2);
export const SunIcon = make(Sun, 19);
export const MoonIcon = make(Moon, 19);
export const CheckIcon = make(Check, 18, 2);

/* Language — Languages reads as translation more precisely than a globe,
   which is generic enough to mean "region" or "network". */
export const GlobeIcon = make(Languages, 19);

/* Hero entry paths */
export const FileTextIcon = make(FileText, 20);
export const MessageIcon = make(MessageCircle, 20);

/* Trust row */
export const SourceCheckIcon = make(BadgeCheck, 21);
export const LockIcon = make(Lock, 20);

/* Urgency. A clock-and-calendar reads as "a date is running", which is what
   the banner actually means; a warning triangle just says "danger". */
export const AlertIcon = make(CalendarClock, 19);

/* Briefing section markers. Only the sections whose meaning an icon genuinely
   sharpens get one; the rest are carried by the numbered order alone. */
export const WatchOutIcon = make(TriangleAlert, 18);
export const DetailsIcon = make(Receipt, 18);
export const CalendarIcon = make(Calendar, 18);
export const QuestionIcon = make(MessageCircleQuestion, 18);
export const NextStepsIcon = make(ListChecks, 18);

/* Problem section: reading vs. orienting. */
export const DocumentScanIcon = make(FileSearch, 18);
export const FocusIcon = make(ScanSearch, 18);
export const AttentionIcon = make(CircleAlert, 18);

/* Situation intake — a form being filled in, not a chat. */
export const IntakeIcon = make(ClipboardList, 18);

/* How it works — the timing line, not a spinner. */
export const TimerIcon = make(Timer, 18);

/* Language, read-aloud and access. Volume2 rather than a headphone or a
   speaking head: it is the control the product actually offers. */
export const SpeakIcon = make(Volume2, 20);
export const PhoneIcon = make(Smartphone, 20);
export const KeyboardIcon = make(Keyboard, 20);

/* Privacy. Stated as facts about handling, so each icon names the fact —
   no padlock wall, no shield. */
export const NoAccountIcon = make(UserRoundX, 20);
export const ClockIcon = make(Clock, 20);
export const NoLogIcon = make(EyeOff, 20);
export const ServiceIcon = make(Server, 20);

/* Limits. The negative list is marked by a plain X at text size, never a
   red cross badge. */
export const CrossIcon = make(X, 16, 2.25);

/* Preparing for professional help. */
export const UnclearIcon = make(CircleHelp, 18);
export const TakeWithIcon = make(FolderOpen, 18);

/* Product surfaces: the document flow. */
export const ChooseFileIcon = make(FileUp, 20);
export const CameraIcon = make(Camera, 20);
export const BackIcon = make(ArrowLeft, 18);
export const ForwardIcon = make(ChevronRight, 18);
export const DeleteIcon = make(Trash2, 18);
