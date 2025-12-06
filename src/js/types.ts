export interface Tool {
  name: string;
  description: string;
  path: string;
  html: string;
  script?: () => void;
  draft: boolean;
}
