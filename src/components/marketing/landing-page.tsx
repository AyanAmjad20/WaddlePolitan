import Image from "next/image";
import { ArrowRight, Camera, CircleHelp, MapPin, PawPrint, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

const features = [
  { icon: MapPin, title: "Find campus sightings", text: "See where geese, pigeons, and other campus visitors have been spotted around TMU." },
  { icon: Camera, title: "Share in seconds", text: "Drop a pin, choose an animal and count, then add a photo when it helps tell the story." },
  { icon: Users, title: "Keep each other in the loop", text: "A simple student-built view of what is happening outside your next class." },
];

const steps = [
  ["01", "Spot something", "Notice a feathered (or furry) friend around campus."],
  ["02", "Drop a pin", "Place the sighting where it happened and add the details."],
  ["03", "Help others find it", "Your report becomes part of the shared campus map."],
];

export function LandingPage() {
  return (
    <div className="overflow-hidden bg-background">
      <section className="relative isolate border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-16 sm:px-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-8 lg:px-12 lg:pb-24 lg:pt-24">
          <div className="relative z-10 max-w-xl">
            <p className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#B27A00]"><span className="h-2 w-2 rounded-full bg-yellow" aria-hidden="true" />Campus wildlife, spotted.</p>
            <h1 className="max-w-lg text-4xl font-bold leading-[1.08] tracking-[-0.04em] text-navy-dark sm:text-6xl">See what&apos;s happening <span className="text-navy">around TMU.</span></h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-muted">WaddlePolitan is a campus map demo for the animals, moments, and small surprises that make TMU feel alive.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/map" className="px-6"><MapPin size={18} aria-hidden="true" />Explore the map</ButtonLink>
              <ButtonLink href="/how-it-works" variant="secondary">How it works <ArrowRight size={17} aria-hidden="true" /></ButtonLink>
            </div>
            <div className="mt-10 flex items-center gap-3 text-sm text-muted"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF8DF] text-[#B27A00]"><PawPrint size={19} aria-hidden="true" /></span><span>Made for curious students at TMU.</span></div>
          </div>
          <div className="relative min-h-[330px] sm:min-h-[480px] lg:min-h-[570px]">
            <div className="absolute inset-0 -right-20 overflow-hidden rounded-[2rem] bg-[#EDF2F7] shadow-float lg:-right-32"><Image src="/illustrations/campus-map-preview.svg" alt="Illustrative map of TMU campus with animal sighting pins" fill priority className="object-cover" sizes="(min-width: 1024px) 60vw, 100vw" /><span className="absolute bottom-4 left-4 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-xs font-semibold text-navy shadow-card">Illustrative preview · local demo data</span></div>
            <article className="absolute left-3 top-7 w-52 rounded-2xl border border-border bg-surface p-3 shadow-float sm:left-6 sm:top-12 sm:w-60">
              <div className="flex items-center justify-between text-xs text-muted"><span className="flex items-center gap-2 font-semibold text-navy"><span className="h-7 w-7 rounded-full bg-yellow" />Maya</span><span>just now</span></div>
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#FFF8DF] px-3 py-2 text-sm font-semibold text-navy"><PawPrint size={17} className="text-[#B27A00]" aria-hidden="true" /> Goose · 2 spotted</div>
              <p className="mt-2 flex items-center gap-1 text-xs text-muted"><MapPin size={13} aria-hidden="true" />RAC courtyard</p>
            </article>
            <article className="absolute bottom-8 right-0 w-56 rounded-2xl border border-border bg-surface p-3 shadow-float sm:bottom-16 sm:right-4 sm:w-64"><div className="flex items-center justify-between text-xs text-muted"><span className="flex items-center gap-2 font-semibold text-navy"><span className="h-7 w-7 rounded-full bg-[#D9E4F2]" />Alex</span><span>18 min ago</span></div><p className="mt-3 text-sm font-semibold text-navy">Tiny visitor by the quad 🐦</p><p className="mt-2 flex items-center gap-1 text-xs text-muted"><MapPin size={13} aria-hidden="true" />Kerr Hall West</p></article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28"><div className="mx-auto max-w-2xl text-center"><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#B27A00]">A better campus view</p><h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-navy-dark sm:text-4xl">Built for the curious side of TMU.</h2><p className="mt-4 text-base leading-7 text-muted">One quick place to look, post, and pass along what you notice between classes.</p></div><div className="mt-12 grid gap-5 md:grid-cols-3">{features.map(({ icon: Icon, title, text }) => <div key={title} className="rounded-2xl border border-border bg-surface p-7 shadow-card"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF8DF] text-[#B27A00]"><Icon size={21} aria-hidden="true" /></div><h3 className="mt-6 text-lg font-bold text-navy-dark">{title}</h3><p className="mt-3 leading-7 text-muted">{text}</p></div>)}</div></section>

      <section className="bg-navy-dark text-white"><div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 lg:py-24"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-yellow">How it works</p><h2 className="mt-4 max-w-md text-3xl font-bold tracking-[-0.03em] sm:text-4xl">Small sightings make a campus map.</h2><p className="mt-5 max-w-md leading-7 text-[#C6D2E3]">It takes a few taps to add a sighting to this browser-only demo and explore the campus story.</p><ButtonLink href="/create" variant="accent" className="mt-8">Post a sighting <ArrowRight size={17} aria-hidden="true" /></ButtonLink></div><div className="grid gap-8 sm:grid-cols-3">{steps.map(([number, title, text]) => <div key={number} className="border-t border-white/20 pt-5"><span className="text-sm font-bold text-yellow">{number}</span><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-[#C6D2E3]">{text}</p></div>)}</div></div></section>
      <section className="mx-auto flex max-w-4xl flex-col items-center px-5 py-20 text-center sm:px-8 lg:py-28"><CircleHelp size={25} className="text-[#B27A00]" aria-hidden="true" /><h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-navy-dark">Ready to look around?</h2><p className="mt-4 max-w-lg leading-7 text-muted">Open the illustrative map, or try adding a sighting to your local browser demo.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><ButtonLink href="/map">Open the map</ButtonLink><ButtonLink href="/signup" variant="secondary">Try the local demo</ButtonLink></div></section>
    </div>
  );
}
