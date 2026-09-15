"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Map, List, Plus, UserRound, Menu, X } from "lucide-react";
import { useDemo } from "@/features/demo/use-demo";
import { Button, ButtonLink } from "@/components/ui/button";

const links = [
  { href: "/map", label: "Explore", icon: Map },
  { href: "/feed", label: "Feed", icon: List },
  { href: "/create", label: "Report", icon: Plus },
  { href: "/profile", label: "Profile", icon: UserRound },
];
const information = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/for-students", label: "For Students" },
  { href: "/contact", label: "Contact" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const demo = useDemo();
  const isMap = pathname === "/map";
  return <>
    <a href="#main-content" className="sr-only fixed left-4 top-4 z-50 rounded-xl bg-yellow p-3 focus:not-sr-only">Skip to content</a>
    <header onKeyDown={(event) => { if (event.key === "Escape") setMenuOpen(false); }} className="relative z-30 border-b border-border bg-surface">
      <div className="mx-auto flex min-h-20 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-8">
        <Link href="/" aria-label="WaddlePolitan home" className="flex items-center gap-2 text-xl font-bold tracking-tight text-navy sm:text-2xl"><span aria-hidden="true" className="text-3xl">🐤</span>waddlepolitan</Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">{links.slice(0, 2).map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={`flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold ${pathname === href ? "bg-navy text-white" : "text-navy hover:bg-surface-muted"}`}><Icon size={18} />{label}</Link>)}{information.slice(0, 2).map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} className="rounded-xl px-4 py-3 text-sm text-navy hover:bg-surface-muted">{link.label}</Link>)}</nav>
        <div className="flex items-center gap-2"><div className="hidden sm:block">{demo.ready && demo.signedIn ? <ButtonLink href="/profile" variant="secondary"><UserRound size={17} />{demo.profile.displayName.split(" ")[0]}</ButtonLink> : <ButtonLink href="/login" variant="secondary">Demo log in</ButtonLink>}</div><Button aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="site-menu" variant="ghost" onClick={() => setMenuOpen(!menuOpen)} className="px-3"><span className="sr-only">Menu</span>{menuOpen ? <X size={22} /> : <Menu size={22} />}</Button></div>
      </div>
      {menuOpen && <nav id="site-menu" aria-label="More navigation" className="absolute left-0 right-0 top-full grid gap-1 border-b border-border bg-surface p-4 shadow-float sm:grid-cols-3">{[...links, ...information, { href: demo.signedIn ? "/profile" : "/login", label: demo.signedIn ? "Demo account" : "Demo log in" }, { href: "/signup", label: "Try the demo" }].map((link, index) => <Link key={`${link.href}-${index}`} href={link.href} onClick={() => setMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-surface-muted">{link.label}</Link>)}</nav>}
    </header>
    <div className="border-b border-border bg-surface-muted px-4 py-2 text-center text-xs leading-5 text-muted">Campus wildlife, locally previewed. <strong className="font-semibold text-navy">Demo only</strong> · Reports and demo identity stay in this browser.</div>
    {demo.error && <div role="alert" className="border-b border-danger/20 bg-danger/5 px-4 py-3 text-center text-sm text-danger">{demo.error.message} <Link href="/profile" className="font-semibold underline">Demo settings</Link></div>}
    <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 pb-20 lg:pb-0">{children}</main>
    {!isMap && <footer className="border-t border-border bg-navy-dark px-5 pb-28 pt-10 text-white lg:pb-10"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 sm:flex-row"><div><Link href="/" className="text-xl font-bold">🐤 waddlepolitan</Link><p className="mt-3 max-w-xs text-sm leading-6 text-white/70">A little more campus. A little more curiosity.<br />An independent student prototype for TMU.</p></div><nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">{information.map(link => <Link key={link.href} href={link.href} className="rounded py-1 text-white/85 hover:text-yellow">{link.label}</Link>)}</nav></div></footer>}
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden">{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={`flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-semibold ${pathname === href ? "bg-surface-muted text-navy" : "text-muted"}`}><Icon size={21} />{label}</Link>)}</nav>
  </>;
}
