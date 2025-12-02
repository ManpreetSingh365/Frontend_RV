import RolesList from "./RolesList";
import { RoleDataProvider } from "@/lib/providers/role-data-provider";

export default function RolesPage() {
    return (
        <RoleDataProvider>
            <RolesList />
        </RoleDataProvider>
    );
}
