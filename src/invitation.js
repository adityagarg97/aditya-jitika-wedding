const versions = {
  wedding: {
    cards: ["wedding"],
    heading: "The wedding day",
    caption: "A day to cherish.",
    dateRange: "11 DECEMBER 2026",
  },
  "engagement-wedding": {
    cards: ["engagement", "wedding"],
    heading: "The celebrations",
    caption: "Two days to cherish.",
    dateRange: "6 & 11 DECEMBER 2026",
  },
  all: {
    cards: ["engagement", "carnival", "mehndi", "wedding"],
    heading: "The celebrations",
    caption: "Four days to cherish.",
    dateRange: "6–11 DECEMBER 2026",
  },
};

export function getInvitation(search = "") {
  const requested = new URLSearchParams(search).get("invite");
  const key = Object.hasOwn(versions, requested) ? requested : "all";
  return { key, ...versions[key] };
}
