import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Corrected regex for matching sign-in and sign-up routes
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, request) => {
  // Allow public access to sign-in and sign-up pages
  if (isPublicRoute(request)) {
    return
  }

  // Protect other routes
  await auth.protect()
})

export const config = {
  matcher: [
    '/((?!_next|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
