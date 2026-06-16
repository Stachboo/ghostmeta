/**
 * Header partagé (SecurityPage, BlogPost, PricingPage)
 * ─────────────────────────────────────────────────────
 * Logo, sélecteur de langue FR/EN, liens de navigation.
 * Mobile : menu hamburger via Sheet (shadcn/ui).
 *
 * Home.tsx conserve son propre header (auth + upgrade).
 */

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LocaleLink from '@/components/LocaleLink';
import { basePath, localePath, type Locale } from '@/lib/locale';
import { Globe, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import GhostLogo from '@/components/GhostLogo';

const NAV_LINKS = [
  { key: 'home', to: '/' },
  { key: 'blog', to: '/blog' },
  { key: 'tools', to: '/tools' },
  { key: 'security', to: '/securite' },
  { key: 'pricing', to: '/pricing' },
] as const;

export default function Header() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const changeLanguage = (lng: Locale) => {
    localStorage.setItem('i18nextLng', lng);
    navigate(localePath(basePath(pathname), lng));
  };

  const isActive = (to: string) => {
    const base = basePath(pathname);
    if (to === '/') return base === '/';
    return base.startsWith(to);
  };

  return (
    <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container h-14 flex items-center justify-between px-4">
        {/* Logo */}
        <LocaleLink to="/" className="flex items-center gap-2">
          <GhostLogo size={32} />
          <span className="text-lg font-bold tracking-tight">
            Ghost<span className="text-ghost-green">Meta</span>
          </span>
        </LocaleLink>

        {/* Desktop nav + langue */}
        <div className="flex items-center gap-6">
          {/* Nav links — desktop only */}
          <nav className="hidden md:flex items-center gap-5">
            {NAV_LINKS.map(({ key, to }) => (
              <LocaleLink
                key={key}
                to={to}
                className={`text-sm transition-colors ${
                  isActive(to)
                    ? 'text-ghost-green font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t(`nav.${key}`)}
              </LocaleLink>
            ))}
          </nav>

          {/* Sélecteur de langue */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Changer la langue / Change Language"
              >
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage('fr')}>
                Français
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('en')}>
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Hamburger — mobile only */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-ghost-dark border-white/10 w-64"
            >
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <GhostLogo size={24} />
                  <span className="font-bold">
                    Ghost<span className="text-ghost-green">Meta</span>
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 px-4 mt-4">
                {NAV_LINKS.map(({ key, to }) => (
                  <LocaleLink
                    key={key}
                    to={to}
                    onClick={() => setOpen(false)}
                    className={`text-sm transition-colors ${
                      isActive(to)
                        ? 'text-ghost-green font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {t(`nav.${key}`)}
                  </LocaleLink>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
