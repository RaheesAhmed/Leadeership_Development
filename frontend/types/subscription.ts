export interface SubscriptionStatus {
  id: string;
  plan_type: string;
  status: string;
  end_date: string;
}

export interface SubscriptionContextType {
  subscriptionStatus: SubscriptionStatus | null;
  isLoading: boolean;
  error: string | null;
  checkSubscription: () => Promise<void>;
  createSubscription: (planType: string, endDate: string) => Promise<void>;
}
