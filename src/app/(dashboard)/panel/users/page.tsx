import UsersList from "./UsersList";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    size?: string;
    search?: string;
  }>;
}) {
  // Await searchParams in Next.js 15+
  const params = await searchParams;

  return (
    <>
      <UsersList
        initialPage={Number(params.page) || 1}
        initialSearch={params.search || ""}
        initialPageSize={Number(params.size) || 10}
      />
    </>
  );
}
