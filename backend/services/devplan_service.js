export const generateDevelopmentPlan = async (level, answers) => {
  try {
    // ... your existing logic ...

    // Format the response as markdown
    const formattedPlan = `
## Current Level Assessment
${currentLevelAnalysis}

## Development Areas
${developmentAreas}

## Action Items
${actionItems.map((item) => `- ${item}`).join("\n")}

## Timeline and Milestones
${timeline}

## Success Metrics
${metrics.map((metric) => `- ${metric}`).join("\n")}

## Support and Resources Needed
${resources}

---
*Note: This development plan should be reviewed and adjusted periodically based on progress and changing needs.*
    `;

    return formattedPlan;
  } catch (error) {
    console.error("Error generating development plan:", error);
    throw error;
  }
};
