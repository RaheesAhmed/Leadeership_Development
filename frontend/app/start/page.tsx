"use client";

import { useState } from "react";
import DemographicForm from "@/components/DemographicForm";
import GetAllQuestionByLevel from "@/components/GetAllQuestionByLevel";
import KnowMoreAboutAssesment from "@/components/KnowMoreAboutAssesment";
import { demographicQuestions } from "@/utils/questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormData } from "@/types/types"; // Make sure to import the FormData type

interface ResponsibilityLevel {
  role: string;
  level: number;
  description: string;
}

export default function StartPage() {
  const [stage, setStage] = useState<string>("demographic");
  const [responsibilityLevel, setResponsibilityLevel] =
    useState<ResponsibilityLevel | null>(null);
  const [userInfo, setUserInfo] = useState<FormData | null>(null);

  const handleDemographicSubmit = async (formData: FormData) => {
    console.log("Received form data in StartPage:", formData);
    try {
      // Capitalize the first letter of decisionLevel
      const formattedDecisionLevel =
        formData.decisionLevel.charAt(0).toUpperCase() +
        formData.decisionLevel.slice(1);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/classify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            industry: formData.industry,
            companySize: formData.companySize,
            department: formData.department,
            jobTitle: formData.jobTitle,
            directReports: formData.directReports,
            decisionLevel: formattedDecisionLevel, // Use the formatted value
            typicalProject: formData.typicalProject,
            levelsToCEO: formData.levelsToCEO,
            managesBudget: formData.managesBudget,
          }),
        }
      );
      const data = await response.json();
      console.log("Responsibility level:", data.responsibilityLevel);
      setResponsibilityLevel(data.responsibilityLevel);
      setUserInfo(formData);
      setStage("assessmentOptions");
    } catch (error) {
      console.error("Error classifying responsibility level:", error);
    }
  };

  const handleAssessmentComplete = async (answers: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userInfo,
            responsibilityLevel,
            answers,
          }),
        }
      );
      const data = await response.json();
      console.log("Generated plan:", data);
      setStage("planGenerated");
    } catch (error) {
      console.error("Error generating plan:", error);
    }
  };

  const renderStage = () => {
    switch (stage) {
      case "demographic":
        return (
          <DemographicForm
            demographicQuestions={demographicQuestions}
            onSubmit={handleDemographicSubmit}
          />
        );
      case "assessmentOptions":
        return (
          <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
              <CardTitle>Assessment Options</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <Button onClick={() => setStage("assessmentChoices")}>
                Start Assessment
              </Button>
              <Button
                variant="outline"
                onClick={() => setStage("skipAssessment")}
              >
                Skip Assessment
              </Button>
            </CardContent>
          </Card>
        );
      case "assessmentChoices":
        return (
          <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
              <CardTitle>Choose an Option</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <Button onClick={() => setStage("levelOneQuestions")}>
                Start Now
              </Button>
              <Button variant="outline" onClick={() => setStage("knowMore")}>
                Know More
              </Button>
            </CardContent>
          </Card>
        );
      case "levelOneQuestions":
        return responsibilityLevel ? (
          <GetAllQuestionByLevel
            level={responsibilityLevel.level}
            userInfo={userInfo}
            responsibilityLevel={responsibilityLevel}
            onComplete={handleAssessmentComplete}
          />
        ) : null;
      case "knowMore":
        return responsibilityLevel ? (
          <KnowMoreAboutAssesment level={responsibilityLevel.level} />
        ) : null;
      case "skipAssessment":
        return <div>Assessment skipped. Implement next steps here.</div>;
      case "planGenerated":
        return <div>Plan generated. Display the plan or next steps here.</div>;
      default:
        return null;
    }
  };

  return <div className="container mx-auto px-4 py-8">{renderStage()}</div>;
}
