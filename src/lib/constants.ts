export const EXPENSE_CATEGORIES = [
  { id: "Food & Groceries", label: "Food & Groceries", icon: "Utensils", color: "#299E72", bgLight: "#E7F5EE", bgDark: "#183B2E" },
  { id: "Transportation", label: "Transportation", icon: "Bus", color: "#3B82F6", bgLight: "#EFF6FF", bgDark: "#1E3A5F" },
  { id: "Education", label: "Education & Books", icon: "GraduationCap", color: "#8B5CF6", bgLight: "#F5F3FF", bgDark: "#33255C" },
  { id: "Accommodation", label: "Accommodation / Boarding", icon: "Home", color: "#F59E0B", bgLight: "#FFFBEB", bgDark: "#4D3811" },
  { id: "Bills & Subscriptions", label: "Bills & Subscriptions", icon: "FileText", color: "#EC4899", bgLight: "#FDF2F8", bgDark: "#4C1D38" },
  { id: "Shopping", label: "Shopping & Tech", icon: "ShoppingBag", color: "#06B6D4", bgLight: "#ECFEFF", bgDark: "#15414B" },
  { id: "Entertainment", label: "Entertainment & Outings", icon: "Film", color: "#10B981", bgLight: "#ECFDF5", bgDark: "#133D30" },
  { id: "Health", label: "Health & Personal Care", icon: "HeartPulse", color: "#EF4444", bgLight: "#FEF2F2", bgDark: "#4A1818" },
  { id: "Other", label: "Other Expenses", icon: "MoreHorizontal", color: "#6B7280", bgLight: "#F3F4F6", bgDark: "#262C36" },
];

export const INCOME_CATEGORIES = [
  { id: "Allowance", label: "Allowance / Pocket Money", icon: "HeartHandshake", color: "#176B4D" },
  { id: "Part-time Job", label: "Part-time Job / Tutoring", icon: "Briefcase", color: "#2563EB" },
  { id: "Freelance", label: "Freelance Project / Gig", icon: "Laptop", color: "#7C3AED" },
  { id: "Scholarship", label: "Scholarship / Bursary / Grant", icon: "Award", color: "#D97706" },
  { id: "Other Income", label: "Gifts / Other Income", icon: "Coins", color: "#059669" },
];

export const GOAL_CATEGORIES = [
  { id: "Tech & Devices", label: "Laptop / Tech Gear", icon: "Laptop" },
  { id: "Study Materials", label: "Books / Courses / Supplies", icon: "BookOpen" },
  { id: "Emergency Fund", label: "Emergency Fund", icon: "ShieldCheck" },
  { id: "Boarding & Deposit", label: "Housing / Deposit", icon: "Home" },
  { id: "Travel & Trip", label: "Travel / Trip", icon: "Compass" },
  { id: "Personal", label: "Personal Goal", icon: "Flag" },
];

export const APP_METADATA = {
  name: "SaveWise LK",
  tagline: "Save smarter. Spend wiser. Build your future.",
  description: "Personal savings and budgeting for school and university students in Sri Lanka.",
  currency: "LKR",
  currencySymbol: "Rs.",
  version: "1.0.0",
  educationLevels: [
    { id: "school", label: "School student" },
    { id: "university", label: "University / college student" },
    { id: "other", label: "Other student" },
  ],
  universityOptions: [
    "University of Colombo",
    "University of Peradeniya",
    "University of Moratuwa",
    "University of Sri Jayewardenepura",
    "University of Kelaniya",
    "University of Jaffna",
    "University of Ruhuna",
    "University of Vavuniya",
    "Eastern University, Sri Lanka",
    "SLIIT",
    "NSBM Green University",
    "IIT (Informatics Institute of Technology)",
    "General Sir John Kotelawala Defence University (KDU)",
    "Other University / Institute",
  ],
};
