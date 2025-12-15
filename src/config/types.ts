export interface SiteConfig {
  title: string;
  description?: string;
  footerText?: string;
  showExamples: boolean;
  toolSections?: Record<
    string,
    {
      title: string;
      description?: string;
    }
  >;
}

// Extension-Point for derived projects
declare global {
  interface SiteContextCustom {}
}

export interface SiteContext extends SiteContextCustom {
  config: SiteConfig;
}

export {};
