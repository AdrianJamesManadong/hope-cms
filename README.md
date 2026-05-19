# Hope CMS — Customer Management System

A role-based Customer Management System built with React, Vite, Tailwind CSS, and Supabase.

---

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/AdrianJamesManadong/hope-cms.git
cd hope-cms
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
```
Open `.env` and fill in your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run the development server
```bash
npm run dev
```
App runs at https://pentabytess-cms-neu.vercel.app/login

### 5. Run tests
```bash
npx vitest run
```

---

## Supabase Project

- **Project URL:** `https://eifalkcodrlyhdcmefrx.supabase.co`
- RLS policies must be configured on all tables
- `provision_new_user()` trigger must be active on `auth.users`
- Google OAuth redirect URLs must include `http://localhost:5173/auth/callback`

---

## Project Structure

```
hope-cms/
├── src/
│   ├── context/        # AuthContext, UserRightsContext
│   ├── pages/          # Login, Register, CustomerListPage, etc.
│   ├── services/       # Supabase service functions
│   ├── lib/            # supabaseClient.js
│   └── tests/          # Vitest test suites
├── db/
│   └── migrations/     # SQL migration files
├── docs/               # ERD and sprint logs
└── .env.example        # Environment variable template
```

---

## User Roles

| Role | Access |
|------|--------|
| **USER** | View customers (ACTIVE only), view sales, view products |
| **ADMIN** | All USER access + view INACTIVE customers, recover soft-deleted customers, view stamp column |
| **SUPERADMIN** | All ADMIN access + soft-delete customers, manage users |

---

## Sprint Progress

| Sprint | Theme | Status |
|--------|-------|--------|
| Sprint 1 | Project setup, database, authentication | ✅ Complete |
| Sprint 2 | Customer CRUD, rights enforcement | ✅ Complete |
| Sprint 3 | Admin module, reports, deployment | ✅ Complete |
