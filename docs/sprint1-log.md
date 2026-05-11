\# Sprint 1 Log - Hope CMS



\*\*Period:\*\* Weeks 1-2 (May 2026)  

\*\*Status:\*\* COMPLETED



\## Tasks Accomplished:

\- ✅ Vite + React 18 + Tailwind CSS project scaffold

\- ✅ Supabase client initialization and .env setup

\- ✅ Full Hope Database seeded (82 customers, 124 sales, 52 products, etc.)

\- ✅ record\_status + stamp columns added to customer table

\- ✅ Rights management tables created + seeded

\- ✅ SUPERADMIN account (jcesperanza@neu.edu.ph) created

\- ✅ Email/Password + Google OAuth registration \& login

\- ✅ provision\_new\_user() trigger implemented

\- ✅ Login Guard fully working (blocks INACTIVE users, allows ACTIVE)

\- ✅ Basic AppShell with sidebar navigation

\- ✅ Protected routing implemented



\## Blockers \& Resolutions:

\- Trigger not firing reliably → Fixed by using `SECURITY DEFINER` and re-creating trigger

\- New users not appearing in `user` table → Resolved



\## Next Sprint (Sprint 2) Goals:

\- Customer CRUD (List, Add, Edit, Soft Delete)

\- RLS policies on customer table

\- Rights-based button gating (CUST\_ADD, CUST\_EDIT, CUST\_DEL)

\- View-only pages for Sales \& Products

\- Deleted Customers page



\*\*Sprint 1 Gate Passed\*\* ✅

