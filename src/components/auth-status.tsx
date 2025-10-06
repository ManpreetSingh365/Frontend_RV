import { cookies } from "next/headers";

export async function AuthStatus() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("auth_token");

  console.log(
    "🔍 Auth Status Check:",
    authCookie ? "Authenticated" : "Not authenticated"
  );

  return (
    <div className="p-4 bg-gray-100 rounded">
      <p>
        Auth Status: {authCookie ? "✅ Authenticated" : "❌ Not authenticated"}
      </p>
      {authCookie && (
        <details>
          <summary>Token Details</summary>
          <pre className="text-xs mt-2 bg-gray-200 p-2 rounded">
            {JSON.stringify(
              {
                name: authCookie.name,
                value: authCookie.value.substring(0, 50) + "...",
              },
              null,
              2
            )}
          </pre>
        </details>
      )}
    </div>
  );
}
