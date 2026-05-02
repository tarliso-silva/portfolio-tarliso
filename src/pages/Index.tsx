import ProfileCard from "@/components/portfolio/ProfileCard";
import HeroSection from "@/components/portfolio/HeroSection";

import ProjectsSection from "@/components/portfolio/ProjectsSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import ContactSection from "@/components/portfolio/ContactSection";
import FooterSection from "@/components/portfolio/FooterSection";
import SEOHead from "@/components/SEOHead";

import { useProfiles } from "@/hooks/useProfile";

const Index = () => {
  const { data: profiles = [] } = useProfiles();
  const profile = profiles[0];
  
  const siteTitle = profile?.full_name ? `${profile.full_name} | ${profile.current_focus || "Especialista"}` : "Tarliso Dória | Especialista em Dados, BI e Governança de Dados";
  const siteDescription = profile?.bio_summary || "Portfólio de Tarliso Dória, Especialista em Dados, BI e Governança de Dados.";

  return (
    <div className="min-h-screen bg-background pt-16">
      <SEOHead
        title={siteTitle}
        description={siteDescription}
        canonical="https://tarlisodoria.com/"
        ogType="website"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: profile?.full_name || "Tarliso Dória",
          jobTitle: profile?.current_focus || "Especialista em Dados, BI e Governança de Dados",
          url: "https://tarlisodoria.com",
          sameAs: [],
          knowsAbout: ["Dados", "Business Intelligence", "Power BI", "Governança de Dados", "Engenharia de Dados", "SQL", "Python"],
        }}
      />
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Profile Card */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <ProfileCard />
          </aside>

          {/* Right Column - Main Content */}
          <main className="lg:col-span-8 xl:col-span-9">
            <HeroSection />

            <ProjectsSection />
            <SkillsSection />
            <ContactSection />
            <FooterSection />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;