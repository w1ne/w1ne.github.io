# Budapest Hardware Club Post Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a short personal note about the first Budapest Hardware Club meetup, with selected event photos and links to `bhw.hu` and the event page.

**Architecture:** Add a single Astro content-collection note that follows the existing note schema. Store only three curated, compressed public-album photos under the note's image directory and reference them from Markdown with descriptive alt text.

**Tech Stack:** Astro 5, Markdown content collections, Node build scripts, GitHub Pages deployment via Git.

---

### Task 1: Add the article and images

**Files:**
- Create: `src/content/notes/budapest-hardware-club.md`
- Create: `images/notes/budapest-hardware-club/lecture.jpg`
- Create: `images/notes/budapest-hardware-club/group.jpg`
- Create: `images/notes/budapest-hardware-club/discussion.jpg`

- [x] **Step 1: Inspect the active Astro note schema and two image-bearing notes**

Run: `sed -n '1,220p' src/content/config.ts; sed -n '1,180p' src/content/notes/iolinki.md; sed -n '1,180p' src/content/notes/iot-loco-demo.md`

Expected: The required frontmatter fields and local-image conventions are clear.

- [x] **Step 2: Select three public album images**

Choose one lecture photo, one group photo, and one candid discussion photo that clearly represent the event. Do not include images that are blurry, duplicate a selected composition, or expose private information.

- [x] **Step 3: Add the note and selected images**

Use this approved body copy, adding Markdown image blocks immediately after the opening and before the final call to action:

```markdown
I recently had the pleasure of opening the first [**Budapest Hardware Club**](https://bhw.hu) meetup with a talk on modern firmware development.

The club is for people who build physical things: firmware and embedded engineers, electrical engineers, PCB designers, hardware founders, makers, and technical students. The aim is simple: bring together the people who turn ideas into working devices, share what we are learning, and make it easier to find collaborators in Budapest.

For this first evening, we discussed how to build and test firmware before the final hardware is available—a practical topic that always leads to good conversations about tools, trade-offs, and the messy reality between a prototype and a product.

The best part was people: a group of curious people from different backgrounds, all keen to talk about hardware. I am looking forward to the next one.

If that sounds like your crowd, follow the [Budapest Hardware Club](https://luma.com/ohsohudt) for future meetups.
```

- [x] **Step 4: Remove the superseded unpublished Jekyll-format draft**

Run: `rm _posts/personal/2026-07-19-budapest-hardware-club.md`

Expected: There is only one source for the post and the active Astro collection owns it.

### Task 2: Verify and publish

**Files:**
- Verify: `dist/notes/budapest-hardware-club/index.html`

- [x] **Step 1: Build the site**

Run: `npm run build`

Expected: Exit code 0, with Astro validation and production build both succeeding.

- [x] **Step 2: Inspect the generated page**

Run: `rg -n 'Budapest Hardware Club|bhw\\.hu|lecture|group|discussion' dist/notes/budapest-hardware-club/index.html`

Expected: The title, club link, and all selected images appear in the generated page.

- [x] **Step 3: Commit and push the post**

Run: `git add src/content/notes/budapest-hardware-club.md images/notes/budapest-hardware-club docs/superpowers/plans/2026-07-19-budapest-hardware-club-post.md && git commit -m "post: add Budapest Hardware Club recap" && git push`

Expected: A clean commit is pushed to the branch that deploys the site.
