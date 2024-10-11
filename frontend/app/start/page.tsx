import { Suspense } from "react";
import DemographicForm from "@/components/DemographicForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { demographicQuestions } from "@/utils/questions";

export default async function StartPage() {
  return (
    <div>
      <DemographicForm demographicQuestions={demographicQuestions} />
    </div>
  );
}
