import Navbar from "@/components/Navbar"
import Footer from "@/components/sections/Footer";
import HeroSection from "@/components/sections/HeroSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617] text-white">
      <Navbar />
      <HeroSection />
      <Footer />
    </main>
  );
}
