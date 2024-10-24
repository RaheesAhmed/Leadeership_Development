"use client";

import React from "react";
import SubscriptionPlans from "../../components/SubscriptionPlans";
import SubscriptionStatus from "../../components/SubscriptionStatus";
import { useAuth } from "../../contexts/AuthContext";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

export default function SubscriptionPage() {
  const { user } = useAuth();

  if (!user) {
    redirect("/login");
  }

  return (
    <Card className="max-w-[1200px] mx-auto my-8">
      <CardContent className="space-y-8 py-8">
        <Heading size="2xl" className="text-center">
          Subscription Management
        </Heading>
        <SubscriptionStatus />
        <Heading size="lg" className="text-center">
          Available Plans
        </Heading>
        <SubscriptionPlans />
      </CardContent>
    </Card>
  );
}
