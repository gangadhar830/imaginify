import { clerkMiddleware } from '@clerk/nextjs/server';  // Changed import

export default clerkMiddleware({
  publicRoutes: [
    '/api/webhooks/clerk'
  ]
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};