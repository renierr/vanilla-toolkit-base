import type { SiteConfig } from './types';

import { siteConfig as defaultConfig } from './site.config.example';
import { isDev } from '../js/utils.ts';

let userConfig: Partial<SiteConfig> = {};

// optional loading
const modules = import.meta.glob('./site.config.ts', { eager: true }) as Record<string, any>;
const first = Object.keys(modules)[0];
if (first) {
  const mod = modules[first];
  userConfig = mod.siteConfig ?? {};
}

export const siteConfig = { ...defaultConfig, ...userConfig } as SiteConfig;

const missingKeys = Object.keys(defaultConfig).filter((key) => !(key in userConfig));
if (missingKeys.length > 0 && isDev) {
  console.warn('New Config-Options available! See site.config.example:', missingKeys.join(', '));
  console.info('Example: cp src/config/site.config.example.ts src/config/site.config.ts');
}
