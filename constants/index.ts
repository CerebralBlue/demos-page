import { DemoConfig } from "@/types/demo.config";

export const headers = {
  accept: "application/json",
  apikey: "6c5aca86-d343615d-60a44b29-c6dbb084",
}
export const headers2 = {
  accept: "application/json",
  apikey: "598063fe-d9682db0-634ac42c-67bea8bb",
}
export const headers3 = {
  accept: "application/json",
  apikey: "1cb87dc6-03e47a65-d69ce2a3-83d3f947",
}

export const headers4 = {
  accept: "application/json",
  apikey: "cb04b8cf-4f808510-eb1f4890-817d2c15",
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
    category: "SEO Use Cases",
    links: [
      {
        imgURL: "paper-clip",
        route: "/blog-posts-generator",
        label: "Blog Posts Generator Demo",
      },
    ],
  },
  {
    category: "NS Features",
    links: [
      {
        imgURL: "paper-clip",
        route: "/turing-test",
        label: "Turing Test",
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
    category: "PII Use Cases",
    links: [
      {
        imgURL: "users",
        route: "/pii-analyzer",
        label: "PII Analyzer Demo"
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
      {
        imgURL: "users",
        route: "/derrick-demo",
        label: "Derrick Law Demo",
      }
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
    demo_url: "/posts-creator",
    description: "",
    howto: [
      "Hola mundo",
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
    "demo_url": "/turing-test",
    "description": "A modern, interactive Turing Test demo that compares hardcoded human responses with AI-generated responses from leading LLMs. Evaluate whether the AI can pass as human.",
    "howto": [
      "Select the LLM you want to generate the AI answer (e.g., Claude Haiku 3.5 or GPT-40).",
      "A randomized question will be presented.",
      "Click the 'Get Answers' button to generate two answers: one human-written (hardcoded) and one generated by the selected AI.",
      "Choose the answer you believe is written by a human.",
      "After all questions, review your final score and evaluation."
    ],
    "industries": [
      "AI research",
      "Customer support",
      "Conversational AI evaluation",
      "Enterprise AI solutions"
    ],
    "use_cases": [
      "Evaluate AI conversational capabilities.",
      "Compare performance across different AI models.",
      "Demonstrate interactive AI testing for research or product demos."
    ],
    "details": [
      {
        "title": "Turing Test Demo",
        "content": "A demo that simulates a Turing Test by comparing a hardcoded human response with an AI-generated response."
      },
      {
        "title": "Randomized Questions",
        "content": "Questions are shuffled on load to ensure a unique test order for each session."
      },
      {
        "title": "LLM Selection",
        "content": "Easily switch between available models (e.g., Claude Haiku 3.5 and GPT-40) to generate AI answers."
      },
      {
        "title": "Evaluation",
        "content": "User selections are recorded and a final score is calculated to assess the AI's human-like performance."
      },
      {
        "title": "Modern UI",
        "content": "Features a sleek, responsive design with gradient animations and a frosted glass effect."
      },
      {
        "title": "Customizable",
        "content": "Integrate and compare multiple AI models in one interactive demo."
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

export const derrickPrompts = [
  {
    "Record_Type": "EMS/Medical Transport Record",
    "DLF_Dept_Category": "ML",
    "Project_Instructions": "Instructions -- I am going to give you medical records related to the treatment of our personal injury client. These records are from an EMS or medical transport provider that transported our client from the scene of the accident. Please use all of the information provided to you to draft a detailed summary of the narrative report in the records provided. Please include citations to any quotes or information pulled from the materials. If there are any red flags, please identify those as well.\n\nFormat -- Put the draft into a document."
  },
  {
    "Record_Type": "Hospital ER Record",
    "DLF_Dept_Category": "ML",
    "Project_Instructions": "Instructions -- I am going to give you medical records related to the treatment of our personal injury client. These records are from an emergency room (ER) visit or same-day hospital visit. Please use all of the information provided to you to draft a detailed summary of the records provided. Please include citations to any quotes or information pulled from the materials. If there are any red flags, please identify those as well. We specifically want these items addressed in any/all record summaries:\n\n1. Provider name \n2. Client Name & DOB\n3. Complaint and/or Reason for visit\n4. History of present illness \n5. Preexisting conditions related to present complaints \n6. Tests performed with interpretation (imaging, lab work, etc) \n7. Discharge plan, to include medications prescribed and/or treatment recommended, referrals or follow ups\n8. Assignment of benefits or liens\n\nFormat -- Put the draft into a document."
  },
  {
    "Record_Type": "Routine Office Visit Record",
    "DLF_Dept_Category": "ML",
    "Project_Instructions": "Instructions -- I am going to give you medical records related to the treatment of our personal injury client. These records are from an routine medical office visit after their accident. Please use all of the information provided to you to draft a detailed summary of the records provided. Please include citations to any quotes or information pulled from the materials. If there are any red flags, please identify those as well. We specifically want these items addressed in any/all record summaries:\n\n1. Provider Name \n2. Client name & DOB\n3. Complaints and/or Reason for visit\n4. Preexisting conditions related to present complaints \n5. Type of tests performed with interpretation (imaging), \n6. In-office/hospital treatment performed on that date of service\n7. Treatment plan, to include the medications prescribed, referrals to specialist, physical therapy, follow-up appointment, and if a client is at MMI (maximum medical improvement) or has been released from treatment\n8. Assignment of benefits or liens \n\nFormat -- Put the draft into a document."
  },
  {
    "Record_Type": "Therapy Record",
    "DLF_Dept_Category": "ML",
    "Project_Instructions": "Instructions -- I am going to give you medical records related to the treatment of our personal injury client. These records are from therapy appointments after their accident. Please use all of the information provided to you to draft a detailed summary of the records provided. Please include citations to any quotes or information pulled from the materials. If there are any red flags, please identify those as well. We specifically want these items addressed in any/all record summaries:\n\n1. Provider name \n2. Client Name & DOB\n3. Presenting concerns and/or chief complaints \n4. Initial assessment\n5. Discharge assessment \n6. Assignment of benefits or liens \n\nFormat -- Put the draft into a document."
  },
  {
    "Record_Type": "Hospital Admission Record",
    "DLF_Dept_Category": "ML",
    "Project_Instructions": "Instructions -- I am going to give you medical records related to the treatment of our personal injury client. These records are from their overnight hospital admission after their accident. Please use all of the information provided to you to draft a detailed summary of the records provided. Please include citations to any quotes or information pulled from the materials. If there are any red flags, please identify those as well. We specifically want these items addressed in any/all record summaries:\n\n1. Provider Name \n2. Client name & DOB\n3. Complaint and/or reason for visit\n4. History of present illness \n5. Preexisting conditions related to present complaints \n6. Tests performed with interpretation (imaging, lab work, etc) \n7. Consults – name of physician consulted \n8. Surgery performed (if applicable) \n9. Treatment plan for hospital stay\n10. Discharge plan, to include medications prescribed, follow-up appointments, and referrals \n11. Assignment of benefits or liens \n\nFormat -- Put the draft into a document."
  },
  {
    "Record_Type": "Special Evaluation Record (IME, Questionnaires, FCE)",
    "DLF_Dept_Category": "ML",
    "Project_Instructions": "Instructions -- I am going to give you medical records related to the treatment of our personal injury client. These records are from a special evaluation done after the accident, which can include an independent medical exam (IME) by a physician, a physician questionnaire, or a functional capacity evaluation. Please use all of the information provided to you to draft a detailed summary of the records provided. Please include citations to any quotes or information pulled from the materials. If there are any red flags, please identify those as well. We specifically want these items addressed in any/all record summaries:\n\n1. Provider Name \n2. Client name and DOB \n3. Reason for evaluation \n4. Presenting concerns and/or complaints \n5. Preexisting conditions related to current complaints \n6. Provider impression, recommendations, and treatment plan\n\nFormat -- Put the draft into a document."
  },
  {
    "Record_Type": "Imaging Only Report",
    "DLF_Dept_Category": "ML",
    "Project_Instructions": "Instructions -- I am going to give you medical records related to the treatment of our personal injury client. These records are from imaging results, review, and interpretations done by a physician after X-Rays, MRI, CT scan, or other related imaging is done. Please use all of the information provided to you to draft a detailed summary of the records provided. Please include citations to any quotes or information pulled from the materials. If there are any red flags, please identify those as well. We specifically want these items addressed in any/all record summaries:\n\n1. Provider Name \n2. Client name and DOB \n3. Reason for evaluation \n4. Results or impression of interpreting doctor \n\nFormat -- Put the draft into a document."
  },
  {
    "Record_Type": "Client Communication Notes",
    "DLF_Dept_Category": "ML",
    "Project_Instructions": "Instructions -- I am going to give you a copy of the Medical Liaison Paralegal's notes from their calls with our clients while our clients are treating. I need you to summarize those call notes by date, in chronological order, and provide a timeline by month of the highlights across the client's treatment period. If there are any red flags, please identify those as well. We specifically want these items addressed:\n\n1. Date of each call, text, or email\n2. Summary of all notes in chronological order starting with the oldest and going to the newest, separated by month and in a timeline format\n\nFormat -- Put the draft into a document."
  },
  {
    "Record_Type": "All Medical Record",
    "DLF_Dept_Category": "ML",
    "Project_Instructions": "Instructions -- I am going to give you a collection of all the medical records related to the treatment of our personal injury client. Please use all of the information provided to you to draft a chronological summary of the records provided. We specifically want these items addressed in any/all record summaries:\n\n1. Date of Service\n2. Provider Name \n3. Complaint and/or reason for visit\n4. Treatment Plan\n\nFormat -- Please put them in chronological order from oldest to newest by date of service. Please include the Date of Service as the first item on the chronology. \n\nTimeline -- After the summary, I want you to create a timeline of medical treatment noting each date of service, along with the date of accident noted in a different colored dot on the graph. "
  },
  {
    "Record_Type": "All Medical Record",
    "DLF_Dept_Category": "WC",
    "Project_Instructions": "Instructions -- I am going to give you a collection of all the medical records related to the treatment of our personal injury client. Please use all of the information provided to you to draft a chronological summary of the records provided. We specifically want these items addressed in any/all record summaries:\n\n1. Date of Service\n2. Provider Name \n3. Complaint and/or reason for visit\n4. Rating\n5. If MMI (Maximum Medical Improvement) has been reached, to a reasonable degree of medical certainty noted by the physician\n6. Diagnosis\n7. Prior medical history mentioned\n8. Key words \"more likely than not\" and the word \"aggravated\"\n\nFormat -- Please put them in chronological order from oldest to newest by date of service. Please include the Date of Service as the first item on the chronology. After the summary, I want you to create a time series graph of each date of service noted, along with the date of accident noted in a different colored dot on the graph. "
  }
];
