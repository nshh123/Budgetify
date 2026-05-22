# 💳 Budgetify — Premium Personal Financial Suite

Budgetify is a premium, state-of-the-art personal finance planner and cashflow tracking suite. Featuring an immersive glassmorphic user interface, interactive visual analytics, and offline-capable PWA utilities, Budgetify empowers users to take absolute control of their financial dashboard on both desktop and mobile viewports.

Visit the live application at: **[budget-planner-v2-0.vercel.app](https://budget-planner-v2-0.vercel.app/)**

---

## ✨ Outstanding Features

### 📊 Cashflow Dashboard & Visual Analytics
* **Dynamic Segments Donut Chart**: An interactive vector analytics wheel representing monthly expense distributions. Selecting individual categories displays real-time breakdowns in the center ring.
* **Dual Income & Expense Ledger**: Computes net income flow vs outgoing expenses alongside automatic budget depletion meters and net monthly balance displays.
* **Intelligent Finance Copilot**: Evaluates transaction activities to celebrate high savings rates or flag over-budget breaches.

### 🔒 Secure Authentication & Fail-Safe Sandbox
* **Clerk Integration**: Fully configured for secure user account profiles and seamless cloud login flows (`@clerk/clerk-react`).
* **Developer Sandbox Bypass**: If Clerk is not yet configured in your local environment, Budgetify gracefully redirects to an elegant Sandbox mode. This lets developers preview the entire feature set offline without configuration errors.

### 📱 Full Smartphone Responsiveness
* **Tailored Device Padding**: Compact viewports adapt automatically to offer seamless, fluid usage.
* **Sticky Bottom Navigation**: Easily navigate through tabs on mobile (Dashboard, Transactions, Savings, Categories, Settings) using standard touch gestures.
* **Action Sheet Modals**: Fully animated modal sliders rise smoothly from the bottom of the viewport for comfortable, native-feeling interactions.

### 🔋 Progressive Web App (PWA) Support
* **Installable Native Feel**: Fully compliant PWA structure enabling desktop dock shortcuts and smartphone application installations.
* **Offline Caching**: Built with a lightweight service worker that caches critical shell scripts, rendering styles, and assets to load instantly and run completely offline.
* **Dynamic Install Triggers**: Displays glassmorphic download prompts inside the sidebar and settings panels when eligible, with manual instructions for Safari iOS.

### 🛠️ Administrative Utilities
* **JSON Backup & Restore**: Export all transaction ledgers and settings to a local JSON file and restore them instantly on other devices.
* **Multi-Currency Engine**: Dynamically format values across five global currencies: `Rwf`, `$`, `€`, `£`, and `¥`.
* **Theme Accent Customization**: Tailor accent colors alongside visual Dark Mode switches that transition desktop backgrounds seamlessly without rendering white edges.

---

## 🚀 Getting Started (Local Setup)

### 1. Installation
Clone the repository and install the project dependencies:
```bash
npm install
```

### 2. Environment Variables Configuration
To set up secure user login profiles using Clerk, create a `.env` file in the root directory:
```env
# Clerk Publishable API Key from dashboard.clerk.com
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
```
*Note: If this variable is omitted, Budgetify will automatically open in **Developer Sandbox Mode**, allowing offline testing.*

### 3. Launch Development Server
Start the local server using Vite:
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your web browser.

---

## ⚡ Vercel Deployment Instructions

Follow these exact steps to publish Budgetify to Vercel:

1. Connect your GitHub repository to [Vercel](https://vercel.com/).
2. In the **Project Settings** > **Environment Variables** panel, add the following key:
   * **Key**: `VITE_CLERK_PUBLISHABLE_KEY`
   * **Value**: *[Paste your Clerk publishable key]*
3. In the **Deployments** panel, select your latest build, click the options menu (`...`), and select **Redeploy** so Vite compiles the environment key into your production JavaScript bundle.
4. If utilizing a Clerk Production Instance, ensure your Vercel URL (e.g. `https://your-project.vercel.app`) is added to your Clerk **Authorized Domains** list.

---

## 🛠️ Tech Stack & Architecture

* **Framework**: [React](https://react.dev/) + [Vite](https://vite.dev/) (Client Environment)
* **Styling**: Vanilla CSS3 (Custom Variables, Flexbox, Grid, backdrop-filters, custom keyframes)
* **Authentication**: [Clerk](https://clerk.com/) (`@clerk/clerk-react` SDK)
* **Storage**: Web Storage API (`localStorage` data syncing)
* **PWA**: Service Worker caching (`sw.js`) and Web Manifest metadata (`manifest.json`)
* **Linter**: ESLint with custom React-Hooks plugins

---

## 👤 Attribution

Created by **[@nshh123](https://github.com/nshh123)**. 

Contributions and enhancements are welcome. Take absolute control of your cashflow today!
