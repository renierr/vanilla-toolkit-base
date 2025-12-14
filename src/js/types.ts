export interface Tool {
  name: string;
  description: string;
  path: string;
  html: string;
  script?: () => void;
  draft: boolean;
  example: boolean; // only for template project to mark the examples
  icon?: string;
}
