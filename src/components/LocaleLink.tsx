/**
 * LocaleLink — Link drop-in qui préfixe automatiquement /en quand on est
 * dans la version anglaise du site. Garde l'utilisateur dans sa locale.
 * Usage : remplacer <Link to="/blog"> par <LocaleLink to="/blog">.
 */

import { Link, useLocation, type LinkProps } from "react-router-dom";
import { localeFromPath, localePath } from "@/lib/locale";

export default function LocaleLink({ to, ...rest }: LinkProps) {
  const { pathname } = useLocation();
  const locale = localeFromPath(pathname);
  const dest = typeof to === "string" ? localePath(to, locale) : to;
  return <Link to={dest} {...rest} />;
}
