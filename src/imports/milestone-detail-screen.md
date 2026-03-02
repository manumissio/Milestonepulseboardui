Build a Milestone Detail screen for a selected milestone (example: “M2 ATO Package”).

Goal:
Help the PM quickly understand why this milestone is green/yellow/red and what actions are needed.

Layout:

Header with breadcrumb: Dashboard > Milestones > M2 ATO Package

Milestone summary card with:

health status

target date

forecast date

confidence score

percent complete

open risks count

Progress by workstream section (App Dev, QA, Security, Infra, Vendor)

Right-side panel for top blockers impacting this milestone (owner, age, severity, next action)

Dependency summary section showing upstream/downstream dependencies

“Recent changes” panel (since last report)

“Decisions / Escalations needed” panel

Primary actions: Escalate blocker, Add PM note, Generate milestone summary, Export

Interactions:

Filter all sections to this milestone by default

Click blocker to open detail drawer

Expand “recent changes” items

Highlight forecast slip drivers

Constraints:

Emphasize milestone health and risk visibility over ticket-level detail

Make the cause of yellow/red status obvious within 5–10 seconds

Output:

One polished milestone detail screen

Include one blocker detail drawer state