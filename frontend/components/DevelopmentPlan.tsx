import { Card } from "@/components/ui/card";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

interface DevelopmentPlanProps {
  plan: string;
}

export function DevelopmentPlan({ plan }: DevelopmentPlanProps) {
  // Format the plan as markdown
  const markdownPlan = `
# Development Plan

${plan}

## Key Actions
- Review and understand the plan thoroughly
- Set specific timelines for each action item
- Track progress regularly
- Seek feedback from mentors and supervisors

## Additional Resources
> Consult with your supervisor for additional resources and support specific to your organization.
`;

  return (
    <Card className="p-6">
      <MarkdownRenderer content={markdownPlan} />
    </Card>
  );
}
