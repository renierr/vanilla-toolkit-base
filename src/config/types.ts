export interface SiteConfig {
  title: string;
  description?: string;
  footerText?: string;
  showExamples: boolean;
}

export interface SiteContext {
  config: SiteConfig;
}
