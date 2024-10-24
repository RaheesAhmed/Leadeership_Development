"use client";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select } from "./ui/select";
import { useState } from "react";

interface ReportGeneratorProps {
  assessmentId: string;
}

export function ReportGenerator({ assessmentId }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState<string>("comprehensive");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/reports/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assessmentId,
            reportType,
            includeComparisons: true,
            format: "pdf",
          }),
        }
      );

      const data = await response.json();
      window.open(data.downloadUrl, "_blank");
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // ... rest of the component
}
