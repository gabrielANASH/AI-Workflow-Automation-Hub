export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: "free" | "pro" | "enterprise";
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "draft" | "error";
  runs: number;
  lastRun: string;
  createdAt: string;
  updatedAt: string;
  trigger: string;
  steps: number;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  model: string;
  status: "active" | "inactive" | "training";
  capabilities: string[];
  lastUsed: string;
  accuracy: number;
  tasks: number;
}

export interface Analytics {
  totalWorkflows: number;
  activeWorkflows: number;
  totalRuns: number;
  successRate: number;
  avgRunTime: number;
  totalAgents: number;
  runsOverTime: { date: string; runs: number }[];
  successFailRate: { success: number; fail: number };
}

export interface Activity {
  id: string;
  type: "workflow_run" | "agent_trained" | "workflow_created" | "error" | "settings";
  message: string;
  timestamp: string;
  status: "success" | "warning" | "error";
}

export const mockUser: User = {
  id: "usr_1",
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  plan: "pro",
};

export const mockWorkflows: Workflow[] = [
  {
    id: "wf_1",
    name: "Customer Support Pipeline",
    description: "Automates ticket triage and response generation",
    status: "active",
    runs: 1247,
    lastRun: "2 hours ago",
    createdAt: "2026-01-15",
    updatedAt: "2026-06-07",
    trigger: "New ticket created",
    steps: 5,
  },
  {
    id: "wf_2",
    name: "Data Enrichment Flow",
    description: "Enriches lead data with AI-powered research",
    status: "active",
    runs: 892,
    lastRun: "30 mins ago",
    createdAt: "2026-02-20",
    updatedAt: "2026-06-08",
    trigger: "New lead added",
    steps: 3,
  },
  {
    id: "wf_3",
    name: "Content Moderation",
    description: "AI-driven content review and flagging system",
    status: "paused",
    runs: 3451,
    lastRun: "1 day ago",
    createdAt: "2026-03-10",
    updatedAt: "2026-06-01",
    trigger: "Content uploaded",
    steps: 4,
  },
  {
    id: "wf_4",
    name: "Email Classification",
    description: "Sorts and tags incoming emails automatically",
    status: "draft",
    runs: 0,
    lastRun: "Never",
    createdAt: "2026-06-01",
    updatedAt: "2026-06-01",
    trigger: "Email received",
    steps: 2,
  },
  {
    id: "wf_5",
    name: "Report Generator",
    description: "Generates weekly analytics reports",
    status: "error",
    runs: 156,
    lastRun: "3 hours ago",
    createdAt: "2026-04-05",
    updatedAt: "2026-06-08",
    trigger: "Schedule (weekly)",
    steps: 6,
  },
  {
    id: "wf_6",
    name: "Social Media Monitor",
    description: "Monitors brand mentions across platforms",
    status: "active",
    runs: 5230,
    lastRun: "5 mins ago",
    createdAt: "2026-01-01",
    updatedAt: "2026-06-08",
    trigger: "Mention detected",
    steps: 4,
  },
];

export const mockAgents: Agent[] = [
  {
    id: "ag_1",
    name: "Text Analyzer",
    description: "Advanced NLP analysis and sentiment detection",
    model: "GPT-4o",
    status: "active",
    capabilities: ["Sentiment Analysis", "Entity Extraction", "Summarization"],
    lastUsed: "2 mins ago",
    accuracy: 97,
    tasks: 15230,
  },
  {
    id: "ag_2",
    name: "Image Classifier",
    description: "Image recognition and classification system",
    model: "Claude 3.5",
    status: "active",
    capabilities: ["Object Detection", "Classification", "OCR"],
    lastUsed: "15 mins ago",
    accuracy: 94,
    tasks: 8921,
  },
  {
    id: "ag_3",
    name: "Data Extractor",
    description: "Extracts structured data from unstructured sources",
    model: "GPT-4o",
    status: "training",
    capabilities: ["Web Scraping", "PDF Parsing", "Table Extraction"],
    lastUsed: "1 hour ago",
    accuracy: 91,
    tasks: 4567,
  },
  {
    id: "ag_4",
    name: "Code Reviewer",
    description: "Automated code review and suggestion engine",
    model: "Claude 3.5",
    status: "active",
    capabilities: ["Code Analysis", "Bug Detection", "Optimization Tips"],
    lastUsed: "5 mins ago",
    accuracy: 96,
    tasks: 21005,
  },
  {
    id: "ag_5",
    name: "Translation Hub",
    description: "Multi-language translation and localization",
    model: "Gemini Pro",
    status: "inactive",
    capabilities: ["Translation", "Localization", "Language Detection"],
    lastUsed: "3 days ago",
    accuracy: 93,
    tasks: 6789,
  },
];

export const mockAnalytics: Analytics = {
  totalWorkflows: 12,
  activeWorkflows: 8,
  totalRuns: 28532,
  successRate: 94.2,
  avgRunTime: 1.8,
  totalAgents: 7,
  runsOverTime: [
    { date: "Mon", runs: 420 },
    { date: "Tue", runs: 380 },
    { date: "Wed", runs: 510 },
    { date: "Thu", runs: 475 },
    { date: "Fri", runs: 620 },
    { date: "Sat", runs: 290 },
    { date: "Sun", runs: 350 },
  ],
  successFailRate: { success: 94.2, fail: 5.8 },
};

export const mockActivities: Activity[] = [
  {
    id: "act_1",
    type: "workflow_run",
    message: "Customer Support Pipeline completed successfully",
    timestamp: "2 minutes ago",
    status: "success",
  },
  {
    id: "act_2",
    type: "agent_trained",
    message: "Text Analyzer model updated to v2.4",
    timestamp: "15 minutes ago",
    status: "success",
  },
  {
    id: "act_3",
    type: "error",
    message: "Report Generator failed - API timeout",
    timestamp: "3 hours ago",
    status: "error",
  },
  {
    id: "act_4",
    type: "workflow_created",
    message: "New workflow 'Email Classification' created",
    timestamp: "5 hours ago",
    status: "success",
  },
  {
    id: "act_5",
    type: "workflow_run",
    message: "Social Media Monitor processed 142 mentions",
    timestamp: "6 hours ago",
    status: "success",
  },
  {
    id: "act_6",
    type: "settings",
    message: "API key rotated for OpenAI integration",
    timestamp: "1 day ago",
    status: "warning",
  },
];

export const mockBilling = {
  plan: "Pro",
  status: "active",
  nextBilling: "2026-07-08",
  amount: 49,
  currency: "USD",
  interval: "monthly",
  paymentMethod: {
    type: "card",
    last4: "4242",
    brand: "Visa",
    expDate: "08/28",
  },
  invoices: [
    { id: "inv_1", date: "Jun 8, 2026", amount: 49, status: "paid" },
    { id: "inv_2", date: "May 8, 2026", amount: 49, status: "paid" },
    { id: "inv_3", date: "Apr 8, 2026", amount: 49, status: "paid" },
    { id: "inv_4", date: "Mar 8, 2026", amount: 49, status: "paid" },
  ],
};

export interface AIUsageData {
  dailyTokens: { date: string; tokens: number }[];
  totalTokens: number;
  cost: number;
  modelBreakdown: { model: string; percentage: number; cost: number }[];
  avgLatency: number;
}

export interface AgentPerformance {
  agentId: string;
  agentName: string;
  tasksCompleted: number;
  successRate: number;
  avgResponseTime: number;
}

export const mockAIUsage: AIUsageData = {
  dailyTokens: [
    { date: "Mon", tokens: 245000 },
    { date: "Tue", tokens: 312000 },
    { date: "Wed", tokens: 278000 },
    { date: "Thu", tokens: 425000 },
    { date: "Fri", tokens: 389000 },
    { date: "Sat", tokens: 156000 },
    { date: "Sun", tokens: 198000 },
  ],
  totalTokens: 2003000,
  cost: 42.18,
  modelBreakdown: [
    { model: "GPT-4o", percentage: 45, cost: 28.50 },
    { model: "Claude 3.5", percentage: 30, cost: 10.20 },
    { model: "Gemini Pro", percentage: 15, cost: 2.48 },
    { model: "Custom", percentage: 10, cost: 1.00 },
  ],
  avgLatency: 1.4,
};

export const mockAgentPerformance: AgentPerformance[] = [
  { agentId: "ag_1", agentName: "Text Analyzer", tasksCompleted: 4821, successRate: 97.2, avgResponseTime: 0.8 },
  { agentId: "ag_2", agentName: "Image Classifier", tasksCompleted: 3240, successRate: 94.5, avgResponseTime: 1.2 },
  { agentId: "ag_3", agentName: "Data Extractor", tasksCompleted: 1892, successRate: 91.8, avgResponseTime: 2.1 },
  { agentId: "ag_4", agentName: "Code Reviewer", tasksCompleted: 6732, successRate: 96.1, avgResponseTime: 1.6 },
  { agentId: "ag_5", agentName: "Translation Hub", tasksCompleted: 2105, successRate: 93.4, avgResponseTime: 0.9 },
];

export const mockRunsByHour: { hour: string; runs: number }[] = [
  { hour: "00", runs: 45 },
  { hour: "02", runs: 22 },
  { hour: "04", runs: 18 },
  { hour: "06", runs: 38 },
  { hour: "08", runs: 156 },
  { hour: "10", runs: 342 },
  { hour: "12", runs: 289 },
  { hour: "14", runs: 412 },
  { hour: "16", runs: 378 },
  { hour: "18", runs: 256 },
  { hour: "20", runs: 189 },
  { hour: "22", runs: 98 },
];

export const workflowTemplates = [
  {
    id: "tpl_1",
    name: "Customer Support",
    description: "Auto-respond to common customer inquiries",
    icon: "headset",
    steps: 3,
    category: "Support",
  },
  {
    id: "tpl_2",
    name: "Lead Scoring",
    description: "Score and prioritize leads automatically",
    icon: "target",
    steps: 4,
    category: "Sales",
  },
  {
    id: "tpl_3",
    name: "Content Summary",
    description: "Summarize articles and documents",
    icon: "file-text",
    steps: 2,
    category: "Content",
  },
  {
    id: "tpl_4",
    name: "Data Sync",
    description: "Sync data between your apps",
    icon: "refresh-cw",
    steps: 5,
    category: "Integration",
  },
  {
    id: "tpl_5",
    name: "Social Listening",
    description: "Monitor brand mentions across social platforms",
    icon: "radio",
    steps: 3,
    category: "Marketing",
  },
  {
    id: "tpl_6",
    name: "Report Automation",
    description: "Generate and distribute automated reports",
    icon: "bar-chart",
    steps: 4,
    category: "Analytics",
  },
];
