"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  BookOpen,
  Target,
  BarChart2,
  Briefcase,
  User,
  MessageCircle,
  Shield,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AssessmentInfo {
  Lvl: number;
  " Role Name": string;
  " Description": string;
  " Building a Team": string;
  " Developing Others": string;
  " Leading a Team to Get Results": string;
  " Managing Performance": string;
  " Managing the Business (Business Acumen)": string;
  " Personal Development": string;
  "Communicating as a Leader": string;
  " Creating the Environment (Employee Relations)": string;
}

interface KnowMoreAboutAssessmentProps {
  level: number;
}

const KnowMoreAboutAssessment: React.FC<KnowMoreAboutAssessmentProps> = ({
  level,
}) => {
  const [assessmentInfo, setAssessmentInfo] = useState<AssessmentInfo | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const fetchAssessmentInfo = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/assessment/about/${level}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setAssessmentInfo(data.levelTwoQuestions[0]);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch assessment information");
        setLoading(false);
      }
    };

    fetchAssessmentInfo();
  }, [level]);

  const infoCards = [
    {
      title: "Building a Team",
      icon: Users,
      content: assessmentInfo?.[" Building a Team"],
    },
    {
      title: "Developing Others",
      icon: BookOpen,
      content: assessmentInfo?.[" Developing Others"],
    },
    {
      title: "Leading a Team to Get Results",
      icon: Target,
      content: assessmentInfo?.[" Leading a Team to Get Results"],
    },
    {
      title: "Managing Performance",
      icon: BarChart2,
      content: assessmentInfo?.[" Managing Performance"],
    },
    {
      title: "Managing the Business",
      icon: Briefcase,
      content: assessmentInfo?.[" Managing the Business (Business Acumen)"],
    },
    {
      title: "Personal Development",
      icon: User,
      content: assessmentInfo?.[" Personal Development"],
    },
    {
      title: "Communicating as a Leader",
      icon: MessageCircle,
      content: assessmentInfo?.["Communicating as a Leader"],
    },
    {
      title: "Creating the Environment",
      icon: Shield,
      content:
        assessmentInfo?.[" Creating the Environment (Employee Relations)"],
    },
  ];

  const handleNext = () => {
    setCurrentSection((prev) => (prev + 1) % infoCards.length);
  };

  const handlePrevious = () => {
    setCurrentSection(
      (prev) => (prev - 1 + infoCards.length) % infoCards.length
    );
  };

  const renderContent = (content: string) => {
    return content.split("\n").map((line, index) => {
      if (
        line.startsWith("Specific Themes or Focus Areas:") ||
        line.startsWith("Themes or Focus Areas:")
      ) {
        return (
          <h3
            key={index}
            className="font-semibold mb-4 text-primary text-lg flex items-center"
          >
            <Target className="w-5 h-5 mr-2 inline" />
            {line}
          </h3>
        );
      }
      if (line.includes(":")) {
        const [heading, ...rest] = line.split(":");
        return (
          <div key={index} className="mb-4">
            <h4 className="text-primary font-semibold text-base mb-2 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 inline" />
              {heading}:
            </h4>
            <p className="text-muted-foreground text-sm ml-6">
              {rest.join(":")}
            </p>
          </div>
        );
      }
      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="mb-2 ml-6"
        >
          <p className="text-sm text-muted-foreground">{line}</p>
        </motion.div>
      );
    });
  };

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-64 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!assessmentInfo) {
    return (
      <Alert>
        <AlertTitle>No Information Available</AlertTitle>
        <AlertDescription>
          We couldn't find any information for this assessment level.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="min-h-screen max-w-4xl mx-auto p-4 flex flex-col">
      <Card className="mb-6 bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Briefcase className="w-10 h-10 text-primary mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-primary">
                {assessmentInfo[" Role Name"]}
              </h1>
              <p className="text-lg text-muted-foreground">
                Level: {assessmentInfo.Lvl}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground italic">
            "{assessmentInfo[" Description"]}"
          </p>
        </CardContent>
      </Card>

      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Card className="h-full bg-card/50 backdrop-blur-sm border-primary/10 overflow-hidden">
              <CardHeader className="p-6 bg-gradient-to-r from-primary/5 to-blue-500/5">
                <CardTitle className="flex items-center text-2xl font-bold text-primary">
                  {React.createElement(infoCards[currentSection].icon, {
                    className: "w-8 h-8 mr-3 text-primary",
                  })}
                  {infoCards[currentSection].title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  {renderContent(infoCards[currentSection].content || "")}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={handlePrevious}
          variant="outline"
          size="lg"
          className="flex items-center text-sm font-semibold hover:bg-primary hover:text-white transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>
        <span className="text-sm font-medium text-muted-foreground">
          {currentSection + 1} of {infoCards.length}
        </span>
        <Button
          onClick={handleNext}
          variant="outline"
          size="lg"
          className="flex items-center text-sm font-semibold hover:bg-primary hover:text-white transition-all duration-300"
        >
          Next
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default KnowMoreAboutAssessment;
