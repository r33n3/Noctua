# Contributing to CyberMinds-2026

## Source of Truth: HTML is Canonical

**The lab HTML files are the primary, canonical version of this course.**

- `docs/lab-s1-unit[1-4].html` — Semester 1 lab guides (primary)
- `docs/lab-s2-unit[5-8].html` — Semester 2 lab guides (primary)

The Markdown week files (`semester-1/weeks/week-[01-16].md`, `semester-2/weeks/unit-[5-8].md`) are **supporting content** — they must align to and reflect the HTML, not the other way around.

**Rule: When HTML and Markdown conflict, the HTML is correct. Markdown must be updated to match.**

When adding new course content:
1. Update or create the HTML lab section first
2. Update the corresponding Markdown week file to match
3. Never update Markdown without verifying the HTML reflects the same content

## Course Structure

- GitHub Pages site and interactive HTML are the student-facing artifacts
- Course review feedback is evaluated against the HTML/site experience
- Updates proposed in course review (course-feedback.md) are implemented in HTML first

## Lab HTML Conventions

- Shared stylesheet: `docs/labs.css`
- Shared JS: `docs/labs.js`
- Step pattern: `<div class="lab-step" id="step-w{N}-{M}">`
- Progress bar: `<span id="prog-text">0 / N steps complete</span>` — update N when adding steps
- Quiz pattern: `<div class="quiz-question" data-qid="{id}" data-answer="{letter}" data-explain="{explanation}">`

## Content Alignment Requirement

When writing or updating content that appears in both HTML and Markdown:
- Topic titles must match
- Week numbers must correspond
- Lab steps in HTML must match lab steps described in Markdown
- New features/skills/callouts added to Markdown must be reflected in HTML
