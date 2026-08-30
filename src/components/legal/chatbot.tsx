import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Phone } from "lucide-react";
import { submitLead } from "@/lib/leads";

type Msg = { role: "bot" | "user"; text: string };

const PRACTICE_AREAS = [
  "Criminal Law (Defense / Bail / Anticipatory Bail)",
  "Negotiable Instruments Act (Cheque Bounce - S.138)",
  "Family Court (Domestic Violence / Divorce)",
  "Banking & Finance (SARFAESI / DRT)",
  "Documentation & Registration",
  "Notary Services",
];

const QUICK_REPLIES: { label: string; area: string; reply: string }[] = [
  {
    label: "I need help with a criminal case / bail",
    area: PRACTICE_AREAS[0],
    reply:
      "Adv. Rajeshkumar L. Yadav regularly appears in criminal defense, bail and anticipatory bail matters before the Bombay High Court and District Court, Mumbai. Share a few details and we will arrange a consultation.",
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
    label: "Book a free consultation",
    area: "",
    reply:
      "Happy to help — your first consultation is free. Please share your name, phone number and a brief description of your issue, and we will confirm an appointment.",
  },
];

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
      setTimeout(
        () => push({ role: "bot", text: "Thank you. Your inquiry has been received — our team will contact you within 24 hours." }),
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
          className="grid h-14 w-14 place-items-center rounded-full border border-border bg-foreground/90 text-background shadow-lg backdrop-blur-md transition hover:opacity-90"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {open && (
        <div className="flex h-[70vh] max-h-[560px] w-[min(92vw,22rem)] flex-col overflow-hidden rounded-3xl border border-border bg-background/80 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <div>
              <div className="text-sm font-bold tracking-tight">Legal Assistant</div>
              <div className="text-[11px] text-muted-foreground">Adv. Rajeshkumar L. Yadav</div>
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
              <a
                href="tel:9029678910"
                className="inline-flex items-center gap-2 rounded-2xl border border-border px-3 py-2 text-xs hover:bg-accent"
              >
                <Phone className="h-3.5 w-3.5" /> Call 9029678910
              </a>
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
