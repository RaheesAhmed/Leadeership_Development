"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface RaterInfo {
  email: string;
  relationship: string;
}

export default function MultiRaterPage() {
  const [raters, setRaters] = useState<RaterInfo[]>([]);
  const { toast } = useToast();

  const handleAddRater = async (rater: RaterInfo) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/multi-rater`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rater),
        }
      );

      if (!response.ok) throw new Error("Failed to add rater");

      setRaters([...raters, rater]);
      toast({
        title: "Rater added successfully",
        description: "An invitation has been sent to the rater.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add rater. Please try again.",
        variant: "destructive",
      });
    }
  };

  // ... rest of the component
}
