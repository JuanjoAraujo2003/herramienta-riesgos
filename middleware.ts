import { withAuth } from "next-auth/middleware";

// Le entregamos al compilador la función exacta que exige
export default withAuth;

export const config = {
  matcher: [
    "/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)",
  ]
};