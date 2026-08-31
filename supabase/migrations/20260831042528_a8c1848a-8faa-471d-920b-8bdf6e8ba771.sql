-- Remove the default PUBLIC execute grant from all SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.accept_invite(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.complete_onboarding(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_organization(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_org_role(uuid, uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_org_role(uuid, uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_org_member(uuid, uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.protect_last_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.protect_profile_email() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.seed_sample_budget_entries(uuid) FROM PUBLIC;

-- Re-grant only to signed-in users, only for the functions the app actually calls
GRANT EXECUTE ON FUNCTION public.accept_invite(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_onboarding(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_organization(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.seed_sample_budget_entries(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_org_role(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_org_role(uuid, uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_member(uuid, uuid) TO authenticated;

-- Trigger-only functions get no direct grants at all
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_last_admin() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_profile_email() FROM anon, authenticated;