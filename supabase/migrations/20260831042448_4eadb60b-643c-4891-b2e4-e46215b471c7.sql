-- 1. Revoke EXECUTE on SECURITY DEFINER functions from anonymous callers
REVOKE EXECUTE ON FUNCTION public.accept_invite(text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.complete_onboarding(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.create_organization(text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_org_role(uuid, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_org_role(uuid, uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_org_member(uuid, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.protect_last_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.protect_profile_email() FROM anon;
REVOKE EXECUTE ON FUNCTION public.seed_sample_budget_entries(uuid) FROM anon;

-- 2. Revoke EXECUTE from signed-in users on trigger-only functions they never call directly
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_last_admin() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_profile_email() FROM authenticated;

-- 3. Lock down leads: submit-only for public/signed-in users; reads and writes only via backend (service role)
REVOKE SELECT, UPDATE, DELETE, TRUNCATE, TRIGGER, REFERENCES ON public.leads FROM anon;
REVOKE SELECT, UPDATE, DELETE, TRUNCATE, TRIGGER, REFERENCES ON public.leads FROM authenticated;