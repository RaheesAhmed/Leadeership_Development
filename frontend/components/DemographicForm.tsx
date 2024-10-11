"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Question, FormData } from "@/types/types";

const DemographicForm = ({
  demographicQuestions,
}: {
  demographicQuestions: Question[];
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (id: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    if (currentStep < demographicQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    try {
      const response = await fetch(`${apiUrl}/api/classify`, {
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
          decisionLevel: formData.decisionLevel
            ? (formData.decisionLevel as string).charAt(0).toUpperCase() +
              (formData.decisionLevel as string).slice(1)
            : undefined,
          typicalProject: formData.typicalProject,
          levelsToCEO: formData.levelsToCEO,
          managesBudget: formData.managesBudget,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Classification result:", result.responsibilityLevel);
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case "text":
      case "number":
        return (
          <Input
            type={question.type}
            id={question.id}
            placeholder={question.placeholder}
            value={formData[question.id]?.toString() || ""}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="mt-2"
          />
        );
      case "textarea":
        return (
          <Textarea
            id={question.id}
            placeholder={question.placeholder}
            value={formData[question.id]?.toString() || ""}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="mt-2"
          />
        );
      case "select":
        return (
          <Select
            onValueChange={(value) => handleInputChange(question.id, value)}
            value={formData[question.id]?.toString() || ""}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "boolean":
        return (
          <div className="flex flex-col space-y-4 mt-2">
            <div className="flex items-center space-x-2">
              <Switch
                id={question.id}
                checked={Boolean(formData[question.id]) || false}
                onCheckedChange={(checked) =>
                  handleInputChange(question.id, checked)
                }
              />
              <Label htmlFor={question.id}>Yes</Label>
            </div>
            {formData[question.id] && question.additionalInfo && (
              <Input
                type={question.additionalInfo.type}
                placeholder={question.additionalInfo.placeholder}
                value={formData[`${question.id}_additional`]?.toString() || ""}
                onChange={(e) =>
                  handleInputChange(`${question.id}_additional`, e.target.value)
                }
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              Demographic Survey
            </span>
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Help us understand your professional background
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {demographicQuestions[currentStep].question}
                  </h2>
                  {renderQuestion(demographicQuestions[currentStep])}
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                variant="outline"
                className="w-28"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              {currentStep < demographicQuestions.length - 1 ? (
                <Button type="button" onClick={handleNext} className="w-28">
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting} className="w-28">
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <div className="w-full bg-secondary rounded-full h-2 mb-2">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    ((currentStep + 1) / demographicQuestions.length) * 100
                  }%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Question {currentStep + 1} of {demographicQuestions.length}
            </p>
          </div>
        </CardFooter>
      </Card>
      {submitSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <Card className="w-96 text-center">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-green-500">
                Success!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-lg">
                Your demographic information has been submitted successfully.
              </p>
              {}
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => setSubmitSuccess(false)}
                className="w-full"
              >
                Close
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default DemographicForm;
