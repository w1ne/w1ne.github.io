# Personal Website Redesign Design

Date: 2026-05-14

## Goal

Redesign Andrii Shylenko's personal website as a writing-forward personal brand site for a technical operator: precise, practical, entrepreneurial, and grounded in shipped embedded/IoT systems.

The redesigned site should primarily serve potential consulting/client leads and founders/operators who want to understand Andrii's engineering judgment, product sense, and practical experience. It should also remain useful to technical peers who read the engineering notes.

## Strategy

The site should lead with engineering notes as the main expression of credibility, then support that credibility with project proof and public outcomes.

Primary positioning:

> Practical notes from building connected systems.

The exact copy can evolve during implementation, but the first screen should communicate:

- Embedded systems and IoT architecture.
- Firmware validation and productization.
- Practical lessons from real systems, not abstract commentary.
- Availability for serious embedded/IoT architecture or productization work.

## Recommended Approach

Use an Astro rebuild rather than continuing with the current Jekyll theme.

Reasons:

- Astro is a better fit for structured content collections, project pages, and reusable layouts.
- The current Jekyll site is an old Jekyll Now derivative with custom includes and accumulated template logic.
- The redesign needs a cleaner information architecture, not only a visual refresh.
- The site can remain static, low-maintenance, and GitHub Pages-compatible.

Rejected alternatives:

- A consulting-first site would optimize harder for lead capture but would undercut the writing-forward identity.
- A project-first portfolio would make Labwired/kernelCAD/UDS/IO-Link highly visible, but would bury the engineering-notes direction.

## Site Structure

The new top-level structure:

- `/` - Homepage.
- `/notes/` - Technical writing index.
- `/projects/` - Project index.
- `/projects/labwired/` - Labwired project page.
- `/projects/kernelcad/` - kernelCAD project page.
- `/projects/uds/` - UDS project page.
- `/projects/iolink/` - IO-Link project page.
- `/about/` - Bio, experience, contact links.
- `/contact/` - Optional route if needed; direct email links are sufficient for the first version.

Existing post URLs must not break. Current Jekyll permalinks use `/:title/`. The rebuild should redirect old post URLs to the corresponding `/notes/<slug>/` pages.

## Homepage Design

The homepage should be content-first and restrained. It should feel like a sharp technical journal with consulting credibility built in.

Sections:

1. Hero
   - Short identity line.
   - Supporting copy explaining embedded systems, IoT architecture, firmware validation, and productization.
   - Direct contact action.

2. Featured notes
   - Three to five curated technical posts.
   - Each item shows title, topic/tags, short summary, and date.
   - This section is the primary proof of judgment.

3. Open-source/project proof
   - Four compact project cards: Labwired, kernelCAD, UDS, IO-Link.
   - Each card states what the project proves technically and links to a dedicated project page.

4. Outcome/proof strip
   - Concise public credibility and outcomes.
   - Examples: shipped connected products, firmware architecture, validation, industrial systems, public tools.

5. Contact CTA
   - Simple and direct.
   - Example direction: "Working on embedded/IoT architecture or productization? Email me."

Visual tone:

- Restrained, technical, content-first.
- Current logo/avatar should be used subtly in header, favicon, or social previews.
- Do not make the current mark the dominant visual identity.
- Avoid a heavy marketing landing page feel.

## Content Model

Use Astro content collections.

### `notes`

Migrated posts from the current Jekyll site.

Fields:

- `title`
- `description`
- `date`
- `tags`
- `legacyUrl`
- `featured`
- `draft`
- `heroImage`

All existing Jekyll posts should be migrated into `src/content/notes/`. Current URLs should redirect to the new note URLs.

The `/notes/` page should support filtering by tag/topic in the first implementation. Full-text search is not required for the first version.

### `projects`

One entry each for:

- Labwired
- kernelCAD
- UDS
- IO-Link

Fields:

- `name`
- `summary`
- `status`
- `repoUrl`
- `topics`
- `proofPoints`
- `featuredNotes`

Each project page should explain what the project is, why it matters, what technical judgment it demonstrates, and where to find the code or related writing.

### Static Pages

`/about/` should replace the current about page with tighter writing, corrected typos, and a clearer consulting/client-facing summary.

## Migration Requirements

Migrate all current posts into the new notes collection.

Preserve old URLs using redirects:

- Source: current `/:title/` post URLs.
- Destination: new `/notes/<slug>/` URLs.

Preserve existing image and file paths where practical so migrated posts keep rendering.

Normalize frontmatter:

- Convert current Jekyll fields such as `blogid`, `sticky`, `featured-image`, and custom tags into the new content schema.
- Keep enough metadata to support featured notes, tags, dates, and summaries.

## Compatibility Risks

The current site includes Jekyll/Liquid features that need audit before implementation:

- Custom includes for calculators.
- YouTube embeds.
- Table of contents include.
- Featured images.
- Disqus comments.
- Search drawer.
- Night mode.
- Analytics.

Implementation should start with a migration audit that classifies posts into:

- Plain markdown.
- Needs Astro component conversion.
- Needs manual cleanup.

Do not blindly port search, comments, or night mode. Bring them forward only if they still support the redesigned site.

## Technical Architecture

Astro rebuild in the same repository.

Expected structure:

- `src/pages/` for routes.
- `src/content/notes/` for migrated writing.
- `src/content/projects/` for project entries.
- `src/components/` for reusable UI.
- `src/layouts/` for page and prose layouts.
- `public/` or preserved root assets for static files, depending on Astro/GitHub Pages needs.

Core components:

- `SiteHeader`
- `SiteFooter`
- `NoteCard`
- `ProjectCard`
- `TagFilter`
- `ProseLayout`
- `ProjectLayout`

Use plain CSS or scoped Astro styles. Avoid a heavy UI framework. Client-side JavaScript should be limited to small progressive behavior such as tag filtering if required.

Deployment must remain compatible with GitHub Pages and the custom domain `shylenko.com`.

## Verification

The implementation plan should include checks for:

- Astro build succeeds.
- GitHub Pages deployment path is configured.
- Existing post URLs redirect.
- Migrated notes render with images and converted embeds/components.
- Project pages render for Labwired, kernelCAD, UDS, and IO-Link.
- Mobile layout is usable.
- Basic accessibility checks pass.
- Analytics behavior is either intentionally preserved or intentionally removed.

## Out of Scope For First Version

- Full-text search unless it is trivial after migration.
- Redesigning the logo.
- Complex animations.
- CMS integration.
- A full marketing funnel.
- Rewriting every legacy post by hand beyond required migration cleanup.
