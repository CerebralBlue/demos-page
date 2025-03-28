export interface DemoConfig {
    demo_url: string;
    description: string;
    howto: string[];
    industries: string[];
    use_cases: string[];
    logo?: string;
    details: Array<{
      title: string;
      content: string;
    }>;
  }
  