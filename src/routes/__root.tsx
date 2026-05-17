import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

// Update this to your actual domain once deployed.
const SITE_URL = "https://www.dumare.me";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Dumaré",
  description:
    "Discover films shaped by your taste profile, watch instantly, and share what you love.",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.png`,
  sameAs: [],
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      // Fallback title — individual routes override this with their own title tag.
      { title: "Dumaré — Discover African stories, made personal" },
      {
        name: "description",
        content:
          "Discover films shaped by your taste profile, watch instantly, and share what you love.",
      },
      { name: "author", content: "Dumaré" },
      { name: "robots", content: "index, follow" },
      // Brand color shown in mobile browser chrome & PWA title bar.
      { name: "theme-color", content: "#f7931e" },

      // Open Graph
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Dumaré" },
      { property: "og:locale", content: "en_US" },
      { property: "og:title", content: "Dumaré — Discover African stories, made personal" },
      {
        property: "og:description",
        content:
          "Discover films shaped by your taste profile, watch instantly, and share what you love.",
      },
      { property: "og:image", content: `${SITE_URL}/whatsapp.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:alt", content: "Dumaré — Discover African stories, made personal" },
      { property: "og:url", content: SITE_URL },

      // Twitter / X
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Dumaré — Discover African stories, made personal" },
      {
        name: "twitter:description",
        content:
          "Discover films shaped by your taste profile, watch instantly, and share what you love.",
      },
      { name: "twitter:image", content: `${SITE_URL}/whatsapp.jpg` },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      // Favicon
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(jsonLd),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    // Inline dark backgrounds on both <html> and <body> so the page is never
    // briefly white before styles.css finishes loading. The full radial
    // --gradient-hero in styles.css still layers over this once parsed; this
    // value is just the solid base (oklch(0.13 0.012 60)) so nothing flashes.
    <html lang="en" style={{ background: "oklch(0.13 0.012 60)" }}>
      <head>
        <HeadContent />
      </head>
      <body style={{ background: "oklch(0.13 0.012 60)", color: "oklch(0.96 0.01 80)" }}>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
