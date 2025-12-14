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

export interface SiteContext {
  config: SiteConfig;
}
