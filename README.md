# SaveWise LK — Student Savings & Budgeting Suite (Sri Lanka)

> **"Save smarter. Spend wiser. Build your future."**  
> *A student-centric personal finance web application specifically engineered for university students in Sri Lanka.*

---

### **Project Ownership & Credits**
- **Project Lead & Developer:** **Thasika Ragupathy**
- **Target Audience:** University and tertiary education students across Sri Lanka (University of Colombo, Moratuwa, Peradeniya, Sri Jayewardenepura, Kelaniya, SLIIT, IIT, etc.)
- **Primary Currency:** Sri Lankan Rupees (`LKR` / `Rs.`)
- **Version:** `1.0.0 (Portfolio & Production Prototype)`

---

## 🌟 Overview & Problem Statement

University students in Sri Lanka balance fluctuating allowances, Mahapola bursaries, part-time tutoring, or freelance gigs against high inflationary pressures—including boarding room advances, canteen meals, public transport passes, printouts, and technology upgrades.

Conventional banking apps are complex, overly corporate, and lack student-friendly budgeting tools. **SaveWise LK** provides an encouraging, non-judgmental environment to:
1. **Track student income and living expenses** in seconds with local LKR currency formatting.
2. **Set monthly category budgets** (Food, Boarding, Transit, Books, Entertainment) with visual guardrails and 80% warning triggers.
3. **Build realistic savings goals** (e.g., Coding Laptops, Certification Exams, Emergency Funds) with weekly pace recommendations.
4. **Evaluate impulse purchases** using the *Purchase Decision Assistant* to understand opportunity costs and goal delay in weeks.
5. **Project future reserves** using the *What-If Savings Simulator* with custom lifestyle reduction sliders.
6. **Build financial resilience** with guilt-free *Savings Challenges & Streaks* (7-Day Micro Saver, No-Spend Weekend).

---

## 🎨 Design System & Color Tokens

SaveWise LK uses a fintech design language with deep forest-green accents, warm backgrounds, responsive layouts, and full support for **Light and Dark themes**:

| Token Name | Light Mode Value | Dark Mode Value | Usage |
| :--- | :--- | :--- | :--- |
| **Forest Green (Brand)** | `#176B4D` | `#299E72` | Primary buttons, brand identity, active states |
| **Fresh Green (Success)** | `#299E72` | `#34D399` | Positive cashflow, progress bars, surplus |
| **Pale Mint (Highlight)** | `#E7F5EE` | `#163428` | Soft highlights, pills, badges |
| **Off-White / Deep Dark** | `#F7F9F6` | `#0C1411` | Application background |
| **Surfaces / Cards** | `#FFFFFF` | `#14211B` | Elevated cards, dialogs, drawers |
| **Border / Divider** | `#E4EAE5` | `#23392E` | Subtle container outlines |
| **Warning** | `#D99A32` | `#F4B54F` | 80% budget limit alerts |
| **Danger / Outflow** | `#C85B5B` | `#E36F6F` | Expenses, overspent states |

- **Typography:** Plus Jakarta Sans (Headings), Inter (Body), Tabular Numerals for financial values.
- **Responsiveness:** Designed from mobile (touch targets, thumb navigation bar, responsive transaction cards) up to wide 4K desktop screens (sticky sidebar, data tables, multi-column analytics).

---

## 🚀 Key Features & Capabilities

### 1. Financial Overview Dashboard (`/dashboard`)
- Instant snapshot of **Net This Month**, **Total Inflow**, **Total Outflow**, and **Savings Rate (%)**.
- Category expense breakdown donut chart with hover tooltips and legend.
- Active savings goal progress indicators and quick-deposit action modals.
- Real-time alerts for budgets approaching or exceeding category spending limits.
- Month selector allowing effortless navigation across historical or upcoming months.

### 2. Transaction Management (`/dashboard/transactions`)
- Add, edit, and delete both Income and Expense transactions.
- Search filter by title, notes, or amounts.
- Filter by Type (`Income`, `Expense`, or `All`) and Category.
- Sorting options: Newest, Oldest, Highest Amount, Lowest Amount.
- **Data Export:** Instant 1-click **Export to CSV** and **Export to JSON**.
- Confirmation dialogs before destructive actions.

### 3. Category Budget Planner (`/dashboard/budgets`)
- Configure spending caps per category for each month.
- Live calculation of spent, remaining buffer, and percentage used directly from recorded transactions.
- Color-coded feedback: Green (on track), Amber (>=80% warning), Red (overspent by Rs. X).

### 4. Savings Goals & Celebration (`/dashboard/goals`)
- Create goals with target dates, target amounts, and categories.
- Automatic calculation of the **recommended weekly contribution** based on days remaining.
- Dedicated contribution modal that logs internal allocations without treating them as expense penalties.
- **Celebratory Confetti** bursts upon reaching 100% completion!

### 5. Purchase Decision Assistant (`/dashboard/purchase-assistant`)
- Evaluates: *"Can I afford this new phone or pair of shoes right now?"*
- Calculates the exact delay in weeks on your primary savings goal.
- Compares Scenario A (maintain plan) vs Scenario B (absorb purchase delay).
- Cross-references your monthly net surplus to determine if it is safe or caution-advised.

### 6. What-If Savings Simulator (`/dashboard/simulator`)
- Interactive sliders for weekly savings, monthly lifestyle expense reduction, and 3–24 month time horizons.
- Visual SVG projection curve comparing baseline savings vs accelerated savings.

### 7. Savings Challenges & Streaks (`/dashboard/challenges`)
- 7-Day Campus Micro-Saver (Save Rs. 300/day).
- Zero-Takeaway Weekend Challenge.
- 52-Week Student Wealth Ladder.
- Unlockable achievement badges with non-punitive streak tracking.

### 8. User Settings & Data Portability (`/dashboard/settings`)
- Profile customization: Display Name, University, Faculty, Income Estimate.
- Theme Switcher: **Light**, **Dark**, or **System Default** (zero-flicker toggle).
- Full Data Export (CSV / JSON) and Demo Data Reset.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14 (App Router, Server & Client Components)
- **Language:** TypeScript 5 (Strict type checking)
- **Styling:** Tailwind CSS + PostCSS + Autoprefixer
- **State Management:** Zustand with LocalStorage persistence (`savewise-lk:v1`)
- **Icons:** Lucide React
- **Animations & Effects:** canvas-confetti, Tailwind Animate
- **Date Utilities:** date-fns

---

## 💻 Local Setup & Development

### Prerequisites
- Node.js `v18.0.0` or higher (tested on Node v25.2.0)
- npm, pnpm, or yarn

### Installation
```bash
# 1. Clone repository or navigate to folder
cd SaveWise-LK

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Open in your browser
http://localhost:3000
```

### Production Build
```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

---

## 🔒 Privacy & Prototype Disclaimer

- **No Real Banking Connection:** SaveWise LK is an educational frontend prototype. It does not connect to commercial bank APIs or process actual monetary transactions.
- **Local Browser Persistence:** All data is stored locally in your browser's `localStorage` under the key `savewise-lk:v1`. No financial details are transmitted to external servers.
- **Not Regulated Financial Advice:** The simulations and recommendations are mathematical estimates intended to assist student habit formation.

---

## 👤 Author & Ownership

Designed, engineered, and maintained by:  
**Thasika Ragupathy**  
*SaveWise LK Project*
