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
      "Let the d-id agent load",
      "Ask any question about sales opportunities like 'How do I present Bedrock in a sales opportunity?'",
      "You can also click the microphone button to ask a question.",
      "Send the question to the bot nad wait for the answer."

    ],
    industries: [
      "Banking",
    ],
    use_cases: [
      "Real time chatting.",
      "Voice chatting.",
    ],
    "details": [
    {
      "title": "Interactive AI Avatar",
      "content": "Engage users with a real-time talking avatar powered by D-ID and NeuralSeek, capable of handling natural language queries via voice or text."
    },
    {
      "title": "Voice Recognition & Synthesis",
      "content": "Users can speak directly to the agent, which understands spoken questions and responds with synthesized voice for a natural conversation flow."
    },
    {
      "title": "Real-time Q&A via NeuralSeek",
      "content": "Answers are dynamically generated by querying NeuralSeek based on user input, ensuring relevant and up-to-date responses."
    }
  ]
  },
  {
    demo_url: "/sow-writer",
    description: "Generate a professional Statement of Work (SOW) document using NeuralSeek AI. Enter a project name and relevant keywords to receive a structured, editable output with scopes, assumptions, and more.",
    howto: [
      "Enter the name of your project in the 'Project Name' field.",
      "Add relevant keywords separated by commas (e.g., cloud, automation, migration).",
      "Click the 'Create SOW' button.",
      "Review the AI-generated content structured into sections like Overview, Scopes, Assumptions, and Resources."
    ],
    industries: [
      "Consulting",
      "IT Services",
      "Project Management",
      "Procurement"
    ],
    use_cases: [
      "Generating initial SOW drafts for client engagements.",
      "Accelerating project proposal workflows.",
      "Standardizing documentation across service teams.",
      "Reducing manual effort in scope definition."
    ],
    details: [
      {
        title: "Keyword-Driven SOW Generation",
        content: "Uses project-specific terms to tailor a Statement of Work to the desired context."
      },
      {
        title: "Auto-Formatted Output",
        content: "Delivers structured content with clear section headers, formatted for easy editing or export."
      },
      {
        title: "Reusable Prompts",
        content: "Supports fast iteration by allowing keyword adjustment and re-generation."
      },
      {
        title: "Minimal Input, Maximum Clarity",
        content: "Generates detailed SOWs from minimal initial input, perfect for drafting proposals on the fly."
      }
    ]
  },  
  {
    demo_url: "/troubleshooter",
    description: "Diagnose and resolve technical issues using NeuralSeek AI. Describe your problem and list attempted solutions to receive personalized troubleshooting guidance.",
    howto: [
      "Describe your technical problem in the 'Troubleshoot Problem' field.",
      "List the steps you've already tried in the 'Things Tried' section and click 'Add' to include them.",
      "Click the 'Solve my problem' button to generate a solution.",
      "Review the AI-generated recommendation."
    ],
    industries: [
      "IT Support",
      "Software Development",
      "Customer Service",
      "Electronics"
    ],
    use_cases: [
      "Technical troubleshooting assistant.",
      "Help desk ticket triage and automation.",
      "User-guided diagnostic tool.",
      "AI-powered support chatbot backend."
    ],
    details: [
      {
        title: "Contextual Troubleshooting",
        content: "Allows users to describe their problem and what they’ve already attempted, enabling smarter and more accurate suggestions."
      },
      {
        title: "Interactive Solution Builder",
        content: "Dynamically adds multiple steps tried by the user to tailor the resolution advice."
      },
      {
        title: "Fast and Actionable Results",
        content: "Returns targeted troubleshooting steps in natural language with minimal input."
      },
      {
        title: "Editable History",
        content: "Users can remove or add steps interactively to refine the context before submitting."
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
    demo_url: "/rfp-writer",
    description: "Generate intelligent answers to RFP questions from tabular files using NeuralSeek. Upload your document, select the question column, and auto-fill the responses.",
    howto: [
      "Upload a CSV or Excel file containing a table of RFP questions.",
      "Select the column that contains the questions.",
      "Click the 'RUN' button to start generating answers row by row.",
      "Once answers are generated, you can download the table with the new responses as a CSV file."
    ],
    industries: [
      "Consulting",
      "Procurement",
      "IT Services",
      "Enterprise Sales"
    ],
    use_cases: [
      "Answering RFP questionnaires automatically.",
      "Streamlining proposal generation workflows.",
      "Reducing time and effort in procurement responses.",
      "Supporting pre-sales teams with AI-generated content."
    ],
    details: [
      {
        title: "Drag-and-Drop Upload",
        content: "Supports direct upload of tabular documents via drag-and-drop or file picker, with real-time parsing and preview."
      },
      {
        title: "Intelligent Column Selection",
        content: "Allows the user to select any column of questions, which NeuralSeek will use as prompts for generating answers."
      },
      {
        title: "Row-by-Row Answering",
        content: "Processes each row individually, generating a contextual answer for every question and updating the table in real time."
      },
      {
        title: "CSV Export Capability",
        content: "Users can download the completed table including all answers as a CSV file, ready for proposal submission."
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
    description: "Translate text between multiple languages using a NeuralSeek-powered AI agent. This demo offers a simple interface to enter text, select source and target languages, and receive an accurate translation instantly.",
    howto: [
      "Select the language to translate from (source).",
      "Select the language to translate to (target).",
      "Type or paste the text you want to translate.",
      "Click the 'Translate' button and wait for the translated text to appear."
    ],
    industries: [
      "Customer Support",
      "Travel",
      "Education",
      "Healthcare"
    ],
    use_cases: [
      "Multilingual communication.",
      "Content localization.",
      "Language learning assistance.",
      "Real-time translation in support scenarios."
    ],
    details: [
      {
        title: "Multilingual Translation Engine",
        content: "Supports translation between major world languages, enabling seamless communication across language barriers."
      },
      {
        title: "NeuralSeek Integration",
        content: "Uses NeuralSeek's AI agent to perform intelligent translation processing with contextual understanding."
      },
      {
        title: "Language Swap Feature",
        content: "Easily reverse source and target languages to streamline bidirectional translation workflows."
      }
    ]
  },
  {
    demo_url: "/search-engine",
    description: "Search across a curated knowledge base with AI-powered results from NeuralSeek. Receive direct answers and explore source documents with highlighted context.",
    howto: [
      "Enter a question in the input field or click on a predefined prompt.",
      "Press Enter or click the paper plane icon to search.",
      "View the direct AI-generated answer at the top.",
      "Explore supporting passages below, including document names, confidence scores, and highlighted context.",
      "Click any document title or link to view the original source."
    ],
    industries: [
      "Knowledge Management",
      "Enterprise Search",
      "Research",
      "Customer Support"
    ],
    use_cases: [
      "Enterprise-wide semantic search.",
      "Question answering from internal documentation.",
      "AI-powered support agent tools.",
      "Real-time content discovery with confidence scoring."
    ],
    details: [
      {
        title: "Direct Answer Highlighting",
        content: "Provides a clear, AI-generated summary answer above the source content for fast consumption."
      },
      {
        title: "Passage-Level Search with Highlights",
        content: "Returns multiple supporting document snippets with keyword highlighting and confidence scores."
      },
      {
        title: "Smart Prompt Suggestions",
        content: "Preloaded questions help guide users toward common queries and demonstrate system capabilities."
      },
      {
        title: "API Integration",
        content: "Built using NeuralSeek's search endpoint with customizable result depth, formatting, and source visibility."
      }
    ]
  },  
  {
    demo_url: "/doc-analyzer",
    description: "Upload and analyze documents using NeuralSeek. Quickly extract insights from your files or ask custom questions about their contents with AI-powered intelligence.",
    howto: [
      "Drag and drop or click to upload a .csv file.",
      "Once uploaded, click 'Analyze document' for an automatic summary.",
      "Alternatively, click 'Custom prompt' to ask specific questions about the file.",
      "View the AI-generated response directly in the interface."
    ],
    industries: [
      "Legal",
      "Financial Services",
      "Insurance",
      "Research"
    ],
    use_cases: [
      "Summarizing uploaded documents.",
      "Asking custom questions about structured data.",
      "Automated analysis of CSV datasets.",
      "Client file intake and intelligent review."
    ],
    details: [
      {
        title: "Drag-and-Drop Upload",
        content: "Supports easy file upload with drag-and-drop functionality and instant file recognition."
      },
      {
        title: "Automated Document Analysis",
        content: "Uses NeuralSeek's AI agent to generate summaries of uploaded files for fast review."
      },
      {
        title: "Custom Prompt Interaction",
        content: "Enables users to submit specific questions about the uploaded content using a dedicated custom prompt agent."
      },
      {
        title: "Structured Response Output",
        content: "Returns clean, preformatted answers within a styled interface for easy reading and export."
      }
    ]
  }
,  
  {
    demo_url: "/limo-demo",
    description: "Explore accredited limo services. Ask about popular pickup locations, view them on the map, and book directly by selecting a time slot—all powered by NeuralSeek.",
    howto: [
      "Read the intro and select a popular location or type your own in the textbox.",
      "Click 'Send' or press Enter to search for a pickup point.",
      "A map will display the location of interest.",
      "Select one of the available time slots to confirm your booking."
    ],
    industries: [
      "Transportation",
      "Hospitality",
      "Tourism"
    ],
    use_cases: [
      "Location-based booking inquiries.",
      "Interactive scheduling for transportation.",
      "Travel planning assistance.",
      "Customer service for local limo providers."
    ],
    details: [
      {
        title: "Interactive Map Integration",
        content: "Automatically locates and displays requested places on an embedded Google Map based on user queries."
      },
      {
        title: "Dynamic Markdown Suggestions",
        content: "Provides clickable options using Markdown formatting to streamline user interaction."
      },
      {
        title: "Real-time Booking Selection",
        content: "Offers a set of predefined time slots to simulate instant booking confirmations."
      },
      {
        title: "NeuralSeek Agents",
        content: "Two AI agents power the experience—one for general guidance and another for booking logistics."
      }
    ]
  },  
  {
    demo_url: "/brou-demo",
    description: "Ask detailed questions about account transfers to the National Treasury. This NeuralSeek-powered demo returns structured, editable Markdown responses and supports dynamic prompt refinement and PDF export.",
    howto: [
      "Choose a suggested question or type your own in the message box.",
      "Press Enter or click the send button to submit the question.",
      "Read the AI-generated Markdown response.",
      "Click the pencil icon to edit the prompt and generate a refined version of the answer.",
      "Click 'Download PDF' to save the entire conversation."
    ],
    industries: [
      "Government",
      "Banking"
    ],
    use_cases: [
      "Answering frequently asked questions.",
      "Providing Markdown-formatted regulatory responses.",
      "Interactive documentation and content generation.",
      "Generating printable reports from conversations."
    ],
    details: [
      {
        title: "Markdown-Based Answers",
        content: "Returns answers in Markdown format for clarity, structure, and easier export or editing."
      },
      {
        title: "Prompt Refinement Workflow",
        content: "Allows users to edit the prompt after receiving a response to generate improved or alternate answers."
      },
      {
        title: "PDF Export",
        content: "Users can download the entire chat history as a PDF for documentation or compliance purposes."
      },
      {
        title: "Dynamic Pre-Prompts",
        content: "Suggests related questions based on user input to guide further inquiry."
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
