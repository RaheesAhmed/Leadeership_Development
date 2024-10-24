"use client";

import React from "react";
import { useSubscription } from "../contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    id: "basic",
    name: "Basic Plan",
    price: "$9.99/month",
    features: [
      "Self-assessment tools",
      "Basic development plan",
      "Email support",
    ],
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: "$29.99/month",
    features: [
      "All Basic features",
      "Multi-rater assessments",
      "Advanced analytics",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    price: "Contact us",
    features: [
      "All Premium features",
      "Custom branding",
      "API access",
      "Dedicated support",
    ],
  },
];

export default function SubscriptionPlans() {
  const { createSubscription, error } = useSubscription();
  const { toast } = useToast();

  const handleSubscribe = async (planType: string) => {
    try {
      // Set end date to 1 year from now
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);

      await createSubscription(planType, endDate.toISOString());

      toast({
        title: "Subscription created",
        description: `You've successfully subscribed to the ${planType} plan`,
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: error || "Failed to create subscription",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center p-8 space-x-8">
      {plans.map((plan) => (
        <Card key={plan.id} className="w-80">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
            <p className="text-3xl">{plan.price}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2">✓</span> {feature}
                </li>
              ))}
            </ul>
            <Button className="w-full" onClick={() => handleSubscribe(plan.id)}>
              Subscribe Now
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
