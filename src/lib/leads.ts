import { supabase } from "@/integrations/supabase/client";

export type LeadInput = {
  name: string;
  phone: string;
  email?: string;
  practice_area?: string;
  message?: string;
  source: "contact_form" | "chatbot";
};

export async function submitLead(input: LeadInput): Promise<void> {
  const row = {
    name: input.name.trim().slice(0, 100),
    phone: input.phone.trim().slice(0, 20),
    email: input.email?.trim().slice(0, 255) || null,
    practice_area: input.practice_area?.slice(0, 150) || null,
    message: input.message?.trim().slice(0, 1000) || null,
    source: input.source,
  };
  // The generated Database types predate the leads table; insert is guarded
  // by RLS (anon insert-only) and column CHECK constraints.
  const { error } = await (supabase as unknown as {
    from: (t: string) => { insert: (r: typeof row) => Promise<{ error: { message: string } | null }> };
  })
    .from("leads")
    .insert(row);
  if (error) throw new Error(error.message);
}
