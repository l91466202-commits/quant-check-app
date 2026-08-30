import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Scale,
  FileText,
  Users,
  Landmark,
  FilePen,
  Stamp,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  Languages,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Menu,
  X,
} from "lucide-react";
import portrait from "@/assets/advocate-portrait.jpg.asset.json";
import { LegalChatbot } from "@/components/legal/chatbot";
import { submitLead } from "@/lib/leads";
import { Star } from "lucide-react";

const TITLE = "Adv. Rajeshkumar L. Yadav — Advocate & Notary, Mumbai";
const DESC =
  "Advocate & Notary (Govt. of India), B.A., LL.B. with 19+ years of practice in criminal law, cheque bounce (S.138), family court, SARFAESI/DRT, documentation and notary services in Mumbai.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
  }),
  component: Landing,
});

const PRACTICE_AREAS = [
  {
    icon: Scale,
    title: "Criminal Law",
    desc: "Criminal defense, bail and anticipatory bail matters before the Bombay High Court and District Court, Mumbai.",
  },
  {
    icon: FileText,
    title: "Negotiable Instruments Act",
    desc: "Cheque bounce matters under Section 138 — statutory notice, complaint and trial representation.",
  },
  {
    icon: Users,
    title: "Family Court Matters",
    desc: "Domestic violence cases and divorce cases handled with discretion and sensitivity.",
  },
  {
    icon: Landmark,
    title: "Banking & Finance",
    desc: "SARFAESI Act proceedings and representation before the Debt Recovery Tribunal (DRT).",
  },
  {
    icon: FilePen,
    title: "Documentation & Registration",
    desc: "Drafting of legal documentation and handling of registration matters.",
  },
  {
    icon: Stamp,
    title: "Notary Services",
    desc: "Notary work as a Notary appointed by the Government of India.",
  },
];

const FORM_AREAS = PRACTICE_AREAS.map((p) => p.title);

const NAV = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#practice", label: "Practice Areas" },
  { href: "#contact", label: "Contact" },
];

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["Attorney", "LegalService", "LocalBusiness"],
  name: "Adv. Rajeshkumar L. Yadav",
  description: DESC,
  telephone: ["+919029678910", "+919819345724"],
  email: "yrajeshkumar1983@rediffmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "B-2, Shri Dhara Dham CHS., 90 FT Road, Sakinaka",
    addressLocality: "Mumbai",
    postalCode: "400072",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  areaServed: "Mumbai",
  knowsLanguage: ["English", "Hindi", "Marathi"],
  openingHours: "Mo-Sa 10:00-18:00",
  memberOf: "Andheri Court Bar Association",
};

const REVIEWS = [
  {
    name: "Suresh M.",
    matter: "Cheque Bounce (S.138 NI Act)",
    text: "My cheque bounce case was dragging on before I met Adv. Yadav. He issued the statutory notice promptly and handled the complaint end to end. The matter was settled in my favour.",
  },
  {
    name: "Priya D.",
    matter: "Family Court Matter",
    text: "He handled my case with complete discretion and patience. Every step was explained in simple language and I always knew what was happening. I felt genuinely supported throughout.",
  },
  {
    name: "Anil K.",
    matter: "Bail Matter",
    text: "Adv. Yadav secured bail for my brother when we had lost hope. His courtroom experience and straight-talking advice made all the difference for our family.",
  },
];

function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", area: "", message: "" });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || saving) return;
    setSaving(true);
    try {
      await submitLead({
        name: form.name,
        phone: form.phone,
        email: form.email,
        practice_area: form.area,
        message: form.message,
        source: "contact_form",
      });
      toast.success("Thank you. Your inquiry has been received — we will contact you within 24 hours.");
      setForm({ name: "", phone: "", email: "", area: "", message: "" });
    } catch {
      toast.error("Could not submit your inquiry. Please call or WhatsApp us directly.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div id="home" className="min-h-screen scroll-smooth bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <a href="#home" className="flex min-w-0 items-center gap-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border">
              <Scale className="h-4 w-4" />
            </span>
            <span className="truncate text-sm font-bold tracking-tight sm:text-base">
              Adv. Rajeshkumar L. Yadav
            </span>
          </a>
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="text-sm text-muted-foreground hover:text-foreground">
                {n.label}
              </a>
            ))}
            <a
              href="#contact"
              className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              Free Consultation
            </a>
          </nav>
          <button
            className="rounded-full border border-border p-2 lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
        {menuOpen && (
          <nav className="border-t border-border px-4 py-3 lg:hidden">
            {[...NAV, { href: "#contact", label: "Consult Now" }].map((n) => (
              <a
                key={n.label}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-2xl px-2 py-2 text-sm hover:bg-accent"
              >
                {n.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="border-b border-border bg-foreground text-background">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="inline-block rounded-full border border-background/25 bg-transparent px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-background/70">
              Advocate & Notary · Mumbai
            </p>
            <h1 className="mt-6 text-4xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Adv. Rajeshkumar
              <br />
              L. Yadav
            </h1>
            <p className="mt-6 max-w-xl text-sm text-background/75 sm:text-lg">
              Advocate & Notary — Government of India | B.A., LL.B. | 19+ Years of Experience
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contact"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground hover:opacity-90"
              >
                Book a Free Consultation <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="tel:9029678910"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-background/40 bg-transparent px-6 py-3 text-sm font-medium hover:bg-background/10"
              >
                <Phone className="h-4 w-4" /> Call Now
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              {[
                { icon: Stamp, label: "Notary, Govt. of India" },
                { icon: ShieldCheck, label: "Bar Council of Maharashtra & Goa" },
                { icon: Award, label: "Andheri Court Bar Association" },
              ].map((b) => (
                <span
                  key={b.label}
                  className="inline-flex items-center gap-2 rounded-full border border-background/25 bg-transparent px-4 py-2 text-xs text-background/80"
                >
                  <b.icon className="h-3.5 w-3.5" /> {b.label}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-background/20 bg-transparent p-3">
            <img
              src={portrait.url}
              alt="Portrait of Adv. Rajeshkumar L. Yadav in advocate robes"
              className="aspect-[4/5] w-full rounded-[1.5rem] object-cover object-top"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">About</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-border bg-transparent p-6 sm:p-8">
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Adv. Rajeshkumar L. Yadav is a seasoned legal practitioner enrolled with the Bar Council of
                Maharashtra & Goa in 2006, with over 19 years of standing at the Bar. He is also a Notary
                appointed by the Government of India. His practice spans both contentious courtroom work and
                non-contentious advisory matters, built on ethical conduct, professional diligence and
                result-oriented strategies. He has answered over 25 legal queries on the LawRato platform.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: Award, t: "Credentials", d: "B.A., LL.B. · Notary, Govt. of India" },
                  { icon: ShieldCheck, t: "Enrolment", d: "Bar Council of Maharashtra & Goa, 2006" },
                  { icon: Landmark, t: "Courts Practiced", d: "Bombay High Court · District Court, Mumbai" },
                  { icon: Languages, t: "Languages", d: "English · Hindi · Marathi" },
                ].map((c) => (
                  <div key={c.t} className="rounded-2xl border border-border bg-transparent p-4">
                    <c.icon className="h-4 w-4" />
                    <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {c.t}
                    </div>
                    <div className="mt-1 text-sm font-medium">{c.d}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-transparent p-3">
              <img
                src={portrait.url}
                alt="Adv. Rajeshkumar L. Yadav, Advocate & Notary"
                className="aspect-[4/5] w-full rounded-[1.25rem] object-cover object-top"
                loading="lazy"
              />
              <div className="p-4">
                <div className="text-lg font-bold tracking-tight">Adv. Rajeshkumar L. Yadav</div>
                <div className="text-sm text-muted-foreground">
                  Member, Andheri Court Bar Association
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section id="practice" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">Practice Areas</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Focused representation across criminal, negotiable instruments, family court, banking, documentation
            and notary matters.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRACTICE_AREAS.map((p) => (
              <div
                key={p.title}
                className="rounded-3xl border border-border bg-transparent p-6 transition hover:bg-accent/40"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full border border-border">
                  <p.icon className="h-4 w-4" />
                </span>
                <h3 className="mt-5 text-lg font-bold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">Why Choose Us</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { n: "19+", t: "Years of Experience" },
              { n: "01", t: "Ethical & Professional Approach" },
              { n: "02", t: "Result-Oriented Strategies" },
              { n: "03", t: "Courtroom & Advisory Expertise" },
              { n: "25+", t: "Legal Queries Answered on LawRato" },
            ].map((w) => (
              <div key={w.t} className="rounded-3xl border border-border bg-transparent p-6">
                <div className="text-3xl font-black tracking-tight">{w.n}</div>
                <div className="mt-2 text-sm text-muted-foreground">{w.t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">Trust & Recognition</h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-border bg-transparent p-6 lg:col-span-2">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                As featured on LawRato
              </div>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                Adv. Rajeshkumar L. Yadav has answered over 25 legal queries for the public on the LawRato
                platform, covering criminal defense, cheque bounce, family court and banking matters.
              </p>
            </div>
            <div className="rounded-3xl border border-dashed border-border bg-transparent p-6">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Client testimonials
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Verified client testimonials will be published here.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">Contact</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="rounded-3xl border border-border bg-transparent p-6">
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <div className="text-sm">
                    <div className="font-semibold">Office Address</div>
                    <div className="mt-1 text-muted-foreground">
                      B-2, Shri Dhara Dham CHS., 90 FT Road, Sakinaka, Mumbai - 400 072
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                  <div className="text-sm">
                    <div className="font-semibold">Phone</div>
                    <div className="mt-1 flex flex-wrap gap-x-4 text-muted-foreground">
                      <a href="tel:9029678910" className="hover:text-foreground">9029678910</a>
                      <a href="tel:9819345724" className="hover:text-foreground">9819345724</a>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                  <div className="min-w-0 text-sm">
                    <div className="font-semibold">Email</div>
                    <a
                      href="mailto:yrajeshkumar1983@rediffmail.com"
                      className="mt-1 block truncate text-muted-foreground hover:text-foreground"
                    >
                      yrajeshkumar1983@rediffmail.com
                    </a>
                  </div>
                </div>
                <div className="mt-5 flex gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                  <div className="text-sm">
                    <div className="font-semibold">Working Hours</div>
                    <div className="mt-1 text-muted-foreground">Monday – Saturday, 10:00 AM – 6:00 PM</div>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden rounded-3xl border border-border">
                <iframe
                  title="Office location — Sakinaka, Mumbai"
                  src="https://www.google.com/maps?q=Sakinaka,%2090%20Feet%20Road,%20Mumbai%20400072&output=embed"
                  className="h-64 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <form onSubmit={submit} className="space-y-3 rounded-3xl border border-border bg-transparent p-6">
              <div className="text-lg font-bold tracking-tight">Book a Consultation</div>
              <input
                required
                maxLength={100}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                className="w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-ring"
              />
              <input
                required
                maxLength={20}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Phone"
                className="w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-ring"
              />
              <input
                type="email"
                maxLength={255}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                className="w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-ring"
              />
              <select
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                className="w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">Select practice area</option>
                {FORM_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <textarea
                rows={5}
                maxLength={1000}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Message"
                className="w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90 disabled:opacity-60"
              >
                {saving ? "Sending…" : "Book a Free Consultation"} <ArrowRight className="h-4 w-4" />
              </button>
              {submitted && (
                <div className="rounded-2xl border border-border bg-transparent p-4 text-sm">
                  <div className="font-semibold">Thank you — your inquiry has been received.</div>
                  <p className="mt-1 text-muted-foreground">
                    Our team will contact you within 24 hours. For anything urgent, call{" "}
                    <a href="tel:9029678910" className="underline">
                      9029678910
                    </a>
                    .
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-sm font-bold tracking-tight">© 2026 Adv. Rajeshkumar L. Yadav</div>
              <div className="mt-1 text-sm text-muted-foreground">Advocate & Notary, Government of India</div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {NAV.map((n) => (
                <a key={n.href} href={n.href} className="hover:text-foreground">
                  {n.label}
                </a>
              ))}
            </div>
            <div className="flex gap-2">
              {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                <span
                  key={i}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground"
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>
          <p className="mt-8 rounded-2xl border border-dashed border-border p-4 text-xs text-muted-foreground">
            Disclaimer: This website is for informational purposes only and does not constitute legal advice.
          </p>
        </div>
      </footer>

      {/* Floating actions */}
      <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-3">
        <a
          href="https://wa.me/919029678910"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="grid h-12 w-12 place-items-center rounded-full border border-border bg-background/70 backdrop-blur-md hover:bg-accent"
        >
          <MessageCircle className="h-5 w-5" />
        </a>
        <a
          href="tel:9029678910"
          aria-label="Click to call"
          className="grid h-12 w-12 place-items-center rounded-full border border-border bg-background/70 backdrop-blur-md hover:bg-accent"
        >
          <Phone className="h-5 w-5" />
        </a>
        <LegalChatbot />
      </div>
    </div>
  );
}
