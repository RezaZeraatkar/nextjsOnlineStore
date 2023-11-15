import { authMiddleware, redirectToSignIn, clerkClient } from '@clerk/nextjs';

// This middleware protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: ['/'],
  async afterAuth(auth, req, evt) {
    // handle users who aren't authenticated
    if (!auth.userId) {
      return redirectToSignIn({ returnBackUrl: req.url });
      // return redirectToSignIn({ returnBackUrl: req.url });
    }
    console.log(await clerkClient.users.getUser(auth.userId));
    // redirect them to organization selection page
    // if (
    //   auth.userId &&
    //   !auth.orgId &&
    //   req.nextUrl.pathname !== '/org-selection'
    // ) {
    //   const orgSelection = new URL('/org-selection', req.url);
    //   return NextResponse.redirect(orgSelection);
    // }
  },
});

export const config = {
  matcher: ['/dashboard/:path*', '/(api|trpc)(.*)'],
};
