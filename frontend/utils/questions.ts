import { Question, FormData } from "@/types/types";

export const demographicQuestions: Question[] = [
  {
    id: "name",
    question: "Please enter what name you'd like to use in your report.",
    type: "text",
    placeholder: "Short Answer",
  },
  {
    id: "industry",
    question: "Please specify the industry your organization operates within.",
    type: "text",
    placeholder: "Healthcare, Technology, Manufacturing, or Education",
  },
  {
    id: "companySize",
    question:
      "Please enter the total number of employees in your entire organization.",
    type: "number",
    placeholder: "500",
  },
  {
    id: "department",
    question:
      "Please specify your primary department or division. For those with broader responsibilities, such as overseeing multiple areas or the entire organization, indicate the most encompassing area.",
    type: "text",
    placeholder: "Finance, Western Region Operations, or Company-wide",
  },
  {
    id: "jobTitle",
    question: "Please enter the exact title as used in your workplace.",
    type: "text",
    placeholder: "Enter your exact job title",
  },
  {
    id: "directReports",
    question: "How many people report directly to you?",
    type: "number",
    placeholder: "0",
  },
  {
    id: "directReportRoles",
    question:
      "What types of roles report directly to you? Please list them. If none, please state 'None'.",
    type: "text",
    placeholder: "Manager of Engineering, Sales Coordinator",
  },
  {
    id: "decisionLevel",
    question:
      "What level of decisions do you primarily make? (Please select the most appropriate option)",
    type: "select",
    options: [
      {
        value: "operational",
        label:
          "Operational (day-to-day decisions within your specific role, like processing invoices, responding to customer queries, or maintaining records)",
      },
      {
        value: "tactical",
        label:
          "Tactical (medium-term decisions affecting your team or department, such as improving workflow efficiency or determining project timelines)",
      },
      {
        value: "strategic",
        label:
          "Strategic (long-term decisions that shape major aspects of the organization, such as developing new company-wide programs, setting overarching business strategies, or leading major organizational changes)",
      },
    ],
  },
  {
    id: "typicalProject",
    question:
      "Describe a typical project or task you are responsible for. Please include details about what the task involves, any teams or departments you interact with, and its impact on your organization.",
    type: "textarea",
    placeholder:
      "I develop IT security policies that align with company-wide risk management strategies and coordinate with the legal and tech departments to implement them.",
  },
  {
    id: "levelsToCEO",
    question:
      "How many levels are there between you and the highest-ranking executive in your organization?",
    type: "number",
    placeholder: "3",
  },
  {
    id: "managesBudget",
    question:
      "Does your role require you to manage a budget? If so, is it for your department or across multiple departments?",
    type: "boolean",
    additionalInfo: {
      type: "text",
      question:
        "If Yes, please specify whether it is for your department only or if it spans multiple departments. Example: 'Yes, I manage the budget for the entire marketing department.'",
      placeholder:
        "Yes, I manage the budget for the entire marketing department.",
    },
  },
];
