import { getUsers } from "@/lib/service/user.service";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    size?: string;
    search?: string;
  };
}) {

  try {
    const users = await getUsers({
      page: Number(searchParams.page) || 1,
      size: Number(searchParams.size) || 10,
      search: searchParams.search || "",
      sortBy: "createdAt",
      sortOrder: "DESC",
      viewMode: "hierarchy",
    });

    return (
      <div>
        <h1>Users</h1>
        <pre>{JSON.stringify(users, null, 2)}</pre>
      </div>
    );
  } catch (error) {
    console.error("Error fetching users:", error);

    return (
      <div>
        <h1>Users</h1>
        <div style={{ color: "red" }}>
          <p>Error loading users</p>
        </div>
      </div>
    );
  }
}
