import { useEffect, useRef, useState } from "react";
import { X, Send, Phone, CheckCircle2 } from "lucide-react";
import { submitLead } from "@/lib/leads";
const botLogo = "/images/bot-logo.png";

type Msg = { role: "bot" | "user"; text: string };

const PRACTICE_AREAS = [
  "Criminal Law (Defense / Bail / Anticipatory Bail)",
  "Negotiable Instruments Act (Cheque Bounce - S.138)",
  "Family Court (Domestic Violence / Divorce)",
  "Banking & Finance (SARFAESI / DRT)",
  "Documentation & Registration",
  "Notary Services",
  "Arbitration and Alternate Disputes Act",
];

const QUICK_REPLIES: { label: string; area: string; reply: string }[] = [
  {
    label: "I need help with a criminal case / bail",
    area: PRACTICE_AREAS[0],
    reply:
      "Adv. Rajeshkumar L. Yadav regularly appears in criminal defense, bail and anticipatory bail matters before the Bombay High Court, Sessions Court and Magistrate Court, Mumbai. Share a few details and we will arrange a consultation.",
  },
  {
    label: "I have a cheque bounce matter",
    area: PRACTICE_AREAS[1],
    reply:
      "Cheque bounce matters under Section 138 of the Negotiable Instruments Act are handled end to end — notice, complaint and trial. Please share your details below.",
  },
  {
    label: "I need help with family court / divorce",
    area: PRACTICE_AREAS[2],
    reply:
      "Domestic violence and divorce matters are handled with discretion and a result-oriented strategy. Kindly share your details for a consultation.",
  },
  {
    label: "I need help with SARFAESI / DRT",
    area: PRACTICE_AREAS[3],
    reply:
      "Banking and finance matters including SARFAESI Act proceedings and Debt Recovery Tribunal representation are handled regularly. Please share your details.",
  },
  {
    label: "I need documentation / notary services",
    area: PRACTICE_AREAS[4],
    reply:
      "Legal documentation, registration matters and notary services (Notary, Government of India) are available at the Sakinaka office. Share your details below.",
  },
  {
    label: "I need arbitration / alternate dispute resolution",
    area: PRACTICE_AREAS[6],
    reply:
      "Arbitration and alternate dispute resolution matters under the Arbitration and Conciliation Act are handled, including appointment of arbitrators, interim relief and enforcement of awards. Share your details below.",
  },
  {
    label: "Book a free consultation",
    area: "",
    reply:
      "Happy to help — your first consultation is free. Please share your name, phone number and a brief description of your issue, and we will confirm an appointment.",
  },
];

const OFFICE_ADDRESS =
  "Our office: B-2, Shri Dhara Dham CHS., 90 FT Road, Sakinaka, Mumbai - 400 072. Working hours are Monday to Saturday, 10:00 AM to 6:00 PM.";
const CONTACT_INFO =
  "You can reach us on 9029678910 or 9819345724, or email yrajeshkumar1983@rediffmail.com. WhatsApp is also available on 9029678910.";
const NOT_SURE =
  "I am not sure about it — please contact our office and Adv. Rajeshkumar L. Yadav will advise you personally. You can also fill in your details below and we will call you back within 24 hours.";

type Answer = { text: string; form?: boolean; area?: string };

function has(t: string, words: string[]) {
  return words.some((w) => t.includes(w));
}

function getAnswer(raw: string): Answer {
  const t = raw.toLowerCase();

  if (has(t, ["civil"]))
    return {
      text:
        "We do not practice civil law. Please select from our practice areas: Criminal Law, NI Act, Family Court, SARFAESI/DRT, Documentation, Notary Services, or Arbitration and Alternate Disputes Act.",
    };

  if (has(t, ["address", "office", "location", "where", "kaha", "kahan", "pata", "reach", "map", "sakinaka"]))
    return { text: OFFICE_ADDRESS };

  if (has(t, ["contact", "phone", "number", "call", "mobile", "email", "mail", "whatsapp"]))
    return { text: CONTACT_INFO };

  if (has(t, ["timing", "hours", "open", "time", "kab"]))
    return { text: "We are available Monday to Saturday, 10:00 AM to 6:00 PM, at the Sakinaka office." };

  if (has(t, ["fee", "fees", "charge", "cost", "price", "kitna", "paisa", "payment"]))
    return { text: NOT_SURE, form: true };

  if (has(t, ["language", "hindi", "marathi", "english"]))
    return { text: "Adv. Rajeshkumar L. Yadav speaks English, Hindi and Marathi." };

  if (has(t, ["experience", "years", "qualification", "notary", "about", "bar council", "who"]))
    return {
      text:
        "Adv. Rajeshkumar L. Yadav is a B.A., LL.B. advocate and Notary (Government of India), enrolled with the Bar Council of Maharashtra & Goa in 2008 with over 18 years of experience. He appears before the Bombay High Court, Sessions Court, Family Court, Magistrate Court, and DRT / SARFAESI forums in Mumbai.",
    };

  if (has(t, ["consult", "appointment", "book", "meeting", "free"]))
    return {
      text:
        "Your first consultation is free. Please share your name, phone number and a brief description of your issue and we will confirm an appointment.",
      form: true,
    };

  if (has(t, ["bail", "criminal", "fir", "arrest", "police", "anticipatory"]))
    return {
      text:
        "Criminal defense, bail and anticipatory bail matters are handled regularly before the Bombay High Court, Sessions Court and Magistrate Court, Mumbai. Share your details below for a free consultation.",
      form: true,
      area: PRACTICE_AREAS[0],
    };

  if (has(t, ["cheque", "check bounce", "138", "ni act", "negotiable"]))
    return {
      text:
        "Cheque bounce matters under Section 138 of the Negotiable Instruments Act are handled end to end — notice, complaint and trial. Please share your details below.",
      form: true,
      area: PRACTICE_AREAS[1],
    };

  if (has(t, ["divorce", "family", "domestic", "maintenance", "498", "wife", "husband"]))
    return {
      text:
        "Family court matters including domestic violence and divorce are handled with discretion. Kindly share your details below.",
      form: true,
      area: PRACTICE_AREAS[2],
    };

  if (has(t, ["sarfaesi", "drt", "bank", "loan", "recovery", "auction"]))
    return {
      text:
        "Banking and finance matters including SARFAESI Act proceedings and Debt Recovery Tribunal representation are handled regularly. Please share your details.",
      form: true,
      area: PRACTICE_AREAS[3],
    };

  if (has(t, ["document", "registration", "agreement", "affidavit", "attest", "stamp"]))
    return {
      text:
        "Legal documentation, registration matters and notary services are available at the Sakinaka office. Share your details below.",
      form: true,
      area: PRACTICE_AREAS[4],
    };

  if (has(t, ["arbitration", "arbitrator", "alternate dispute", "adr", "conciliation", "mediation", "award", "section 34", "section 9", "section 11", "arbitral"]))
    return {
      text:
        "Arbitration and alternate dispute resolution matters under the Arbitration and Conciliation Act are handled, including appointment of arbitrators, interim relief and enforcement of awards. Please share your details below.",
      form: true,
      area: PRACTICE_AREAS[6],
    };

  if (has(t, ["hi", "hello", "namaste", "hey"]) && t.length < 15)
    return { text: "Namaste. You can ask me about our practice areas, office address, contact details or book a free consultation." };

  if (has(t, ["thank", "shukriya", "dhanyavad"]))
    return { text: "You are welcome. We are here whenever you need legal assistance." };

  return { text: NOT_SURE, form: true };
}

export function LegalChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text:
        "Namaste, I am the Legal Assistant for Adv. Rajeshkumar L. Yadav. How may I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", issue: "", area: "" });
  const [done, setDone] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showForm, done]);

  const push = (m: Msg) => setMessages((prev) => [...prev, m]);

  function handleQuick(q: (typeof QUICK_REPLIES)[number]) {
    push({ role: "user", text: q.label });
    setTimeout(() => {
      push({ role: "bot", text: q.reply });
      if (q.area) setForm((f) => ({ ...f, area: q.area }));
      setShowForm(true);
    }, 300);
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    push({ role: "user", text });
    setInput("");
    const answer = getAnswer(text);
    setTimeout(() => {
      push({ role: "bot", text: answer.text });
      if (answer.area) setForm((f) => ({ ...f, area: answer.area as string }));
      if (answer.form) setShowForm(true);
    }, 300);
  }

  const [saving, setSaving] = useState(false);

  async function submitLeadForm(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || saving) return;
    setSaving(true);
    try {
      await submitLead({
        name: form.name,
        phone: form.phone,
        practice_area: form.area,
        message: form.issue,
        source: "chatbot",
      });
      push({ role: "user", text: `${form.name} — ${form.phone}${form.area ? ` — ${form.area}` : ""}` });
      setShowForm(false);
      setDone(true);

      // Forward the inquiry to WhatsApp so the advocate receives it instantly.
      const waText = [
        "New Inquiry (Legal Assistant)",
        `Name: ${form.name}`,
        `Phone: ${form.phone}`,
        form.area ? `Practice Area: ${form.area}` : "",
        form.issue ? `Issue: ${form.issue}` : "",
      ]
        .filter(Boolean)
        .join("\n");
      window.open(`https://wa.me/919029678910?text=${encodeURIComponent(waText)}`, "_blank", "noopener");

      setTimeout(
        () => push({ role: "bot", text: "Thank you. Your inquiry has been received — our team will contact you within 24 hours. WhatsApp is opening with your details; just press Send there too." }),
        300,
      );
    } catch {
      push({
        role: "bot",
        text: "Sorry, your details could not be submitted. Please try again, or reach us directly on WhatsApp or call 9029678910.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Legal Assistant chat"
          className="grid h-14 w-14 place-items-center overflow-hidden rounded-full border border-border bg-foreground/90 text-background shadow-lg backdrop-blur-md transition hover:opacity-90"
        >
          <img src={botLogo} alt="Legal Assistant" className="h-9 w-9 object-contain" />
        </button>
      )}

      {open && (
        <div className="flex h-[70vh] max-h-[560px] w-[min(92vw,22rem)] flex-col overflow-hidden rounded-3xl border border-border bg-background/80 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-foreground/90">
                <img src={botLogo} alt="Legal Assistant logo" className="h-6 w-6 object-contain" />
              </span>
              <div>
                <div className="text-sm font-bold tracking-tight">Legal Assistant</div>
                <div className="text-[11px] text-muted-foreground">Adv. Rajeshkumar L. Yadav</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full border border-border p-1.5 hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl bg-foreground px-3 py-2 text-sm text-background"
                    : "max-w-[90%] rounded-2xl border border-border bg-background/60 px-3 py-2 text-sm"
                }
              >
                {m.text}
              </div>
            ))}

            {!showForm && !done && (
              <div className="space-y-2 pt-1">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => handleQuick(q)}
                    className="w-full rounded-2xl border border-border bg-transparent px-3 py-2 text-left text-xs hover:bg-accent"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            )}

            {showForm && (
              <form onSubmit={submitLeadForm} className="space-y-2 rounded-2xl border border-border p-3">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  maxLength={100}
                  className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                />
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Phone number"
                  maxLength={20}
                  className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                />
                <select
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">Select practice area</option>
                  {PRACTICE_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
                <textarea
                  value={form.issue}
                  onChange={(e) => setForm({ ...form, issue: e.target.value })}
                  placeholder="Brief description of your issue"
                  maxLength={1000}
                  rows={3}
                  className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-foreground px-3 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? "Sending…" : "Send details"}
                </button>
              </form>
            )}

            {done && (
              <div className="rounded-2xl border border-border p-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 className="h-4 w-4" /> Inquiry received
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Thank you. Our team will contact you within 24 hours. Your first consultation is free.
                </p>
                <a
                  href="tel:9029678910"
                  className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-border px-3 py-2 text-xs hover:bg-accent"
                >
                  <Phone className="h-3.5 w-3.5" /> Call 9029678910
                </a>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              maxLength={500}
              className="min-w-0 flex-1 rounded-xl border border-input bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-foreground text-background hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
