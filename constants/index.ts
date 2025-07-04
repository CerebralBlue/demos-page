import { DemoConfig } from "@/types/demo.config";
export const STEPS: { id: number, title: string; description: string }[] = [
  { id: 1, title: "Choose a company", description: "Search for a company" },
  { id: 2, title: "Select items", description: "Select the items you want to report" },
  { id: 3, title: "Report", description: "Display the report" },
  { id: 4, title: "CRM", description: "Push to CRM" },
];
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
        imgURL: "pencil",
        route: "/sec-writer",
        label: "SEC Writer Demo",
      },
      // {
      //   imgURL: "document",
      //   route: "/ingestions",
      //   label: "Ingestions",
      // },
      {
        imgURL: "document-chart-bar",
        route: "/reports",
        label: "10K Reports",
      },
    ],
  },
  {
    category: "Chart Use Cases",
    links: [
      {
        imgURL: "document-chart-bar",
        route: "/charts-generator",
        label: "Creador de gráficos",
      },
    ],
  },
  // {
  //   category: "D-ID Use Cases",
  //   links: [
  //     {
  //       imgURL: "users",
  //       route: "/d-id",
  //       label: "D-ID Demo",
  //     },
  //   ],
  // },
  {
    category: "Translation Use Cases",
    links: [
      {
        imgURL: "document-text",
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
        imgURL: "computer",
        route: "/turing-test",
        label: "Turing Test",
      },
      {
        imgURL: "users",
        route: "/llm-cost-analyzer",
        label: "LLM Cost Analyzer",
      },
    ],
  },
  {
    category: "Writing Use cases",
    links: [
      {
        imgURL: "pencil",
        route: "/sow-writer",
        label: "SOW Writer Demo",
      },
      {
        imgURL: "pencil",
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
    category: "Docs Analyzer Use Cases",
    links: [
      // {
      //   imgURL: "document-text",
      //   route: "/doc-analyzer",
      //   label: "DOC Analyzer Demo",
      // },
      {
        imgURL: "document-text",
        route: "/doc-analyzer-3",
        label: "DOC Analyzer Demo",
      },
      {
        imgURL: "document-text",
        route: "/agreement-analyzer",
        label: "Agreement Analyzer Demo",
      }
    ],
  },
  {
    category: "Customer Support Use Cases",
    links: [
      {
        imgURL: "document-text",
        route: "/customer-support-chatbot",
        label: "Customer Support Chatbot",
      }
    ],
  },
  {
    category: "Seek AI Demo",
    links: [
      {
        imgURL: "document-text",
        route: "/seek-ai-demo",
        label: "Seek AI Demo",
      }
    ],
  },
  {
    category: "Search Engine Use Cases",
    links: [
      {
        imgURL: "search",
        route: "/search-engine",
        label: "Search Engine Demo",
      },
    ],
  },
  {
    category: "PII Use Cases",
    links: [
      {
        imgURL: "card",
        route: "/pii-analyzer",
        label: "PII Analyzer Demo"
      },
      {
        imgURL: "card",
        route: "/pii-analyzer-storage",
        label: "PII Analyzer Demo with Storage"
      },
    ],
  },
  {
    category: "Customers Use Cases",
    links: [
      // {
      //   imgURL: "users",
      //   route: "/brou-demo",
      //   label: "BROU Demo",
      // },
      {
        imgURL: "users",
        route: "/baycrest-demo",
        label: "BayCrest Demo",
      },
      {
        imgURL: "users",
        route: "/derrick-demo",
        label: "Derrick Law Demo",
      },
      {
        imgURL: "users",
        route: "/exentec-demo",
        label: "Exentec Demo",
      },
      {
        imgURL: "users",
        route: "/bcbst-demo",
        label: "BCBS Mississippi Demo",
      },
      {
        imgURL: "users",
        route: "/goodyear-demo",
        label: "Goodyear Demo",
      }
    ],
  },
  {
    category: "Agent Runner",
    links: [
      {
        imgURL: "users",
        route: "/agent-runner",
        label: "Agent Runner Demo",
      }
    ]
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
    ],
    sample_files: [
      {
        path: "/demos-page/files/sec-demo/Bank of America 4Q23 10-K.pdf",
        label: "10-K Sample - PDF",
      },
      {
        path: "/demos-page/files/sec-demo/Balance_sheet_BOA.PDF",
        label: "Financials 1 Sample - PDF",
      },
      {
        path: "/demos-page/files/sec-demo/Income_statement_BOA.pdf",
        label: "Financials 2 Sample - PDF",
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
    details: [
      {
        title: "Interactive AI Avatar",
        content: "Engage users with a real-time talking avatar powered by D-ID and NeuralSeek, capable of handling natural language queries via voice or text."
      },
      {
        title: "Voice Recognition & Synthesis",
        content: "Users can speak directly to the agent, which understands spoken questions and responds with synthesized voice for a natural conversation flow."
      },
      {
        title: "Real-time Q&A via NeuralSeek",
        content: "Answers are dynamically generated by querying NeuralSeek based on user input, ensuring relevant and up-to-date responses."
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
    demo_url: "/charts-generator",
    description: "Edit financial or technical reports and generate charts using NeuralSeek AI. Select any section of the text and request a chart type to visualize insights instantly.",
    howto: [
      "Select the section of text containing the data you want to visualize.",
      "Choose the type of chart (e.g., line, bar, pie) from the dropdown.",
      "Click the 'Generate Chart' button to visualize the data.",
      "Optionally maximize the chart to fullscreen and download it."
    ],
    industries: [
      "Financial Services",
      "Business Intelligence",
      "Compliance Reporting",
      "Consulting"
    ],
    use_cases: [
      "Convert written report data into interactive charts.",
      "Edit and refine financial or analytical documents with AI.",
      "Generate executive summaries with embedded visualizations.",
      "Enhance internal and client-facing reporting with real-time AI insights."
    ],
    details: [
      {
        "title": "Smart Chart Generation",
        "content": "Allows users to select report sections and generate visualizations like line, bar, pie, and scatter charts via NeuralSeek’s AI."
      },
      {
        "title": "Inline Editing and Draft History",
        "content": "Enables users to replace content with AI-modified text and track versioned edits with a built-in draft viewer."
      },
      {
        "title": "Dynamic Chart Rendering",
        "content": "Charts are rendered inline for instant preview and can be maximized for full-screen analysis or downloaded as images."
      },
      {
        "title": "Flexible Prompt-Driven Analysis",
        "content": "Supports prompt-based modifications and analysis modes, giving users control over either editing or visualization tasks."
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
    demo_url: "/pii-analyzer",
    description: "Upload a PDF document to detect and analyze Personally Identifiable Information (PII) using NeuralSeek. View detected elements and download a redacted version or detailed PII report.",
    howto: [
      "Drag and drop a PDF file into the upload area or click to select a file.",
      "Wait while the document is analyzed for PII.",
      "View the summary of detected PII types and instances.",
      "Click 'Show content' to view the processed redacted content.",
      "Download either the redacted PDF or the detailed PII report."
    ],
    industries: [
      "Legal",
      "Healthcare",
      "Finance",
      "Government"
    ],
    use_cases: [
      "PII detection and redaction in compliance documents.",
      "Pre-processing sensitive files before sharing.",
      "Automated privacy audits for uploaded content.",
      "Generating reports for data privacy assessments."
    ],
    details: [
      {
        title: "Drag-and-Drop PDF Upload",
        content: "Users can upload PDF files with a simple drag-and-drop interface for immediate PII scanning."
      },
      {
        title: "Automated PII Detection",
        content: "NeuralSeek identifies potential PII content and classifies it into specific types for easier understanding."
      },
      {
        title: "PDF Redaction and Export",
        content: "Download a redacted version of the uploaded document with PII removed."
      },
      {
        title: "Detailed Report Generation",
        content: "Export a full PII analysis report in PDF format, including detected elements and their classifications."
      }
    ],
    sample_files: [
      {
        path: "/demos-page/files/pii-analyzer-demo/bank_form_sample.pdf",
        label: "Bank Form Sample - PDF",
      }
    ]
  },
  {
    demo_url: "/derrick-law",
    description: "An advanced legal document analysis assistant that supports file ingestion, OCR processing, and prompt-based contextual queries.",
    howto: [
      "Drag and drop or upload legal documents in PDF format on the left panel.",
      "Wait for the file ingestion and OCR process to complete (visible through progress bars).",
      "Use the text input to type your question about a file. You can type '@' to insert an ingested file or '/' to select a predefined prompt.",
      "Submit the message and receive a contextual answer based on file contents and prompt instructions.",
      "Repeat the process for more queries or upload additional files as needed."
    ],
    industries: [
      "Legal",
      "Compliance",
      "Insurance"
    ],
    use_cases: [
      "OCR-based legal document understanding and summarization.",
      "Automated legal question answering using firm-specific data.",
      "Context-aware interactions using predefined legal instructions.",
      "Interactive legal document ingestion and exploration."
    ],
    details: [
      {
        title: "File Ingestion with OCR",
        content: "Supports PDF and other file uploads. Files are automatically processed using OCR to extract their content for analysis."
      },
      {
        title: "Prompt Engineering Autocomplete",
        content: "Users can trigger predefined prompts using '/' or link to files using '@' for precise context building."
      },
      {
        title: "Integrated Document Memory",
        content: "Uploaded file contents are stored and reused for future queries, allowing continuity and reuse of insights."
      },
      {
        title: "Chat-Based Interaction",
        content: "An LLM-based agent interprets questions and responds using both user input and ingested file data for intelligent responses."
      }
    ]
  },
  {
    demo_url: "/baycrest-demo",
    description: "Conversational agent for interactive analytical queries within the BayCrest context. Users can input free-form questions and receive smart answers with context memory.",
    howto: [
      "Start by entering a message in the text box, such as a data-related question or request.",
      "Use predefined prompts at the beginning to test typical questions.",
      "Press 'Enter' or click the send button to submit your query.",
      "Wait for the agent's response, which appears in the chat feed.",
      "Continue the conversation using context-aware queries."
    ],
    industries: [
      "Healthcare",
      "Research",
      "Senior Care"
    ],
    use_cases: [
      "Running conversational analytics on organization-specific data.",
      "Assisting users with knowledge queries in a natural language format.",
      "Maintaining context over multiple questions for deeper analysis."
    ],
    details: [
      {
        title: "Context-Aware Conversations",
        content: "Uses historical message data to provide contextually relevant responses, improving the flow and continuity of analysis."
      },
      {
        title: "Seamless User Input",
        content: "Users can input messages via keyboard or trigger from predefined questions. The interface supports multiline text and Enter-to-send behavior."
      },
      {
        title: "Agent-Driven Analysis",
        content: "Powered by a custom Maistro agent tailored for BayCrest that processes user input and generates insightful answers."
      },
      {
        title: "Responsive Chat UI",
        content: "Includes auto-scrolling and rich chat message formatting for clear visualization of interactions."
      }
    ]
  },
  {
    demo_url: "/blog-posts-generator",
    description: "Create AI-powered blog posts with title, tags, markdown content, and images. Generate one or multiple posts using web-scraping agents, and interact with them using comments and reactions.",
    howto: [
      "Fill in the blog title, tags, and content manually or click 'Write with AI' to auto-generate one article.",
      "Click 'Write with AI Multiple Articles' to generate 10 different posts.",
      "Click 'Generate Post' to preview your manually written or AI-generated content.",
      "View and interact with the rendered blog post(s), including adding comments or reactions."
    ],
    industries: [
      "Content Marketing",
      "Journalism",
      "SEO Optimization",
      "Education"
    ],
    use_cases: [
      "Quickly generating blog drafts from web-scraped content.",
      "Creating educational posts with markdown support.",
      "Automating SEO article creation based on trending topics.",
      "Generating multiple post templates for batch editing."
    ],
    details: [
      {
        title: "AI-Powered Post Generation",
        content: "Leverages web scraping and LLMs to generate full blog content including title, tags, body, and images."
      },
      {
        title: "Markdown Support",
        content: "Allows the content body to be authored or displayed in Markdown with formatting support via ReactMarkdown."
      },
      {
        title: "Multiple Article Generation",
        content: "Generates 10 blog posts at once using a separate agent, ideal for content planning or exploration."
      },
      {
        title: "Reader Interaction",
        content: "Supports user engagement through comments and predefined emoji-based reactions like Like, Love, and Clap."
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
  },
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
    demo_url: "/llm-cost-analyzer",
    description: "The LLM Cost Analyzer demo allows users to compare and analyze pricing, performance, cost, and safety metrics of multiple LLM models with interactive graphs and a futuristic UI. Input parameters like model, size, runs per document, runs per day, and use case complexity to generate detailed metrics and visualizations.",
    howto: [
      "Select your desired LLM model and size on the left and right cards.",
      "Enter the number of runs per document and estimated runs per day.",
      "Choose the use case complexity from the dropdown.",
      "View the calculated metrics in real time on the performance radar chart and cost bar chart.",
      "Review safety metrics represented with progress bars."
    ],
    industries: [
      "Technology and AI research companies",
      "Financial services for budget forecasting",
      "Operational consulting in tech",
      "Enterprise-level decision making"
    ],
    use_cases: [
      "LLM cost and performance analysis",
      "Budget forecasting for AI projects",
      "Comparing vendor pricing for LLM models",
      "Operational efficiency and ROI estimation"
    ],
    details: [
      {
        title: "Real-Time Comparison",
        content: "Compare cost, performance, and safety metrics of different LLM models in real time."
      },
      {
        title: "Customizable Inputs",
        content: "Adjust parameters like runs per document, daily runs, and complexity to see how costs vary."
      },
      {
        title: "Interactive Visualizations",
        content: "Includes responsive radar charts, bar charts, and progress bars for comprehensive metric analysis."
      },
      {
        title: "Futuristic Interface",
        content: "Modern UI with neon gradients, sleek futuristic design, and dark mode support."
      },
      {
        title: "Comprehensive Metrics",
        content: "Analyzes pricing, performance, cost per day, and safety metrics for multiple LLM models."
      },
      {
        title: "Flexible Use Cases",
        content: "Ideal for cost analysis, budgeting, vendor comparison, and strategic planning in AI implementations."
      }
    ]
  },
  {
    demo_url: "/turing-test",
    description: "A modern, interactive Turing Test demo that compares hardcoded human responses with AI-generated responses from leading LLMs. Evaluate whether the AI can pass as human.",
    howto: [
      "Select the LLM you want to generate the AI answer (e.g., Claude Haiku 3.5 or GPT-40).",
      "A randomized question will be presented.",
      "Click the 'Get Answers' button to generate two answers: one human-written (hardcoded) and one generated by the selected AI.",
      "Choose the answer you believe is written by a human.",
      "After all questions, review your final score and evaluation."
    ],
    industries: [
      "AI research",
      "Customer support",
      "Conversational AI evaluation",
      "Enterprise AI solutions"
    ],
    use_cases: [
      "Evaluate AI conversational capabilities.",
      "Compare performance across different AI models.",
      "Demonstrate interactive AI testing for research or product demos."
    ],
    details: [
      {
        title: "Turing Test Demo",
        content: "A demo that simulates a Turing Test by comparing a hardcoded human response with an AI-generated response."
      },
      {
        title: "Randomized Questions",
        content: "Questions are shuffled on load to ensure a unique test order for each session."
      },
      {
        title: "LLM Selection",
        content: "Easily switch between available models (e.g., Claude Haiku 3.5 and GPT-40) to generate AI answers."
      },
      {
        title: "Evaluation",
        content: "User selections are recorded and a final score is calculated to assess the AI's human-like performance."
      },
      {
        title: "Modern UI",
        content: "Features a sleek, responsive design with gradient animations and a frosted glass effect."
      },
      {
        title: "Customizable",
        content: "Integrate and compare multiple AI models in one interactive demo."
      }
    ]
  },
  {
    demo_url: "/agent-runner",
    description: "This demo is a generic interface for running any agent against a document, providing variables and displaying dynamic output.",
    howto: [
      "Create your document-based agent in the `agent-runner` instance. Since it is a doc-based agent, it should require a variable for the document name, which for this demo is required to be exactly named `docName` set with `prompt: true`",
      "Use the Use Document node, and open the NTL to include << name: docName, prompt: true >> in the name field of the node.",
      "To use image data, follow the step above and connect the UseDocument to a Set Variable node like `imageContent`, e.g. to an LLM via its base64 config field.",
      "All variables that you would like displayed in this interface must have `prompt: true` (including `docName`, which takes its value from the Ingested Files section). All variables in the agent NTL that have `prompt: true` and are not named `docName` will appear in the variables section.",
      "Drag-and-drop or click Upload file to send a file to mAIstro for upload. All files can be cleaned by hitting the red trash icon.",
      "Input the values for your variables in the lower-left section.",
      "This demo will try to render HTML in an iframe if the output at all contains `<!DOCTYPE `. Otherwise it attempts to render in Markdown. It supports Chart.js charts."
    ],
    industries: [],
    use_cases: [],
    details: []
  },
  {
    demo_url: "/customer-support-chatbot",
    description: "This AI agent offers formal and efficient customer support, allowing users to inquire about their account, report damages, access consumption data, and receive assistance with a variety of service-related requests.",
    howto: [
      "Six test users were created with ID: LC678, AK556, SL444, CR330, EJ203, JS101.",
      "Type a query in the chat regarding usage, account information, billing, service status, service transfer, or outage.",
      "If the user is not registered, the agent will respond that the user is not recognized.",
    ],
    industries: [
      "Basic service providers",
    ],
    use_cases: [
      "Smart support for consumption information",
      "Smart support for account information",
      "Smart support for billing status inquiries",
      "Smart support for service transfers",
      "Smart support for damage reports",
    ],
    details: [
      {
        title: "Interactive AI Avatar",
        content: "Engage users with a real-time talking avatar powered by D-ID and NeuralSeek, capable of handling natural language queries via voice or text."
      },
      {
        title: "Voice Recognition & Synthesis",
        content: "Users can speak directly to the agent, which understands spoken questions and responds with synthesized voice for a natural conversation flow."
      },
      {
        title: "Real-time Q&A via NeuralSeek",
        content: "Answers are dynamically generated by querying NeuralSeek based on user input, ensuring relevant and up-to-date responses."
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
];

export const CONTRACT_RULES: { id: number; rule: string }[] = [
  { "id": 1, "rule": "The nature, type and format of Entries, or Entry information to be furnished by the Originator.\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." },
  { "id": 2, "rule": "The place and time the Entries or Entry information is to be furnished by the Originator.\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." },
  { "id": 3, "rule": "The Originator’s obligation to obtain valid authorization of Entries from Receivers.\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." },
  { "id": 4, "rule": "Use of proper authorization methods, authorization forms, and ACH formats.\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." },
  { "id": 5, "rule": "The Originator’s obligation to obtain, retain, and provide copies of authorizations, particularly with regard to consumer authorizations under Regulation E.\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." },
  { "id": 6, "rule": "The level of security to be established for delivering the payment data from the Originator to the ODFI, such as transmittals with authorized signatures, the method used to verify authenticity of telecommunicated data, etc.\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." },
  { "id": 7, "rule": "Other data security and data breach provisions.\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." },
  { "id": 8, "rule": "Responsibilities of the participating ODFI and Originator with respect to remaking Rejected Entries or Files.\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." },
  { "id": 9, "rule": "The deadline for Reversals, corrections, or changes by the Originator of Entries or Files, Entry information furnished to the ODFI.\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." },
  { "id": 10, "rule": "Responsibilities of the participating ODFI and Originator with respect to Reclamation Entries.\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." },



  { "id": 11, "rule": "The ODFI’s responsibility for delay by the ACH Operator or RDFI in processing any credit or debit the DFI Transmits to the ACH Operator, or failure to process or credit or debit any such Entry or other acts of omission of a third party.\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." },
  { "id": 12, "rule": "Whether the Origination Agreement covers credit or debit Entries or both.\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." },
  { "id": 13, "rule": "The time when funds may be available to the Originator.\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." },
  { "id": 14, "rule": "The time when the Originator must provide funds to the ODFI.\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." },
  { "id": 15, "rule": "The charges or fees by the ODFI for providing services to the Originator\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." },
  { "id": 16, "rule": "Exposure limits for the Originator.\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." },
  { "id": 17, "rule": "Responsibilities of the ODFI and Originator with respect to handling Originations, Returns, Notifications of Change, dishonored Returns, refused Notifications of Change, and Return Fee Entries.\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." },
  { "id": 18, "rule": "The conditions under which a Third-Party Sender may be utilized.\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." },
  { "id": 19, "rule": "Procedures for terminating the Origination Agreement and time frames under which the processing of Entries under that Origination Agreement will cease.\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." },
  { "id": 20, "rule": "The Originator’s obligation regarding Prenotifications, if Prenotification process is used\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." },
  { "id": 21, "rule": "The Originator’s obligation with respect to consumer alleged errors, including with respect to the ODFI’s Regulation E investigation requirements.\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this doesn't apply." },
  { "id": 22, "rule": "Record retention requirements.\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this doesn't apply.\nIn corporate for credit this applies.." },
  { "id": 23, "rule": "The use of appropriate encryption standards for ACH Entries involving banking information that is Transmitted or exchanged via an Unsecured Electronic Network.\nIn consumer for debit this applies.\nIn consumer for credit this doesn't apply.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." },
  { "id": 24, "rule": "Responsibilities of the ODFI and Originator with respect to handling Acknowledgment Entries, if such transactions are desired by the Originator.\nIn consumer for debit this doesn't apply.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." },
  { "id": 25, "rule": "The Originator’s responsibility for matters warranted or agreed by the ODFI in the Rules pertaining to Entries exchanged through the ACH Network, which may vary depending on the Entry Type.\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." },
  { "id": 26, "rule": "For International ACH Transactions, (IAT entries), • The terms and conditions for the allocation of differences and the assumption of risk for foreign exchange conversion. \n• The rights and responsibilities of the ODFI in the event of an Erroneous Entry.\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." }, { "id": 27, "rule": "The Originator must authorize the Nested Third-Party Sender, Third-Party Sender, and ODFI (as applicable) to \noriginate Entries on behalf of the Originator to Receivers’ accounts\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." }, { "id": 28, "rule": "The Originator must agree to be bound by the Nacha Rules\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." },
  { "id": 29, "rule": "The Originator must agree not to originate Entries that violate the laws of the United States\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this applies.." },
  { "id": 30, "rule": "Include any restrictions on the types of Entries that may be originated\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this applies.\nIn corporate for credit this doesn't apply." }, { "id": 31, "rule": "Include the right of the ODFI, Third-Party Sender, and Nested Third-Party Sender (as applicable) to terminate or \nsuspend the agreement for breach of the Nacha Rules in a manner that permits such party to comply with the Nacha \nRules\nIn consumer for debit this applies.\nIn consumer for credit this applies.\nIn corporate for debit this doesn't apply.\nIn corporate for credit this doesn't apply." },
  { "id": 32, "rule": "Include the right of the ODFI, Third-Party Sender, and Nested Third-Party Sender (as applicable) to terminate or suspend the agreement for breach of the Nacha Rules in a manner that permits such party to comply with the Nacha Rules\nIn consumer for debit this applies.\nIn consumer for credit this doesn't apply.\nIn corporate for debit this doesn't apply.\nIn corporate for credit this doesn't apply." }
];

export const RULES: any = [
  [
    {
      "key": "entryFormat",
      "description": "Define the nature, type, and format of Entries or Entry information to be furnished by the Originator.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "entryTiming",
      "description": "Define the place and time Entries or Entry information is to be furnished by the Originator.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "authorizationRequired",
      "description": "Define the Originator’s obligation to obtain valid authorization of Entries from Receivers.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "authorizationMethod",
      "description": "Define use of proper authorization methods, authorization forms, and ACH formats.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "regulationE",
      "description": "Define the Originator’s obligation to obtain, retain, and provide copies of authorizations, particularly with regard to consumer authorizations under Regulation E.",
      "appliesTo": ["ConsumerDR"]
    },
    {
      "key": "transmissionSecurity",
      "description": "Define the level of security to be established for delivering the payment data from the Originator to the ODFI.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "dataSecurity",
      "description": "Define data security and data breach provisions.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "rejectedHandling",
      "description": "Define responsibilities of ODFI and Originator with respect to remaking Rejected Entries or Files.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "reversalDeadline",
      "description": "Define deadline for Reversals, corrections, or changes by the Originator.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "reclamationResponsibility",
      "description": "Define responsibilities of ODFI and Originator with respect to Reclamation Entries.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "odfiDelayResponsibility",
      "description": "Define ODFI’s responsibility for delays or omissions by the ACH Operator or RDFI.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "entryTypeCovered",
      "description": "Specify whether the Origination Agreement covers credit, debit, or both.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "fundsAvailability",
      "description": "Define when funds may be available to the Originator.",
      "appliesTo": ["ConsumerDR", "ConsumerCR"]
    },
    {
      "key": "fundsProvision",
      "description": "Define when the Originator must provide funds to the ODFI.",
      "appliesTo": ["ConsumerDR", "ConsumerCR"]
    },
    {
      "key": "odfiFees",
      "description": "Define charges or fees by the ODFI for services provided.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "exposureLimits",
      "description": "Define exposure limits for the Originator.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "returnsAndNOCs",
      "description": "Define responsibilities for handling Originations, Returns, Notifications of Change, dishonored Returns, refused NOCs, and Return Fee Entries.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "thirdPartySender",
      "description": "Define the conditions under which a Third-Party Sender may be utilized.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "termination",
      "description": "Define procedures and timeframes for terminating the Origination Agreement.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "prenotificationObligation",
      "description": "Define the Originator’s obligation regarding Prenotifications, if used.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "consumerErrorHandling",
      "description": "Define obligations regarding consumer alleged errors and Regulation E investigation requirements.",
      "appliesTo": ["ConsumerDR"]
    },
    {
      "key": "recordRetention",
      "description": "Define record retention requirements.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "encryptionStandards",
      "description": "Define encryption standards for Entries involving unsecured electronic networks.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "acknowledgmentEntries",
      "description": "Define responsibilities related to Acknowledgment Entries, if used.",
      "appliesTo": ["ConsumerDR"]
    },
    {
      "key": "odfiWarranties",
      "description": "Define responsibilities for matters warranted or agreed by the ODFI in the Rules.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "iatTerms",
      "description": "Define terms for IATs, including FX conversion risk and erroneous entries.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "originatorAuthorization",
      "description": "Originator must authorize ODFI or Third-Party Sender to originate Entries.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "agreeToNachaRules",
      "description": "Originator must agree to be bound by Nacha Rules.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "usLawCompliance",
      "description": "Originator must not originate Entries that violate U.S. laws.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "entryRestrictions",
      "description": "Include any restrictions on types of Entries that may be originated.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "terminationRights",
      "description": "ODFI and others may terminate/suspend agreement for breach of Nacha Rules.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    },
    {
      "key": "auditRights",
      "description": "ODFI and others may audit Originator’s compliance with agreement and Nacha Rules.",
      "appliesTo": ["ConsumerDR", "ConsumerCR", "CorporateDR", "CorporateCR"]
    }
  ]

]