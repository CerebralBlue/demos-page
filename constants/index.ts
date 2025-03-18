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
    category: "SEC Reporting Demo",
    links: [
      {
        imgURL: "users",
        route: "/agent-sec",
        label: "SEC Agent",
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
    category: "D-ID Demo",
    links: [
      {
        imgURL: "users",
        route: "/agent-d-id",
        label: "D-ID Agent",
      },
    ],
  },
  {
    category: "RFP Writer Demo",
    links: [
      {
        imgURL: "users",
        route: "/agent-rfp-writer",
        label: "RFP Writer Agent",
      },
    ],
  },

  {
    category: "DOC Analyzer Demo",
    links: [
      {
        imgURL: "users",
        route: "/agent-doc-analyzer",
        label: "DOC Analyzer Agent",
      },
    ],
  },
  {
    category: "Search Engine Demo",
    links: [
      {
        imgURL: "users",
        route: "/agent-search-engine",
        label: "Search Engine Agent",
      },
    ],
  },
  {
    category: "SOW Writer Demo",
    links: [
      {
        imgURL: "users",
        route: "/agent-sow-writer",
        label: "SOW Writer Agent",
      },
    ],
  },
  {
    category: "Law Demo",
    links: [
      {
        imgURL: "document-text",
        route: "/agent-depositions",
        label: "Depositions Agent",
      },
    ],
  },
];

export const topCategoryStyles = {
  "Food and Drink": {
    bg: "bg-blue-25",
    circleBg: "bg-blue-100",
    text: {
      main: "text-blue-900",
      count: "text-blue-700",
    },
    progress: {
      bg: "bg-blue-100",
      indicator: "bg-blue-700",
    },
    icon: "/icons/monitor.svg",
  },
  Travel: {
    bg: "bg-success-25",
    circleBg: "bg-success-100",
    text: {
      main: "text-success-900",
      count: "text-success-700",
    },
    progress: {
      bg: "bg-success-100",
      indicator: "bg-success-700",
    },
    icon: "/icons/coins.svg",
  },
  default: {
    bg: "bg-pink-25",
    circleBg: "bg-pink-100",
    text: {
      main: "text-pink-900",
      count: "text-pink-700",
    },
    progress: {
      bg: "bg-pink-100",
      indicator: "bg-pink-700",
    },
    icon: "/icons/shopping-bag.svg",
  },
};

export const transactionCategoryStyles = {
  "Food and Drink": {
    borderColor: "border-pink-600",
    backgroundColor: "bg-pink-500",
    textColor: "text-pink-700",
    chipBackgroundColor: "bg-inherit",
  },
  Payment: {
    borderColor: "border-success-600",
    backgroundColor: "bg-green-600",
    textColor: "text-success-700",
    chipBackgroundColor: "bg-inherit",
  },
  "Bank Fees": {
    borderColor: "border-success-600",
    backgroundColor: "bg-green-600",
    textColor: "text-success-700",
    chipBackgroundColor: "bg-inherit",
  },
  Transfer: {
    borderColor: "border-red-700",
    backgroundColor: "bg-red-700",
    textColor: "text-red-700",
    chipBackgroundColor: "bg-inherit",
  },
  Processing: {
    borderColor: "border-[#F2F4F7]",
    backgroundColor: "bg-gray-500",
    textColor: "text-[#344054]",
    chipBackgroundColor: "bg-[#F2F4F7]",
  },
  Success: {
    borderColor: "border-[#12B76A]",
    backgroundColor: "bg-[#12B76A]",
    textColor: "text-[#027A48]",
    chipBackgroundColor: "bg-[#ECFDF3]",
  },
  default: {
    borderColor: "",
    backgroundColor: "bg-blue-500",
    textColor: "text-blue-700",
    chipBackgroundColor: "bg-inherit",
  },
};
