import UsersList from "./UsersList";

export default function UsersPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    size?: string;
    search?: string;
  };
}) {
  return (
    <UsersList
      initialPage={Number(searchParams.page) || 1}
      initialSize={Number(searchParams.size) || 10}
      initialSearch={searchParams.search || ""}
    />
  );
}
