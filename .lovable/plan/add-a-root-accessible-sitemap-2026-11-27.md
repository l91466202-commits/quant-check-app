# Add a root-accessible sitemap

## User-facing result
- Serve valid sitemap XML at `/sitemap.xml` for deployment on Vercel.
- Include the homepage using the site's existing public canonical origin.
- About, Practice Areas, and Contact are in-page sections, not separate routes, so they will not be represented as invented URLs.

## Technical details
- Add the required sitemap helper and a TanStack Start `/sitemap.xml` GET handler.
- Mark the root layout excluded and the homepage included for sitemap inventory.
- Omit `<lastmod>` because there is no authoritative page-specific update timestamp.
- Verify the XML output and the route build; do not modify robots.txt because it was not requested.
