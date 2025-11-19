// app/(dashboard)/admin/panel/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import AppAreaChart from "@/components/chart/AppAreaChart";
import AppBarChart from "@/components/chart/AppBarChart";
import AppPieChart from "@/components/chart/AppPieChart";
import CardList from "@/components/CardList";
import TodoList from "@/components/TodoList";
import { getAuthToken, decodeAuthPayload } from "@/lib/auth-utils";

export default async function AdminPanel() {
  // ✅ Securely read the JWT cookie using your centralized utility
  const token = await getAuthToken();

  if (!token) {
    console.warn("⛔ No valid access_token found — redirecting to /login");
    redirect("/login");
  }

  // ✅ Decode and validate token payload (roles, permissions, expiry, etc.)
  const payload = decodeAuthPayload(token);

  if (!payload) {
    console.error("❌ Failed to decode JWT payload — redirecting to /login");
    redirect("/login");
  }
  const userId = payload.sub || "N/A";

  const userRoles = payload.roles?.join(", ") || "N/A";
  const rolesCount = payload.roles?.length || 0;

  const userPermissions = payload.permissions?.join(", ") || "N/A";
  const permissionsCount = payload.permissions?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            🎉 Authentication Successful!
          </h1>

          <div className="space-y-6">
            <p className="text-lg">Welcome to RouteVision Admin Panel 🚚</p>

            {/* ✅ Cookie Status */}
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h2 className="font-semibold text-green-800 mb-2">
                ✅ Cookie & Token Validation
              </h2>
              <ul className="text-sm text-green-700 space-y-1">
                <li>✓ Cookie successfully stored in browser</li>
                <li>✓ JWT token validated and decoded</li>
                <li>✓ Roles & Permissions extracted</li>
                <li>✓ Protected route access granted</li>
              </ul>
            </div>

            {/* ✅ Token Preview */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                JWT Token Preview:
              </h3>
              <p className="text-xs text-blue-700 font-mono break-all bg-blue-100 p-2 rounded">
                {/* {token.substring(0, 150)}... */}
                {token}
              </p>
            </div>

            {/* ✅ Payload Details */}
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                Decoded Token Details:
              </h3>

              <p className="text-sm text-gray-700">
                <strong>UserId:</strong>
                {userId}
              </p>

              <p className="text-sm text-gray-700">
                <strong>
                  Roles<sub>{rolesCount}</sub> :
                </strong>{" "}
                {userRoles}
              </p>

              <p className="text-sm text-gray-700">
                <strong>
                  Permissions<sub>{permissionsCount}</sub> :
                </strong>{" "}
                {userPermissions}
              </p>

              <p className="text-sm text-gray-700">
                <strong>Initial:</strong>{" "}
                {payload.iat
                  ? new Date(payload.iat * 1000).toLocaleString()
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Expires:</strong>{" "}
                {payload.exp
                  ? new Date(payload.exp * 1000).toLocaleString()
                  : "N/A"}
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

      {/* ✅ Dashboard Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 mt-8">
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
