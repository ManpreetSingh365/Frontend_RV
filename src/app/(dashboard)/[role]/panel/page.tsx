import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import AppAreaChart from "@/components/AppAreaChart";
import AppBarChart from "@/components/AppBarChart";
import AppPieChart from "@/components/AppPieChart";
import CardList from "@/components/CardList";
import TodoList from "@/components/TodoList";

async function getAuthStatus() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("auth_token");

  if (!authCookie) {
    redirect("/login");
  }

  return {
    authenticated: true,
    token: authCookie.value,
  };
}

export default async function AdminPanel() {
  const authStatus = await getAuthStatus();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            🎉 Authentication Successful!
          </h1>

          <div className="space-y-6">
            <p className="text-lg">Welcome to RouteVision Admin Panel! 🚚</p>

            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h2 className="font-semibold text-green-800 mb-2">
                ✅ Cookie Status
              </h2>
              <ul className="text-sm text-green-700 space-y-1">
                <li>✓ Cookie successfully stored in browser</li>
                <li>✓ Middleware authentication passed</li>
                <li>✓ Server-side token validation successful</li>
                <li>✓ Protected route access granted</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                JWT Token Preview:
              </h3>
              <p className="text-xs text-blue-700 font-mono break-all bg-blue-100 p-2 rounded">
                {authStatus.token.substring(0, 150)}...
              </p>
            </div>

            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors"
              >
                Logout 🚪
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
        <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
          <AppBarChart />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg">
          <CardList title="Latest Transactions" />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg">
          <AppPieChart />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg">
          <TodoList />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
          <AppAreaChart />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg">
          <CardList title="Popular Content" />
        </div>
      </div>
    </div>
  );
}
