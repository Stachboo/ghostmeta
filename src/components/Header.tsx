/**
 * Header partagé (SecurityPage, BlogPost, PricingPage)
 * ─────────────────────────────────────────────────────
 * Logo, sélecteur de langue FR/EN, liens de navigation.
 * Mobile : menu hamburger via Sheet (shadcn/ui).
 *
 * Home.tsx conserve son propre header (auth + upgrade).
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  { key: 'blog', to: '/#blog' },
  { key: 'security', to: '/securite' },
  { key: 'pricing', to: '/pricing' },
] as const;

export default function Header() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  const isActive = (to: string) => {
    if (to === '/') return pathname === '/';
    return pathname.startsWith(to.replace('/#blog', ''));
  };

  return (
    <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container h-14 flex items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <GhostLogo size={32} />
          <span className="text-lg font-bold tracking-tight">
            Ghost<span className="text-[#00ff41]">Meta</span>
          </span>
        </Link>

        {/* Desktop nav + langue */}
        <div className="flex items-center gap-6">
          {/* Nav links — desktop only */}
          <nav className="hidden md:flex items-center gap-5">
            {NAV_LINKS.map(({ key, to }) => (
              <Link
                key={key}
                to={to}
                className={`text-sm transition-colors ${
                  isActive(to)
                    ? 'text-[#00ff41] font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t(`nav.${key}`)}
              </Link>
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
                Fran\u00e7ais
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
              className="bg-[#0a0a0c] border-white/10 w-64"
            >
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <GhostLogo size={24} />
                  <span className="font-bold">
                    Ghost<span className="text-[#00ff41]">Meta</span>
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 px-4 mt-4">
                {NAV_LINKS.map(({ key, to }) => (
                  <Link
                    key={key}
                    to={to}
                    onClick={() => setOpen(false)}
                    className={`text-sm transition-colors ${
                      isActive(to)
                        ? 'text-[#00ff41] font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {t(`nav.${key}`)}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
