import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const templates = [
  {
    name: "Meeting Summary",
    description: "Automatically summarize meetings, extract action items, and distribute summaries to participants via email and Slack.",
    category: "productivity",
    icon: "clipboard-list",
    trigger: "webhook",
    isBuiltIn: true,
    steps: [
      {
        id: "block_1",
        type: "trigger",
        label: "Meeting ended",
        config: { eventType: "meeting.ended", source: "calendar" },
      },
      {
        id: "block_2",
        type: "ai_action",
        label: "Summarize meeting",
        config: {
          model: "gpt-4o",
          prompt: "Summarize the following meeting transcript concisely. Extract key decisions, action items, and owners.\n\nTranscript:\n{{transcript}}",
          temperature: 0.3,
          maxTokens: 800,
        },
      },
      {
        id: "block_3",
        type: "condition",
        label: "Any action items?",
        config: { variable: "output.content", operator: "contains", value: "action item" },
      },
      {
        id: "block_4",
        type: "email",
        label: "Send meeting summary",
        config: {
          to: "{{participants}}",
          subject: "Meeting Summary: {{meeting_title}}",
          body: "Hi everyone,\n\nHere is the summary of our meeting:\n\n{{output.content}}\n\nBest,\nFlowMind AI",
        },
      },
      {
        id: "block_5",
        type: "notification",
        label: "Notify team channel",
        config: { channel: "slack", message: "📋 Meeting summary ready for {{meeting_title}} — check your email." },
      },
    ],
  },
  {
    name: "Proposal Generator",
    description: "Generate professional proposals from brief inputs with AI drafting, review pass, and sales team notification.",
    category: "sales",
    icon: "file-text",
    trigger: "webhook",
    isBuiltIn: true,
    steps: [
      {
        id: "block_1",
        type: "trigger",
        label: "Proposal requested",
        config: { eventType: "proposal.requested", source: "crm" },
      },
      {
        id: "block_2",
        type: "ai_action",
        label: "Draft proposal",
        config: {
          model: "gpt-4o",
          prompt: "Write a professional business proposal based on the following requirements. Include an executive summary, scope of work, timeline, and pricing outline.\n\nClient: {{client_name}}\nRequirements: {{requirements}}\nBudget: {{budget}}",
          temperature: 0.7,
          maxTokens: 1500,
        },
      },
      {
        id: "block_3",
        type: "ai_action",
        label: "Review and refine",
        config: {
          model: "gpt-4o",
          prompt: "Review the following proposal for clarity, professionalism, and completeness. Suggest improvements and return a polished version.\n\n{{output.content}}",
          temperature: 0.4,
          maxTokens: 1500,
        },
      },
      {
        id: "block_4",
        type: "notification",
        label: "Notify sales team",
        config: { channel: "slack", message: "📄 New proposal generated for {{client_name}} — ready for review." },
      },
    ],
  },
  {
    name: "Research Workflow",
    description: "Deep research on any topic using Gemini, followed by a concise summary delivered to your team.",
    category: "research",
    icon: "search",
    trigger: "manual",
    isBuiltIn: true,
    steps: [
      {
        id: "block_1",
        type: "trigger",
        label: "Research topic submitted",
        config: { eventType: "manual", source: "dashboard" },
      },
      {
        id: "block_2",
        type: "ai_action",
        label: "Deep research",
        config: {
          model: "gemini-pro",
          prompt: "Conduct thorough research on the following topic. Provide key findings, data points, expert opinions, and recent developments.\n\nTopic: {{topic}}\n\nFormat the response with clear sections and bullet points.",
          temperature: 0.5,
          maxTokens: 2000,
        },
      },
      {
        id: "block_3",
        type: "ai_action",
        label: "Summarize findings",
        config: {
          model: "gpt-4o-mini",
          prompt: "Condense the following research into a 3-bullet executive summary. Focus on the most impactful insights.\n\n{{output.content}}",
          temperature: 0.3,
          maxTokens: 500,
        },
      },
      {
        id: "block_4",
        type: "notification",
        label: "Deliver research report",
        config: { channel: "email", message: "Research complete on {{topic}} — summary and full report attached." },
      },
    ],
  },
  {
    name: "Content Generator",
    description: "Draft, review, and publish blog or social media content with AI-assisted quality checks and editorial workflow.",
    category: "marketing",
    icon: "pen-tool",
    trigger: "webhook",
    isBuiltIn: true,
    steps: [
      {
        id: "block_1",
        type: "trigger",
        label: "Content request received",
        config: { eventType: "content.requested", source: "webhook" },
      },
      {
        id: "block_2",
        type: "ai_action",
        label: "Draft content",
        config: {
          model: "gpt-4o",
          prompt: "Write {{content_type}} content about {{topic}}. Tone: {{tone}}. Target audience: {{audience}}. Include a headline, introduction, main body with 3 key points, and a call to action.\n\nAdditional context:\n{{instructions}}",
          temperature: 0.8,
          maxTokens: 1200,
        },
      },
      {
        id: "block_3",
        type: "condition",
        label: "Needs review?",
        config: { variable: "output.content", operator: "length_greater_than", value: "200" },
      },
      {
        id: "block_4",
        type: "email",
        label: "Send for editorial review",
        config: {
          to: "{{reviewer_email}}",
          subject: "Content draft for review: {{topic}}",
          body: "A new {{content_type}} draft is ready for review:\n\n{{output.content}}\n\nPlease review and provide feedback.",
        },
      },
      {
        id: "block_5",
        type: "notification",
        label: "Notify publishing team",
        config: { channel: "slack", message: "✍️ New {{content_type}} draft for {{topic}} — sent for review." },
      },
    ],
  },
];

async function main() {
  console.log("Seeding workflow templates...");

  for (const t of templates) {
    const existing = await db.workflowTemplate.findFirst({
      where: { name: t.name, isBuiltIn: true },
    });

    if (!existing) {
      await db.workflowTemplate.create({ data: t as typeof t & { steps: unknown } });
      console.log(`  Created: ${t.name}`);
    } else {
      await db.workflowTemplate.update({
        where: { id: existing.id },
        data: t as typeof t & { steps: unknown },
      });
      console.log(`  Updated: ${t.name}`);
    }
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
