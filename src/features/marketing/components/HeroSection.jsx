import HeroText from "./Hero/HeroText";
import HeroPhoneMockup from "./Hero/HeroPhoneMockup";

export default function HeroSection() {
  return (
    <section className="relative isolate pt-32 sm:pt-36 lg:pt-40 pb-10" id="hero">
      <HeroText />
      <HeroPhoneMockup />
    </section>
  );
}
