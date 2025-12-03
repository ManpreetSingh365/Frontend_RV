import { Metadata } from "next";
import OrganizationsList from "./OrganizationsList";

export const metadata: Metadata = {
    title: "Organizations | Dashboard",
    description: "Manage organizations in your system",
};

export default function OrganizationsPage() {
    return <OrganizationsList />;
}
