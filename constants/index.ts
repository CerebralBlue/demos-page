import { DemoConfig } from "@/types/demo.config";

export const headers = {
  accept: "application/json",
  apikey: "6c5aca86-d343615d-60a44b29-c6dbb084",
}

export const sidebarLinks = [
  {
    category: "",
    links: [
      {
        imgURL: "home",
        route: "/home",
        label: "Home",
      },
    ],
  },
  {
    category: "Reporting Use Cases",
    links: [
      {
        imgURL: "users",
        route: "/sec-writer",
        label: "SEC Writer Demo",
      },
      {
        imgURL: "document",
        route: "/ingestions",
        label: "Ingestions",
      },
      {
        imgURL: "document-chart-bar",
        route: "/reports",
        label: "10K Reports",
      },
    ],
  },
  {
    category: "D-ID Use Cases",
    links: [
      {
        imgURL: "users",
        route: "/d-id",
        label: "D-ID Demo",
      },
    ],
  },
  {
    category: "Translation Use Cases",
    links: [
      {
        imgURL: "users",
        route: "/translator",
        label: "Translator Demo",
      },
    ],
  },
  {
    category: "Writing Use cases",
    links: [
      {
        imgURL: "users",
        route: "/sow-writer",
        label: "SOW Writer Demo",
      },
      {
        imgURL: "users",
        route: "/rfp-writer",
        label: "RFP Writer Demo",
      },
    ],
  },
  {
    category: "Troubleshooting Use Cases",
    links: [
      {
        imgURL: "users",
        route: "/troubleshooter",
        label: "Troubleshooter Demo",
      },
    ],
  },
  {
    category: "Docs Analyzer Uses Cases",
    links: [
      {
        imgURL: "users",
        route: "/doc-analyzer",
        label: "DOC Analyzer Demo",
      },
    ],
  },
  {
    category: "Search Engine Use Cases",
    links: [
      {
        imgURL: "users",
        route: "/search-engine",
        label: "Search Engine Demo",
      },
    ],
  },
  {
    category: "Customers Use Cases",
    links: [
      {
        imgURL: "users",
        route: "/brou-demo",
        label: "BROU Demo",
      },
      {
        imgURL: "users",
        route: "/baycrest-demo",
        label: "BayCrest Demo",
      },
    ],
  }
];

export const demoLinkCards = [
  {
    label: "Conversation AI",
    icon: "chat-bubble-bottom-center-text",
    description: "Engage in intelligent, context-aware conversations.",
    creator: "NeuralSeek",
    route: "/demos/conversation-ai",
    demoCount: 150
  },
  {
    label: "Data Insights",
    icon: "document-chart-bar",
    description: "Transform complex data into actionable insights.",
    creator: "NeuralSeek",
    route: "/demos/data-insights",
    demoCount: 75
  },
  {
    label: "Code Assistant",
    icon: "command-line",
    description: "Accelerate your coding with AI-powered suggestions.",
    creator: "NeuralSeek",
    route: "/demos/code-assistant",
    demoCount: 200
  },
  {
    label: "Creative Writing",
    icon: "pencil-square",
    description: "Generate unique, engaging content across genres.",
    creator: "NeuralSeek",
    route: "/demos/creative-writing",
    demoCount: 120
  },
  {
    label: "Research Helper",
    icon: "document-text",
    description: "Streamline research with intelligent summarization.",
    creator: "NeuralSeek",
    route: "/demos/research-helper",
    demoCount: 90
  },
  {
    label: "Trend Analysis",
    icon: "arrow-trending-up",
    description: "Uncover emerging trends with predictive analytics.",
    creator: "NeuralSeek",
    route: "/demos/trend-analysis",
    demoCount: 60
  }
];

export const SIDEBAR_CONFIGS: DemoConfig[] = [
  {
    demo_url: "/sec-writer",
    description: "Ingest financial documents and generate SEC reports. Edit and download reports. Edit with AI text-editor and create charts based on the data.",
    howto: [
      "Upload your 10K or 10Q document.",
      "Click on the 'Generate SEC Report' button.",
      "Edit the report using the AI text editor.",
      "Download the report in your desired format.",
      "Create charts based on the data in the report."
    ],
    industries: [
      "Banking",
      "Insurance",
      "Healthcare",
      "Retail"
    ],
    use_cases: [
      "Docs editing with AI", 
      "Report generation",
      "Data visualization"
    ],
    details: [
      {
        title: "SEC Compliance Automation",
        content: "AI-driven regulatory compliance tracking and reporting system."
      },
      {
        title: "Implementation",
        content: "6-8 weeks comprehensive deployment"
      },
      {
        title: "Key Features",
        content: "Real-time compliance monitoring, Risk assessment, Automated reporting"
      },
      {
        title: "Industry",
        content: "Financial Services, Legal, Regulatory Compliance"
      },
      {
        title: "Customization",
        content: "Tailored workflows, Custom compliance rules"
      },
      {
        title: "AI Capabilities",
        content: "Predictive compliance analysis, Document classification"
      }
    ]
  },
  {
    demo_url: "/d-id",
    description: "",
    howto: [
      "Upload your 10K or 10Q document.",
      "Click on the 'Generate SEC Report' button.",
      "Edit the report using the AI text editor.",
      "Download the report in your desired format.",
      "Create charts based on the data in the report."
    ],
    industries: [
      "Upload your 10K or 10Q document.",
      "Click on the 'Generate SEC Report' button.",
      "Edit the report using the AI text editor.",
      "Download the report in your desired format.",
      "Create charts based on the data in the report."
    ],
    use_cases: [
      "Upload your 10K or 10Q document.",
      "Click on the 'Generate SEC Report' button.",
      "Edit the report using the AI text editor.",
      "Download the report in your desired format.",
      "Create charts based on the data in the report."
    ],
    details: [
      {
        title: "SEC Compliance Automation",
        content: "AI-driven regulatory compliance tracking and reporting system."
      }
    ]
  },
  {
    demo_url: "/ftp-writer",
    description: "",
    howto: [
      "Upload your 10K or 10Q document.",
      "Click on the 'Generate SEC Report' button.",
      "Edit the report using the AI text editor.",
      "Download the report in your desired format.",
      "Create charts based on the data in the report."
    ],
    industries: [
      "Upload your 10K or 10Q document.",
      "Click on the 'Generate SEC Report' button.",
      "Edit the report using the AI text editor.",
      "Download the report in your desired format.",
      "Create charts based on the data in the report."
    ],
    use_cases: [
      "Upload your 10K or 10Q document.",
      "Click on the 'Generate SEC Report' button.",
      "Edit the report using the AI text editor.",
      "Download the report in your desired format.",
      "Create charts based on the data in the report."
    ],
    details: [
      {
        title: "FTP Writer Automation",
        content: "Intelligent file transfer and data management solution."
      },
      {
        title: "Setup Time",
        content: "3-5 weeks from concept to full integration"
      },
      {
        title: "Use Cases",
        content: "Data synchronization, Automated file transfers, Cloud migration"
      },
      {
        title: "Industry",
        content: "IT, Cloud Services, Data Management"
      },
      {
        title: "Key Features",
        content: "Secure file transfers, Scheduling, Error handling"
      },
      {
        title: "Technical Capabilities",
        content: "Multi-protocol support, Advanced encryption"
      }
    ]
  },
  {
    demo_url: "/sow-writter",
    description: "",
    howto: [
      "Upload your 10K or 10Q document.",
      "Click on the 'Generate SEC Report' button.",
      "Edit the report using the AI text editor.",
      "Download the report in your desired format.",
      "Create charts based on the data in the report."
    ],
    industries: [
      "Upload your 10K or 10Q document.",
      "Click on the 'Generate SEC Report' button.",
      "Edit the report using the AI text editor.",
      "Download the report in your desired format.",
      "Create charts based on the data in the report."
    ],
    use_cases: [
      "Upload your 10K or 10Q document.",
      "Click on the 'Generate SEC Report' button.",
      "Edit the report using the AI text editor.",
      "Download the report in your desired format.",
      "Create charts based on the data in the report."
    ],
    details: [
      {
        title: "AI Translation Platform",
        content: "Advanced multilingual translation and localization service."
      }
    ]
  },
  {
    demo_url: "/translator",
    description: "",
    howto: [
      "Upload your 10K or 10Q document.",
      "Click on the 'Generate SEC Report' button.",
      "Edit the report using the AI text editor.",
      "Download the report in your desired format.",
      "Create charts based on the data in the report."
    ],
    industries: [
      "Upload your 10K or 10Q document.",
      "Click on the 'Generate SEC Report' button.",
      "Edit the report using the AI text editor.",
      "Download the report in your desired format.",
      "Create charts based on the data in the report."
    ],
    use_cases: [
      "Upload your 10K or 10Q document.",
      "Click on the 'Generate SEC Report' button.",
      "Edit the report using the AI text editor.",
      "Download the report in your desired format.",
      "Create charts based on the data in the report."
    ],
    details: [
      {
        title: "AI Translation Platform",
        content: "Advanced multilingual translation and localization service."
      },
      {
        title: "Development Cycle",
        content: "5-7 weeks comprehensive development"
      },
      {
        title: "Supported Languages",
        content: "30+ languages, including rare dialects"
      },
      {
        title: "Industry",
        content: "Global Communication, Education, Business"
      },
      {
        title: "Unique Features",
        content: "Context-aware translation, Cultural nuance preservation"
      },
      {
        title: "AI Capabilities",
        content: "Neural machine translation, Continuous learning"
      }
    ]
  },
  {
    demo_url: "/",
    description: "",
    howto: [
      "Upload your 10K or 10Q document.",
      "Click on the 'Generate SEC Report' button.",
      "Edit the report using the AI text editor.",
      "Download the report in your desired format.",
      "Create charts based on the data in the report."
    ],
    industries: [
      "Upload your 10K or 10Q document.",
      "Click on the 'Generate SEC Report' button.",
      "Edit the report using the AI text editor.",
      "Download the report in your desired format.",
      "Create charts based on the data in the report."
    ],
    use_cases: [
      "Upload your 10K or 10Q document.",
      "Click on the 'Generate SEC Report' button.",
      "Edit the report using the AI text editor.",
      "Download the report in your desired format.",
      "Create charts based on the data in the report."
    ],
    details: [
      {
        title: "Description",
        content: "AI-powered automation platform with intelligent task routing and predictive analytics."
      },
      {
        title: "Build Time",
        content: "4-6 weeks from concept to deployment"
      },
      {
        title: "Use Cases",
        content: "Customer support, IT helpdesk, Sales enablement, Knowledge management"
      },
      {
        title: "Industry",
        content: "Enterprise SaaS, Technology, Customer Service"
      },
      {
        title: "Custom Functionality",
        content: "Fully customizable workflow automation, AI-driven insights"
      },
      {
        title: "NeuralSeek Agents",
        content: "Intelligent routing, Predictive analysis, Natural language processing"
      }
    ]
  }
  // {
  //   demo_url: "/",
  //   description: "",
  //   details: [
  //     {
  //       title: "Description",
  //       content: "AI-powered automation platform with intelligent task routing and predictive analytics."
  //     },
  //     {
  //       title: "Build Time",
  //       content: "4-6 weeks from concept to deployment"
  //     },
  //     {
  //       title: "Use Cases",
  //       content: "Customer support, IT helpdesk, Sales enablement, Knowledge management"
  //     },
  //     {
  //       title: "Industry",
  //       content: "Enterprise SaaS, Technology, Customer Service"
  //     },
  //     {
  //       title: "Custom Functionality",
  //       content: "Fully customizable workflow automation, AI-driven insights"
  //     },
  //     {
  //       title: "NeuralSeek Agents",
  //       content: "Intelligent routing, Predictive analysis, Natural language processing"
  //     }
  //   ]
  // }
];
