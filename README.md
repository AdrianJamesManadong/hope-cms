# Hope CMS - Customer Management System

## Setup Instructions

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your Supabase credentials
3. Run `npm install`
4. Run `npm run dev`

## Supabase Setup
- Project URL: `https://eifalkcodrlyhdcmefrx.supabase.co`
- Make sure RLS and Triggers are configured

## Sprint 1 Completed
- Project scaffold with Vite + React + Tailwind
- Supabase integration + full HopeDB seeded
- Email + Google OAuth authentication
- Login guard (blocks INACTIVE users)
- Auto-provisioning trigger for new users

Next: Sprint 2 - Customer CRUD + Rights Enforcement