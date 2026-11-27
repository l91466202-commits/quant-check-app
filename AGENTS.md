<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Homepage entrance and scroll effects use Framer Motion with deterministic transforms and reduced-motion fallbacks to keep SSR stable and animation accessible.
- Hero photo overlays share the original image dimensions and object-cover framing to keep the halo and real scales aligned at every screen size.
- Real scale pans animate only on fine-pointer desktop viewports, using opposite sinusoidal transform loops; mobile and reduced-motion views retain static pans to avoid unnecessary animation work.
- Portrait tiles render matching full-frame image crops and use deterministic center-out motion, with 3D transforms limited to desktop.
- Keep active routes focused on the public legal website and preserve historical Cloud migrations for existing database continuity.
- Serve `/sitemap.xml` from a TanStack route generated from explicit route sitemap flags so public URLs follow the route inventory.
