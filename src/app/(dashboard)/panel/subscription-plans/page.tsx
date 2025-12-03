import { Metadata } from "next";
import SubscriptionPlansList from "./SubscriptionPlansList";

export const metadata: Metadata = {
    title: "Subscription Plans | Dashboard",
    description: "Manage subscription plans for your platform",
};

export default function SubscriptionPlansPage() {
    return <SubscriptionPlansList />;
}
