# 🏡 Property Listing Frontend

A modern property listing platform built with **Next.js (App Router)**, **TypeScript**, **TailwindCSS**, and **Zustand**.  
This project provides role-based dashboards for **Landlords**, **Tenants**, and **Admins** with a clean and scalable architecture.

---

## 🚀 Tech Stack

- [Next.js 14 (App Router)](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)

---

## ✨ Features

- Browse, search, and favorite properties
- Global state via Zustand
- App Router with nested routes
- Fully typed with TypeScript
- TailwindCSS utility-first styling

## 🚀 Getting Started

### 1) Install

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 2) Environment Variables

Create `.env.local` from `.env.example` and fill in values as needed.

### 3) Dev Server

```bash
npm run dev
```

Visit http://localhost:3000

### 4) Lint, Typecheck, Format

```bash
npm run lint
npm run typecheck
npm run format
```

## 📂 Project Structure

```bash
project-root/
│── app/
│   ├── layout.tsx
│   ├── page.tsx                  # Public homepage
│   │
│   ├── properties/               # Public property browsing
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   │
│   ├── favorites/                # Tenant’s saved properties
│   │   └── page.tsx
│   │
│   ├── dashboard/
│   │   ├── landlord/             # Landlord dashboard
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── properties/
│   │   │   │   ├── page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   └── tenants/page.tsx
│   │   │
│   │   ├── tenant/               # Tenant dashboard
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── payments/page.tsx
│   │   │   └── leases/page.tsx
│   │   │
│   │   └── admin/                # Admin dashboard
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── users/page.tsx
│   │       ├── properties/page.tsx
│   │       └── reports/page.tsx
│
│── components/
│── hooks/
│── lib/
│── store/                        # Zustand stores
│── types/                        # TypeScript types
│── public/
│── styles/
│
│── README.md
│── CONTRIBUTING.md
│── .github/
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE.md
```

## 🖥️ Dashboards

### 👨‍💼 Landlord Dashboard

- Manage owned properties (`/dashboard/landlord/properties`)
- Add/Edit/Delete property listings
- View tenants renting their properties

### 🧑‍💻 Tenant Dashboard

- View and manage leases (`/dashboard/tenant/leases`)
- Track payment history (`/dashboard/tenant/payments`)
- Save properties as favorites

### 🛠️ Admin Dashboard

- Manage all users (`/dashboard/admin/users`)
- Moderate all property listings
- View analytics & reports (`/dashboard/admin/reports`)

---

## ⚡ Getting Started

### 1️⃣ Clone the repo

```bash
git clone https://github.com/your-org/property-listing-frontend.git
cd property-listing-frontend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Run development server

```bash
npm run dev
```

App will be running on [http://localhost:3000](http://localhost:3000)

---

## ✅ Contribution Guidelines

- Follow the [CONTRIBUTING.md](./CONTRIBUTING.md) guide
- Use [GitHub Issues](./.github/ISSUE_TEMPLATE.md) to report bugs or request features
- Use the [Pull Request Template](./.github/PULL_REQUEST_TEMPLATE.md) when submitting PRs

---

## 📜 License

This project is licensed under the MIT License.
