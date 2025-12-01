import RolesList from "./RolesListComponent";

export default async function RolesPage({
    searchParams,
}: {
    searchParams: Promise<{
        page?: string;
        size?: string;
        search?: string;
    }>;
}) {
    const params = await searchParams;

    return (
        <RolesList
            initialPage={Number(params.page) || 1}
            initialSearch={params.search || ""}
            initialPageSize={Number(params.size) || 10}
        />
    );
}
