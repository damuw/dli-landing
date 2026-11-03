import { MotionConfig } from "framer-motion";
import { Navbar } from "@/sections/Navbar";
import { SideNav } from "@/components/SideNav";
import { Hero } from "@/sections/Hero";
import { ExperienceLab } from "@/sections/ExperienceLab";
import { Capabilities, TechnologyStrip } from "@/sections/Capabilities";
import { Architecture } from "@/sections/Architecture";
import { MissionControl, Solutions } from "@/sections/Solutions";
import { Industries } from "@/sections/Industries";
import { Work } from "@/sections/Work";
import { VentureFactory } from "@/sections/VentureFactory";
import { Questions } from "@/sections/Questions";
import { Deployment, Footer } from "@/sections/Deployment";

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#f5f6f8] font-sans text-[#0a1424]">
        <Navbar />
        <SideNav />
        <main>
          <Hero />
          <TechnologyStrip />
          <ExperienceLab />
          <Capabilities />
          <Architecture />
          <Solutions />
          <MissionControl />
          <Industries />
          <Work />
          <VentureFactory />
          <Questions />
          <Deployment />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}

export default App;
