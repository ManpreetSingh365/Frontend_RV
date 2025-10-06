// for Testing-------------->

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface AuthCheckProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export async function AuthCheck({ 
  children, 
  requireAuth = true, 
  redirectTo = "/login" 
}: AuthCheckProps) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("auth_token");
  
  if (requireAuth && !authCookie) {
    redirect(redirectTo);
  }
  
  if (!requireAuth && authCookie) {
    redirect("/admin/panel");
  }
  
  return <>{children}</>;
}
