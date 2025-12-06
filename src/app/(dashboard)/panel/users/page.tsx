import { Metadata } from "next";
import UsersList from "./UsersList";
import { UserDataProvider } from "@/lib/providers/user-data-provider";

export const metadata: Metadata = {
  title: "Users | Dashboard",
  description: "Manage users",
};


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
    <UserDataProvider>
      <UsersList
        initialPage={Number(params.page) || 1}
        initialSearch={params.search || ""}
        initialPageSize={Number(params.size) || 10}
      />
    </UserDataProvider>
  );
}
