import { Metadata } from "next";
import RolesList from "./RolesList";
import { RoleDataProvider } from "@/lib/providers/role-data-provider";


export const metadata: Metadata = {
    title: "Roles | Dashboard",
    description: "Manage roles",
};


export default function RolesPage() {
    return (
        <RoleDataProvider>
            <RolesList />
        </RoleDataProvider>
    );
}
