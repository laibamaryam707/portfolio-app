"use client";

import type { PortfolioData } from "@/lib/types";
import { THEMES } from "./themes";
import {
  NavBar, HeroSection, AboutSection, SkillsSection,
  ProjectsSection, ExperienceSection, CertificatesSection,
  CustomCardsSection, ContactSection, FooterSection,
} from "./sections";

interface Props {
  data: PortfolioData;
}

export default function PortfolioRenderer({ data }: Props) {
  const theme = THEMES[data.profile.layout] || THEMES.modern;

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text}`}>
      <NavBar data={data} theme={theme} />
      <HeroSection data={data} theme={theme} />
      <AboutSection data={data} theme={theme} />
      <SkillsSection data={data} theme={theme} />
      <ProjectsSection data={data} theme={theme} />
      <ExperienceSection data={data} theme={theme} />
      <CertificatesSection data={data} theme={theme} />
      <CustomCardsSection data={data} theme={theme} />
      <ContactSection data={data} theme={theme} />
      <FooterSection data={data} theme={theme} />
    </div>
  );
}
