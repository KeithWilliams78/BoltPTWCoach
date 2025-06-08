// TODO: Implement Clerk middleware for protecting /app routes
// 
// Example implementation:
// import { authMiddleware } from "@clerk/nextjs";
// 
// export default authMiddleware({
//   publicRoutes: ["/", "/about", "/privacy", "/terms"]
// });
// 
// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };

// For now, allow all routes (no authentication)
export function middleware() {
  // No-op until Clerk is properly configured
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};