-- Recréer lock_metadata_view pour utiliser auth.uid() au lieu d'un paramètre client
-- Empêche un attaquant de verrouiller le compte d'un autre utilisateur

CREATE OR REPLACE FUNCTION public.lock_metadata_view()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles
  SET has_viewed_metadata = true,
      updated_at = now()
  WHERE id = auth.uid();
END;
$$;
