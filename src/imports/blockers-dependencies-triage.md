Build a Blockers & Dependencies screen for PM triage (Milestone Pulse Board companion screen).

Goal:
Help the PM identify the highest-risk blockers, see what they impact, and take action quickly.

Layout:

Header with title and date range

Filter bar: milestone, workstream, owner, blocker type (internal/external/security/vendor/gov action), severity, age

Main left panel: ranked blockers table with columns:

blocker ID

title

owner

age

severity

impacted milestone(s)

next action

status

Main right panel: blocker detail card for selected blocker

Full-width dependency chain section beneath main panels (cards or graph-like linked sequence)

Action bar: Assign owner, Set due date, Escalate, Add PM note, Create report snippet

Interactions:

Selecting a blocker highlights impacted dependencies and milestones

Sort blockers by severity, age, or milestone proximity

Quick row actions in the table

Show escalation history in detail panel

Constraints:

This is a PM triage screen, not an engineering kanban board

Keep dependency view readable and low clutter

Output:

One polished blockers/dependencies screen

Include one selected blocker state with highlighted dependency chain