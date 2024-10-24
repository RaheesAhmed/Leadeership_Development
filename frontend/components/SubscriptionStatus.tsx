"use client";

import { useSubscription } from "@/contexts/SubscriptionContext";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2 } from "lucide-react";

export default function SubscriptionStatus() {
  const { subscriptionStatus, isLoading, error } = useSubscription();

  if (isLoading) {
    return <Loader2 className="h-4 w-4 animate-spin" />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!subscriptionStatus) {
    return (
      <Alert>
        <AlertDescription>No active subscription found</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Subscription Status</h3>
          <Badge
            variant={
              subscriptionStatus.status === "active" ? "default" : "destructive"
            }
          >
            {subscriptionStatus.status}
          </Badge>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Plan: {subscriptionStatus.plan_type}
          </p>
          <p className="text-sm text-muted-foreground">
            Expires:{" "}
            {new Date(subscriptionStatus.end_date).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
