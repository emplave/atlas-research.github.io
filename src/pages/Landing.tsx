import { Hero } from "@/components/Hero";
import { ApplyBox } from "@/components/ApplyBox";
import { WorldSection } from "@/components/WorldSection";
import { Thesis } from "@/components/Thesis";
import { AccessCheck } from "@/components/AccessCheck";
import { Sequence } from "@/components/Sequence";
import { Instrument } from "@/components/Instrument";
import { Outcomes } from "@/components/Outcomes";
import { WhoItsFor } from "@/components/WhoItsFor";
import { Pathways } from "@/components/Pathways";
import { Faq } from "@/components/Faq";

export function Landing() {
  return (
    <>
      <Hero />
      <ApplyBox />
      <WorldSection />
      <Thesis />
      <AccessCheck />
      <Sequence />
      <Instrument />
      <Outcomes />
      <WhoItsFor />
      <Pathways />
      <Faq />
    </>
  );
}
