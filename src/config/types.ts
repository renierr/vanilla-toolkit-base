export interface SiteConfig {
  title: string;
  description?: string;
  footerText?: string;
}

export interface SiteContext {
  config: SiteConfig;
}
