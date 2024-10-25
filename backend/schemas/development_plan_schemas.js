import { z } from "zod";

export const CoverPage = z.object({
  title: z.string(),
  participantName: z.string(),
  assessmentDate: z.string(),
});

export const ExecutiveSummary = z.object({
  overview: z.string(),
  keyStrengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
});

export const PersonalProfile = z.object({
  role: z.string(),
  industry: z.string(),
  yearsOfExperience: z.number(),
  companySize: z.number(),
  responsibilityLevel: z.string(),
});

export const AssessmentOverview = z.object({
  scores: z.array(
    z.object({
      capability: z.string(),
      skillScore: z.number(),
      confidenceScore: z.number(),
    })
  ),
  interpretation: z.string(),
});

export const CapabilityAnalysis = z.object({
  capabilityName: z.string(),
  overview: z.string(),
  skillRating: z.number(),
  confidenceRating: z.number(),
  selfAssessmentSummary: z.string(),
  focusAreas: z.array(
    z.object({
      name: z.string(),
      importance: z.string(),
      analysis: z.string(),
    })
  ),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  personalizedRecommendations: z.array(
    z.object({
      actionStep: z.string(),
      expectedBenefit: z.string(),
    })
  ),
  recommendedResources: z.array(
    z.object({
      title: z.string(),
      type: z.string(),
      link: z.string(),
    })
  ),
});

export const DevelopmentPlan = z.object({
  instructions: z.string(),
  goalSettingTemplate: z.object({
    areaForImprovement: z.string(),
    specificGoal: z.string(),
  }),
  actionPlanningTemplate: z.object({
    actionSteps: z.array(z.string()),
    resources: z.array(z.string()),
    timeline: z.object({
      startDate: z.string(),
      targetDate: z.string(),
    }),
  }),
  progressTrackingTemplate: z.object({
    milestones: z.array(
      z.object({
        description: z.string(),
        targetDate: z.string(),
      })
    ),
    reflections: z.string(),
  }),
  exampleEntry: z.object({
    goal: z.string(),
    actions: z.array(z.string()),
    timeline: z.string(),
  }),
});

export const AdditionalResources = z.object({
  tipsForSuccess: z.array(z.string()),
  commonChallenges: z.array(
    z.object({
      challenge: z.string(),
      solution: z.string(),
    })
  ),
  additionalResourceLinks: z.array(
    z.object({
      title: z.string(),
      link: z.string(),
      description: z.string(),
    })
  ),
});

export const Conclusion = z.object({
  encouragingMessage: z.string(),
  nextSteps: z.array(z.string()),
  contactInformation: z.object({
    email: z.string(),
    phone: z.string().optional(),
    website: z.string().optional(),
  }),
});

export const DevelopmentPlanDocument = z.object({
  coverPage: CoverPage,
  executiveSummary: ExecutiveSummary,
  personalProfile: PersonalProfile,
  assessmentOverview: AssessmentOverview,
  detailedAnalysis: z.array(CapabilityAnalysis),
  developmentPlan: DevelopmentPlan,
  additionalResources: AdditionalResources,
  conclusion: Conclusion,
});
