export const developmentPlanPrompts = {
  coverPage: `You are an expert leadership development consultant creating a personalized development plan. 
Create a professional cover page and return it as a JSON object with this structure:
{
  "title": "string",
  "participantName": "string",
  "assessmentDate": "string"
}

Context:
- Participant Name: {participantName}
- Assessment Date: {assessmentDate}

Return only valid JSON, no markdown.`,

  executiveSummary: `As an expert leadership development consultant, create an executive summary and return it as a JSON object with this structure:
{
  "overview": "string",
  "keyStrengths": ["string"],
  "areasForImprovement": ["string"]
}

Context:
Role: {role}
Industry: {industry}
Experience Level: {yearsExperience}
Assessment Scores: {scores}
Self-reported Challenges: {challenges}

Return only valid JSON, no markdown.`,

  capabilityAnalysis: `As an expert leadership development consultant, analyze this capability and return it as a JSON object with this structure:
{
  "capabilityName": "string",
  "overview": "string",
  "skillRating": number,
  "confidenceRating": number,
  "selfAssessmentSummary": "string",
  "focusAreas": [
    {
      "name": "string",
      "importance": "string",
      "analysis": "string"
    }
  ],
  "strengths": ["string"],
  "areasForImprovement": ["string"],
  "personalizedRecommendations": [
    {
      "actionStep": "string",
      "expectedBenefit": "string"
    }
  ],
  "recommendedResources": [
    {
      "title": "string",
      "type": "string",
      "link": "string"
    }
  ]
}

Context:
Capability: {capabilityName}
Role: {role}
Industry: {industry}
Experience: {yearsExperience}
Level: {level}
Skill Rating: {skillRating}
Confidence Rating: {confidenceRating}
Responses: {responses}

Return only valid JSON, no markdown.`,

  developmentPlanTemplate: `As an expert leadership development consultant, create a development plan template and return it as a JSON object with this structure:
{
  "instructions": "string",
  "goalSettingTemplate": {
    "areaForImprovement": "string",
    "specificGoal": "string"
  },
  "actionPlanningTemplate": {
    "actionSteps": ["string"],
    "resources": ["string"],
    "timeline": {
      "startDate": "string",
      "targetDate": "string"
    }
  },
  "progressTrackingTemplate": {
    "milestones": [
      {
        "description": "string",
        "targetDate": "string"
      }
    ],
    "reflections": "string"
  },
  "exampleEntry": {
    "goal": "string",
    "actions": ["string"],
    "timeline": "string"
  }
}

Context:
Industry: {industry}
Role: {role}
Level: {level}
Development Areas: {developmentAreas}

Return only valid JSON, no markdown.`,

  conclusion: `As an expert leadership development consultant, create a conclusion and return it as a JSON object with this structure:
{
  "encouragingMessage": "string",
  "nextSteps": ["string"],
  "contactInformation": {
    "email": "string",
    "phone": "string",
    "website": "string"
  }
}

Context:
Name: {name}
Role: {role}
Development Areas: {developmentAreas}
Recommended Actions: {recommendations}

Return only valid JSON, no markdown.`,
};

export const formatInstructions = {
  tone: "Professional, encouraging, and constructive",
  style: "Clear, concise, and action-oriented",
  personalization: "Reference specific assessment data and participant context",
  formatting:
    "Return only valid JSON objects matching the specified structure, no markdown",
  requirements:
    "Ensure all responses are properly formatted JSON that can be parsed",
};
