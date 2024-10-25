import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlanDisplayProps {
  plan: {
    formattedPlan: string;
    rawPlan: {
      assessmentOverview: {
        interpretation: string;
      };
      executiveSummary: {
        keyStrengths: string[];
        areasForImprovement: string[];
      };
      additionalResources: {
        additionalResourceLinks: Array<{
          title: string;
          link: string;
          description: string;
        }>;
      };
    };
  };
}

export function PlanDisplay({ plan }: PlanDisplayProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Development Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {/* Convert the formatted plan string to paragraphs */}
            {plan.formattedPlan.split("\n").map(
              (paragraph, index) =>
                paragraph.trim() && (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                )
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Strengths</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6">
            {plan.rawPlan.executiveSummary.keyStrengths.map(
              (strength, index) => (
                <li key={index}>{strength}</li>
              )
            )}
          </ul>
        </CardContent>
      </Card>

      {plan.rawPlan.executiveSummary.areasForImprovement.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6">
              {plan.rawPlan.executiveSummary.areasForImprovement.map(
                (area, index) => (
                  <li key={index}>{area}</li>
                )
              )}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {plan.rawPlan.additionalResources.additionalResourceLinks.map(
              (resource, index) => (
                <li key={index}>
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {resource.title}
                  </a>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({resource.description})
                  </span>
                </li>
              )
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
