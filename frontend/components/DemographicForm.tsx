"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  ClipboardList,
  User,
  Building,
  Users,
  Briefcase,
  BarChart,
  FileText,
} from "lucide-react";
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
import JourneyText from "@/components/JourneyText";

const icons = {
  name: User,
  industry: Building,
  companySize: Users,
  department: Briefcase,
  jobTitle: Briefcase,
  directReports: Users,
  decisionLevel: BarChart,
  typicalProject: FileText,
  levelsToCEO: BarChart,
  managesBudget: ClipboardList,
};

interface DemographicFormProps {
  demographicQuestions: Question[];
  onSubmit: (formData: FormData) => void;
}

const DemographicForm: React.FC<DemographicFormProps> = ({
  demographicQuestions,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(-1); // Start at -1 to show JourneyText first
  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (id: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    if (currentStep < demographicQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > -1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    console.log("Submitting form data:", formData);
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      console.log("Form submitted successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return demographicQuestions.every((question) => formData[question.id]);
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
            onValueChange={(value) =>
              handleInputChange(question.id, value.toLowerCase())
            }
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

  const currentQuestion = demographicQuestions[currentStep];
  const IconComponent =
    (currentStep >= 0 && icons[currentQuestion.id as keyof typeof icons]) ||
    ClipboardList;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              Professional Background Survey
            </span>
          </CardTitle>
          <CardDescription className="text-center text-lg mt-2">
            Help us understand your leadership experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row">
            <div className="w-full p-6">
              <AnimatePresence mode="wait">
                {currentStep === -1 ? (
                  <motion.div
                    key="journey-text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <JourneyText />
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col md:flex-row"
                  >
                    <div className="md:w-1/2 pr-6">
                      <h2 className="text-sm font-semibold mb-4">
                        {currentQuestion.question}
                      </h2>
                      {renderQuestion(currentQuestion)}
                    </div>
                    <div className="md:w-1/2 flex flex-col items-center justify-center mt-6 md:mt-0">
                      <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                        transition={{
                          duration: 0.5,
                          type: "spring",
                          stiffness: 100,
                        }}
                        className="mb-6"
                      >
                        <IconComponent className="w-32 h-32 text-primary" />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center bg-muted/50 py-6">
          <div className="w-full max-w-md mb-4">
            <div className="w-full bg-secondary rounded-full h-2 mb-2">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    ((currentStep + 2) / (demographicQuestions.length + 1)) *
                    100
                  }%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {currentStep === -1
                ? "Introduction"
                : `Question ${currentStep + 1} of ${
                    demographicQuestions.length
                  }`}
            </p>
          </div>
          <div className="flex justify-between w-full max-w-md">
            <Button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep <= -1}
              variant="outline"
              className="w-28"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              disabled={
                isSubmitting ||
                (currentStep >= 0 &&
                  !formData[demographicQuestions[currentStep].id])
              }
              className="w-28"
            >
              {currentStep < demographicQuestions.length - 1 ? (
                <>
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </>
              ) : isSubmitting ? (
                "Submitting..."
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DemographicForm;
