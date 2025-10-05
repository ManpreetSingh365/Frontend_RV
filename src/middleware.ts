// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";

// export function middleware(req: NextRequest) {
//   // req.cookies.get() returns RequestCookie | undefined
//   const tokenCookie = req.cookies.get("auth_token");
//   const roleCookie = req.cookies.get("user_role");

//   const token = tokenCookie?.value; // <-- extract string or undefined
//   const role = roleCookie?.value; // <-- extract string or undefined
//   const path = req.nextUrl.pathname; // <-- Current Path

//   // Redirect if no token and trying to access /dashboard
//   //   if (!token && path.startsWith("/dashboard")) {
//   //     return NextResponse.redirect(new URL("/login", req.url));
//   //   }

//   // Verify token if present
//   if (token) {
//     try {
//       const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
//       console.log("payload: " + payload);

//       // attach payload to headers for server-side usage
//       const res = NextResponse.next();
//       res.headers.set("x-user-payload", JSON.stringify(payload));
//       return res;
//     } catch (err) {
//       //   return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }

//   // Optional: prevent users from visiting wrong role dashboards
//   // if (path.includes("/dashboard/admin") && role !== "admin") {
//   //   return NextResponse.redirect(
//   //     new URL(`/dashboard/${role}/panel`, req.url)
//   //   );
//   // }

//   return NextResponse.next();
// }
