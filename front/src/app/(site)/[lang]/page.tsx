import CategoriesSection from "@/components/landing/CategoriesSection";
import DisputeNotice from "@/components/landing/DisputeNotice";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ListingsSection from "@/components/landing/ListingsSection";
import MembersSection from "@/components/landing/MembersSection";
import SignUpSection from "@/components/landing/SignUpSection";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <ListingsSection />
        <HowItWorksSection />
        <CategoriesSection />
        <MembersSection />
        <DisputeNotice />
        <SignUpSection />
      </main>
      <SiteFooter />
    </>
  );
}
