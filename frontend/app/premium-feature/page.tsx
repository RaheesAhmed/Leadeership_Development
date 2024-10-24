"use client";

import { withSubscriptionCheck } from "../../middleware/subscriptionCheck";
import { ReactNode } from "react";

function PremiumFeaturePage(): ReactNode {
  return (
    <div>
      {/* Your premium feature content */}
      <h1>Premium Feature</h1>
    </div>
  );
}

export default withSubscriptionCheck(PremiumFeaturePage);
