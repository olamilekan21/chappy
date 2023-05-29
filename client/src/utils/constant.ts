const recommendedColors = [
  "#6c45c0",
  "#dc2626",
  "#ea580c",
  "#d97706",
  "#ca8a04",
  "#65a30d",
  "#16a34a",
  "#059669",
  "#0d9488",
  "#0891b2",
  "#0284c7",
  "#2563eb",
  "#4f46e5",
  "#7c3aed",
  "#9333ea",
  "#c026d3",
  "#db2777",
  "#e11d48",
];

const constant = {
  primary: "#6c45c0",
  dark: "#16161d",
  size: 16,
  recommendedColors,
  unauthenticatedPath: [
    "/",
    "/auth/signin",
    "/auth/signup",
    "/auth/forget_password",
    "/auth/change_password",
  ],
  authenticatedPath: [
    "/messages",
    "/friends",
    "/friends/request",
    "/friends/suggestions",
    "/friends/search",
    "/meets",
    "/notifications",
    "/profile",
  ],
  avatarColors: [
    {
      bg: "#fee2e2",
      text: "#dc2626",
    },
    {
      bg: "#fce7f3",
      text: "#db2777",
    },
    {
      bg: "#e0e7ff",
      text: "#4f46e5",
    },
    {
      bg: "#f3e8ff",
      text: "#9333ea",
    },
    {
      bg: "#dbeafe",
      text: "#2563eb",
    },
    {
      bg: "#ccfbf1",
      text: "#0d9488",
    },
    {
      bg: "#dcfce7",
      text: "#16a34a",
    },
    {
      bg: "#cffafe",
      text: "#0891b2",
    },
    {
      bg: "#f3f4f6",
      text: "#4b5563",
    },
  ],
};

export default constant;
