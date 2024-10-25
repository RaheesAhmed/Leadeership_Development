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
import { useRouter } from "next/navigation"; // Add this import

interface ResponsibilityLevel {
  role: string;
  level: number;
  description: string;
}

interface MultiRaterData {
  raterEmail: string;
  relationship: string;
  completed: boolean;
}

export default function StartPage() {
  const [stage, setStage] = useState<string>("demographic");
  const [responsibilityLevel, setResponsibilityLevel] =
    useState<ResponsibilityLevel | null>(null);
  const [userInfo, setUserInfo] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [raters, setRaters] = useState<MultiRaterData[]>([]);
  const router = useRouter(); // Add this line

  const handleDemographicSubmit = async (formData: FormData) => {
    console.log("Received form data in StartPage:", formData);
    try {
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
            decisionLevel: formData.decisionLevel,
            typicalProject: formData.typicalProject,
            levelsToCEO: formData.levelsToCEO,
            managesBudget: formData.managesBudget,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to classify responsibility level"
        );
      }

      const data = await response.json();
      console.log("Responsibility level:", data.responsibilityLevel);
      if (!data.responsibilityLevel) {
        throw new Error("Responsibility level not found in response");
      }
      setResponsibilityLevel(data.responsibilityLevel);
      setUserInfo(formData);
      setStage("assessmentOptions");
    } catch (error) {
      console.error("Error classifying responsibility level:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleAssessmentComplete = async (answers: any) => {
    setIsLoading(true);
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      console.error("No authentication token found");
      router.push("/login");
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/assistant/generate-development-plan`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
    if (data.plan) {
      setGeneratedPlan(data.plan);
      setStage("planGenerated");
    }
  };

  const handleSkipAssessment = async () => {
    if (!userInfo || !responsibilityLevel) {
      console.error("User info or responsibility level is missing");
      return;
    }

    setIsLoading(true);

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      console.error("No authentication token found");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/assistant/generate-development-plan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
      if (data.plan) {
        setGeneratedPlan(data.plan);
        setStage("planGenerated");
      }
    } catch (error) {
      console.error("Error generating plan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToDashboard = () => {
    // Store the generated plan in localStorage before navigating
    if (generatedPlan) {
      localStorage.setItem("developmentPlan", generatedPlan);
    }
    router.push("/dashboard");
  };

  const renderStage = () => {
    switch (stage) {
      case "demographic":
        return (
          <>
            <DemographicForm
              demographicQuestions={demographicQuestions}
              onSubmit={handleDemographicSubmit}
            />
          </>
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
          <Card className="max-w-3xl mx-auto mt-8">
            <CardHeader>
              <CardTitle>Your Development Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Based on your profile and assessment, we've generated the
                following development plan:
              </p>
              <div className="mt-4 p-6 bg-gray-100 rounded-md overflow-auto max-h-[60vh]">
                <pre className="whitespace-pre-wrap text-sm">
                  {generatedPlan}
                </pre>
              </div>
              <div className="mt-6 flex justify-between">
                <Button onClick={navigateToDashboard}>View in Dashboard</Button>
                <Button variant="outline" onClick={() => window.print()}>
                  Print Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  const exportAssessmentData = async () => {
    // Add export functionality for consultants/companies
  };

  const generateAggregateReport = async () => {
    // Add reporting functionality for organizational insights
  };

  return <div className="container mx-auto px-4 py-8">{renderStage()}</div>;
}
