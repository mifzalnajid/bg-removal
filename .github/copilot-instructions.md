# Copilot Instructions for bg-removal

## Project Overview
- **bg-removal** is a full-stack web application for removing image backgrounds and managing user credits.
- The project is split into two main folders:
  - `client/`: React + Vite frontend, styled with Tailwind CSS, uses React Router for navigation.
  - `server/`: Node.js backend using Express, MongoDB (via Mongoose), and integrates with external services (Razorpay for payments, Clerk for auth, Svix for webhooks).

## Architecture & Data Flow
- **Frontend** (`client/`):
  - Main entry: `src/App.jsx` sets up routes for Home, Result, and BuyCredit pages.
  - UI components are modularized under `src/components/`.
  - Assets and configuration for plans/testimonials are in `src/assets/assets.js`.
  - State management is minimal; context folder exists but is not populated in this snapshot.
  - User authentication is handled via Clerk (`@clerk/clerk-react`).
  - Credit purchase flows are managed in `BuyCredit.jsx` and use Razorpay on the backend.
- **Backend** (`server/`):
  - Main entry: `server.js` sets up Express server, connects to MongoDB via `configs/mongodb.js`.
  - User data is stored in MongoDB (`models/userModel.js`).
  - API routes are modularized under `routes/`, with controllers and middlewares for business logic and validation.
  - Payment integration via Razorpay, webhooks via Svix.
  - Uses environment variables for sensitive config (`.env`).

## Developer Workflows
- **Frontend**:
  - Start dev server: `npm run dev` (in `client/`)
  - Build for production: `npm run build`
  - Lint: `npm run lint`
  - Preview build: `npm run preview`
- **Backend**:
  - Start server: `npm run start` (in `server/`)
  - Hot-reload dev server: `npm run server` (uses nodemon)

## Conventions & Patterns
- **React**:
  - Functional components only; hooks for state/effects.
  - Routing via `react-router-dom`.
  - Tailwind CSS for styling; utility classes throughout.
  - Assets imported as modules for images/icons.
- **Express/Mongoose**:
  - Models defined in `models/`, e.g., `userModel.js` with Clerk ID and credit balance.
  - Controllers/middlewares separated for clarity and scalability.
  - API endpoints should be added to `routes/` and wired in `server.js`.
- **Environment Variables**:
  - Sensitive data (MongoDB URI, API keys) must be set in `.env` files in each folder.

## Integration Points
- **Clerk**: User authentication, Clerk ID stored in user model.
- **Razorpay**: Payment processing for credit purchases.
- **Svix**: Webhook handling for payment events.
- **MongoDB**: All persistent data (users, credits) stored here.

## Examples
- To add a new API route, create a file in `server/routes/`, implement logic in `controllers/`, and import in `server.js`.
- To add a new page, create a component in `client/src/pages/` and add a `<Route>` in `App.jsx`.

---
If any section is unclear or missing, please provide feedback for further refinement.
