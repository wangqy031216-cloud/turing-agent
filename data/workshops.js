/* =====================================================================
   Internal workshops / seminars.

   HOW TO ADD A SESSION: add an object to `sessions` (any order — the page
   sorts by date and splits Upcoming / Past automatically by today's date).

   Example (copy, uncomment, edit):

   {
     no: 1,                                   // session number (optional)
     date: "2026-11-20",                      // YYYY-MM-DD
     time: "15:00–16:30",                     // optional
     place: "Room 301 / Zoom",                // optional
     title: "Turing Agent: design and lessons from the OpenAI problems",
     speakers: "Name A, Name B",
     summary: "One or two sentences on what the session covers.",
     links: [
       { label: "Slides", href: "files/workshops/01-slides.pdf" },
       { label: "Recording", href: "https://..." }
     ]
   },

   Files (slides, notes) can be committed under files/workshops/.
   ===================================================================== */
window.TA = window.TA || {};

TA.workshops = {
  intro: "Internal seminars on Turing Agent, Lean formalization and agent-harness design. Slides, recordings and code from each session are archived here.",
  sessions: [
  ]
};
