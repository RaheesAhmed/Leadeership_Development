"use client";

import { useState } from "react";
import DemographicForm from "@/components/DemographicForm";
import GetAllQuestionByLevel from "@/components/GetAllQuestionByLevel";
import KnowMoreAboutAssesment from "@/components/KnowMoreAboutAssesment";
import { demographicQuestions } from "@/utils/questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormData } from "@/types/types"; // Make sure to import the FormData type
import { Loader2 } from "lucide-react"; // Import the Loader2 icon

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
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);

  const handleDemographicSubmit = async (formData: FormData) => {
    console.log("Received form data in StartPage:", formData);
    try {
      // Ensure decisionLevel is a string before using charAt and slice
      const formattedDecisionLevel =
        typeof formData.decisionLevel === "string"
          ? formData.decisionLevel.charAt(0).toUpperCase() +
            formData.decisionLevel.slice(1)
          : String(formData.decisionLevel);

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
            decisionLevel: formattedDecisionLevel,
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
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/assistant/generate-development-plan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userInfo,
            responsibilityLevel,
            answers,
            assessmentCompleted: true,
          }),
        }
      );
      const data = await response.json();
      console.log("Generated plan:", data);
      setGeneratedPlan(data.plan);
      setStage("planGenerated");
    } catch (error) {
      console.error("Error generating plan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipAssessment = async () => {
    if (!userInfo || !responsibilityLevel) {
      console.error("User info or responsibility level is missing");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/assistant/generate-development-plan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userInfo,
            responsibilityLevel,
            assessmentCompleted: false,
          }),
        }
      );
      const data = await response.json();
      console.log("Generated plan:", data);
      setGeneratedPlan(data.plan);
      setStage("planGenerated");
    } catch (error) {
      console.error("Error generating plan:", error);
    } finally {
      setIsLoading(false);
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
        return (
          <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
              <CardTitle>Skipping Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                You've chosen to skip the assessment. We'll generate a
                development plan based on your profile information.
              </p>
              <Button
                onClick={handleSkipAssessment}
                className="mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Plan"
                )}
              </Button>
            </CardContent>
          </Card>
        );
      case "planGenerated":
        return (
          <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
              <CardTitle>Development Plan Generated</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Your development plan has been generated:</p>
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <pre className="whitespace-pre-wrap">{generatedPlan}</pre>
              </div>
              {/* Add a button to view the plan in the dashboard if applicable */}
              <Button
                className="mt-4"
                onClick={() => {
                  /* Navigate to dashboard */
                }}
              >
                View in Dashboard
              </Button>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return <div className="container mx-auto px-4 py-8">{renderStage()}</div>;
}
