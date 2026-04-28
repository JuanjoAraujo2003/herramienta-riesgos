export { default } from "next-auth/middleware";

export const config = {
  // Estas son las rutas protegidas. Si alguien intenta entrar aquí, será expulsado al Login.
  matcher: [
    "/",
    "/dashboard",
    "/rat-module",
    "/data-flow",
    "/dpia"
  ]
};