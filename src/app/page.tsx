import { Hero } from "@/components/home/Hero";
import { TrustStats } from "@/components/home/TrustStats";
import { AboutPreview } from "@/components/home/AboutPreview";
import { Services } from "@/components/home/Services";
import { ArchitectureShowcase } from "@/components/home/ArchitectureShowcase";
import { WorkmanshipSection } from "@/components/home/WorkmanshipSection";
import { IndianArchitecturePhilosophy } from "@/components/home/IndianArchitecturePhilosophy";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ConstructionProcess } from "@/components/home/ConstructionProcess";
import { Testimonials } from "@/components/home/Testimonials";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <TrustStats />
      <AboutPreview />
      <Services />
      <ArchitectureShowcase />
      <WorkmanshipSection />
      <IndianArchitecturePhilosophy />
      <WhyChooseUs />
      <ConstructionProcess />
      <Testimonials />
      <FinalCTA />
    </div>
  );
}
