"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  HelpCircle,
  BookOpen,
  Users,
  Target,
  BarChart2,
  Briefcase,
  User,
  MessageCircle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

interface Question {
  question: string;
  ratingQuestion: string;
  reflection: string;
}

interface Area {
  area: string;
  questions: Question[];
}

interface ApiResponse {
  levelOneQuestions: Area[];
}

const areaIcons: { [key: string]: React.ElementType } = {
  "Building a Team": Users,
  "Developing Others": BookOpen,
  "Leading a Team to Get Results": Target,
  "Managing Performance": BarChart2,
  "Managing the Business": Briefcase,
  "Personal Development": User,
  "Creating the Environment": Shield,
};

interface GetAllQuestionByLevelProps {
  level: number;
  userInfo: any; // Replace 'any' with the actual type of userInfo
  responsibilityLevel: any; // Replace 'any' with the actual type of responsibilityLevel
  onComplete: (answers: any) => void; // Add this prop
}

const GetAllQuestionByLevel: React.FC<GetAllQuestionByLevelProps> = ({
  level,
  userInfo,
  responsibilityLevel,
  onComplete,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ApiResponse | null>(null);
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRatingQuestion, setIsRatingQuestion] = useState(true);
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [userReflections, setUserReflections] = useState<
    Record<string, number>
  >({});
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      setError(null);
      const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL;

      try {
        const response = await fetch(
          `${apiUrl}/api/assessment/questions/${level}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();
        setQuestions(result);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError(
          "An error occurred while fetching questions. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [level]);

  useEffect(() => {
    if (questions) {
      const totalQuestions = questions.levelOneQuestions.reduce(
        (sum, area) => sum + area.questions.length,
        0
      );
      const answeredQuestions =
        Object.keys(userRatings).length + Object.keys(userReflections).length;
      const newAllQuestionsAnswered = answeredQuestions === totalQuestions * 2;
      setAllQuestionsAnswered(newAllQuestionsAnswered);
      console.log(
        "All questions answered:",
        newAllQuestionsAnswered,
        "Answered:",
        answeredQuestions,
        "Total:",
        totalQuestions * 2
      );
    }
  }, [questions, userRatings, userReflections]);

  const handleNext = () => {
    if (!questions) return;

    if (isRatingQuestion) {
      setIsRatingQuestion(false);
    } else {
      if (
        currentQuestionIndex <
        questions.levelOneQuestions[currentAreaIndex].questions.length - 1
      ) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else if (currentAreaIndex < questions.levelOneQuestions.length - 1) {
        setCurrentAreaIndex(currentAreaIndex + 1);
        setCurrentQuestionIndex(0);
      } else {
        // All questions are answered, submit the assessment
        handleSubmit();
        return;
      }
      setIsRatingQuestion(true);
    }
  };

  const handlePrevious = () => {
    if (isRatingQuestion) {
      if (currentQuestionIndex > 0 || currentAreaIndex > 0) {
        if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex(currentQuestionIndex - 1);
        } else {
          setCurrentAreaIndex(currentAreaIndex - 1);
          setCurrentQuestionIndex(
            questions!.levelOneQuestions[currentAreaIndex - 1].questions
              .length - 1
          );
        }
        setIsRatingQuestion(false);
      }
    } else {
      setIsRatingQuestion(true);
    }
  };

  const handleRating = (rating: number) => {
    const questionKey = `${currentAreaIndex}-${currentQuestionIndex}`;
    setUserRatings((prev) => ({ ...prev, [questionKey]: rating }));
  };

  const handleReflection = (reflection: number) => {
    const questionKey = `${currentAreaIndex}-${currentQuestionIndex}`;
    setUserReflections((prev) => ({ ...prev, [questionKey]: reflection }));
  };

  const handleSubmit = async () => {
    console.log("handleSubmit called");
    if (!questions) return;

    const allAnswers = questions.levelOneQuestions.flatMap((area, areaIndex) =>
      area.questions.map((question, questionIndex) => {
        const key = `${areaIndex}-${questionIndex}`;
        return {
          area: area.area,
          question: question.question,
          rating: userRatings[key],
          reflection: userReflections[key],
        };
      })
    );

    console.log("Submitting answers:", allAnswers);

    try {
      await onComplete(allAnswers);
      router.push("/results"); // Adjust the route as needed
    } catch (error) {
      console.error("Error submitting assessment:", error);
      setError(
        "An error occurred while submitting the assessment. Please try again."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-12 w-full" />
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

  if (!questions || questions.levelOneQuestions.length === 0) {
    return (
      <Alert>
        <AlertTitle>No Questions Available</AlertTitle>
        <AlertDescription>
          We couldn't find any questions for this assessment level.
        </AlertDescription>
      </Alert>
    );
  }

  const currentArea = questions.levelOneQuestions[currentAreaIndex];
  const currentQuestion = currentArea.questions[currentQuestionIndex];
  const totalQuestions =
    questions.levelOneQuestions.reduce(
      (sum, area) => sum + area.questions.length,
      0
    ) * 2;
  const currentQuestionNumber =
    (questions.levelOneQuestions
      .slice(0, currentAreaIndex)
      .reduce((sum, area) => sum + area.questions.length, 0) +
      currentQuestionIndex) *
      2 +
    (isRatingQuestion ? 1 : 2);
  const questionKey = `${currentAreaIndex}-${currentQuestionIndex}`;

  const AreaIcon = areaIcons[currentArea.area] || MessageCircle;

  const highlightText = (text: string) => {
    return text.replace(
      /(\d $$Not Effectively$$ to \d $$Very Effectively$$)|(\d $$Not Confident$$ to \d $$Very Confident$$)/g,
      '<span class="font-semibold text-primary">$1$2</span>'
    );
  };

  return (
    <div className="min-h-screen max-w-4xl mx-auto p-4 flex flex-col">
      <Card className="flex-grow bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-500/5">
          <CardTitle className="text-2xl font-bold text-primary flex items-center">
            <AreaIcon className="w-8 h-8 mr-3 text-primary" />
            {currentArea.area}
          </CardTitle>
          <CardDescription>
            Question {currentQuestionNumber} of {totalQuestions}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${questionKey}-${
                isRatingQuestion ? "rating" : "reflection"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-4 flex items-center text-primary">
                  {isRatingQuestion ? (
                    <>
                      <Star className="w-6 h-6 mr-2 text-yellow-500" />
                      Rate Your Effectiveness
                    </>
                  ) : (
                    <>
                      <HelpCircle className="w-6 h-6 mr-2 text-blue-500" />
                      Reflect on Your Confidence
                    </>
                  )}
                </h3>
                <p
                  className="mb-6 text-muted-foreground text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(
                      isRatingQuestion
                        ? currentQuestion.ratingQuestion
                        : currentQuestion.reflection
                    ),
                  }}
                />
                <div className="flex justify-center space-x-4">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      variant={
                        (isRatingQuestion
                          ? userRatings[questionKey]
                          : userReflections[questionKey]) === value
                          ? "default"
                          : "outline"
                      }
                      size="lg"
                      onClick={() =>
                        isRatingQuestion
                          ? handleRating(value)
                          : handleReflection(value)
                      }
                      className="w-12 h-12 rounded-full text-lg font-semibold transition-all duration-200 hover:scale-110"
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between mt-6">
          <Button
            onClick={handlePrevious}
            disabled={
              currentAreaIndex === 0 &&
              currentQuestionIndex === 0 &&
              isRatingQuestion
            }
            variant="outline"
            size="lg"
            className="flex items-center text-sm font-semibold hover:bg-primary hover:text-white transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>
          <Button
            onClick={allQuestionsAnswered ? handleSubmit : handleNext}
            disabled={
              !allQuestionsAnswered &&
              ((isRatingQuestion && !userRatings[questionKey]) ||
                (!isRatingQuestion && !userReflections[questionKey]))
            }
            variant="outline"
            size="lg"
            className="flex items-center text-sm font-semibold hover:bg-primary hover:text-white transition-all duration-300"
          >
            {allQuestionsAnswered ? "Submit" : "Next"}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GetAllQuestionByLevel;
