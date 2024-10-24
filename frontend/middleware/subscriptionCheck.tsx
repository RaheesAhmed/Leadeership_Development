"use client";

import { useSubscription } from "../contexts/SubscriptionContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ComponentType } from "react";

export function withSubscriptionCheck<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  return function SubscriptionCheckedComponent(props: P) {
    const { subscriptionStatus, isLoading } = useSubscription();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !subscriptionStatus) {
        router.push("/subscription");
      }
    }, [subscriptionStatus, isLoading, router]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!subscriptionStatus) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
