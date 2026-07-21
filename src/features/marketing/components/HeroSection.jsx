import HeroText from "./Hero/HeroText";
import HeroPhoneMockup from "./Hero/HeroPhoneMockup";

export default function HeroSection() {
  return (
    <section className="relative isolate pt-24 sm:pt-28 lg:pt-32 pb-6" id="hero">
      <HeroText />
      <HeroPhoneMockup />
    </section>
  );
}
