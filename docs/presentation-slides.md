# Hope CMS — 12-Slide Presentation Deck
**Group 5 | Customer Management System**
**New Era University — BS Information Technology**

---

## Slide 1: Title Slide
**Hope CMS**
*Customer Management System*

Group 5
- M1 — Project Lead
- M2 — Frontend Developer
- M3 — Backend / Database Engineer
- M4 — Rights & Authentication Specialist
- M5 — QA / Documentation Specialist

New Era University | BS Information Technology

---

## Slide 2: System Overview
**What is Hope CMS?**

A web-based Customer Management System built with:
- ⚛️ React 18 + Vite + Tailwind CSS
- 🗄️ Supabase (PostgreSQL + Auth + RLS)
- 🔐 Role-Based Access Control (3 user types)
- ☁️ Deployed on Vercel

**Key Features:**
- Customer CRUD with soft-delete and recovery
- Sales history drill-down (customer → transaction → line items)
- Product catalogue with price history
- Real-time reports and revenue analytics
- Full rights enforcement per module

---

## Slide 3: Table Relationships (ERD)
**HopeDB — 5 Core Tables**

```
customer (82 rows)
    ↓ custno
sales (124 rows)
    ↓ transno
salesdetail (~250 rows)
    ↓ prodcode
product (52 rows)
    ↓ prodcode
pricehist (~70 rows)
```

**Key Design Decisions:**
- record_status + stamp columns on customer ONLY
- Soft delete via record_status = 'INACTIVE'
- stamp tracks who did what and when

---

## Slide 4: Rights Matrix
**9 Rights × 3 User Types**

| Right | USER | ADMIN | SUPERADMIN |
|-------|------|-------|------------|
| CUST_VIEW | ACTIVE only | All rows | All rows |
| CUST_ADD | ❌ | ✅ | ✅ |
| CUST_EDIT | ❌ | ✅ | ✅ |
| CUST_DEL | ❌ | ❌ | ✅ |
| SALES_VIEW | ✅ | ✅ | ✅ |
| SD_VIEW | ✅ | ✅ | ✅ |
| PROD_VIEW | ✅ | ✅ | ✅ |
| PRICE_VIEW | ✅ | ✅ | ✅ |
| ADM_USER | ❌ | ❌ | ✅ |

---

## Slide 5: Authentication Flow
**Email + Google OAuth**

```
User registers (email or Google)
        ↓
provision_new_user() trigger fires
        ↓
Creates USER/INACTIVE row in public.users
Seeds 9 default rights in usermodule_rights
        ↓
SUPERADMIN activates the account
        ↓
User logs in → Login guard checks record_status
        ↓
ACTIVE → redirects to /customers
INACTIVE → signs out + shows error message
```

---

## Slide 6: Customer CRUD Demo
**Live Demo — Customer Management**

- ✅ Add Customer (SUPERADMIN/ADMIN)
- ✅ Edit Customer (SUPERADMIN/ADMIN)
- ✅ Soft Delete → INACTIVE (SUPERADMIN)
- ✅ Recover from Deleted Customers (ADMIN/SUPERADMIN)
- ✅ Stamp column shows who did what (ADMIN/SUPERADMIN only)
- ✅ USER sees ACTIVE customers only

*[Screenshot: CustomerListPage with Add/Edit/Delete buttons]*

---

## Slide 7: Sales Drill-Down Demo
**Customer → Transaction → Line Items**

1. Click any customer name
2. View all sales transactions for that customer
3. Click any transaction
4. View line items: product + quantity + unit price

*Sales, salesdetail, product, pricehist — all read-only*
*No add/edit/delete for any user type*

*[Screenshot: CustomerDetailPage with sales history]*

---

## Slide 8: Reports Demo
**Analytics and Revenue**

**Customer Sales Summary:**
- 82 customers ranked by total spend
- Searchable, sortable table
- Shows: total transactions, total spend, last sale date

**Product Revenue:**
- 52 products ranked by total revenue
- SUM(qty × latest unitprice) per product
- Read-only for all user types

*[Screenshot: CustomerSalesSummaryPage + ProductRevenuePage]*

---

## Slide 9: Architecture
**System Architecture**

```
Browser (React + Vite)
        ↓ HTTPS
Vercel (CDN + Edge Network)
        ↓ API calls
Supabase
    ├── Auth (email + Google OAuth)
    ├── PostgreSQL (HopeDB)
    ├── RLS Policies (per user type)
    └── Triggers (provision_new_user)
```

**Security Layers:**
1. Frontend route guards (AdminRoute, SuperAdminRoute)
2. UI element gating (useRights hook)
3. RLS policies at database level

---

## Slide 10: Sprint Summary
**3 Sprints | 5 Members | Full Delivery**

| Sprint | Theme | PRs Merged |
|--------|-------|------------|
| Sprint 1 | Setup, DB, Auth | ~15 PRs |
| Sprint 2 | CRUD, Rights, RLS | ~18 PRs |
| Sprint 3 | Admin, Reports, Deploy | ~15 PRs |

**Total: 48+ Pull Requests across all members**

---

## Slide 11: Lessons Learned
**What We Learned**

✅ **Branch-per-feature discipline** — every feature needs its own PR
✅ **RLS is not optional** — UI gating alone is not enough security
✅ **Supabase triggers** — automate user provisioning reliably
✅ **Soft delete** — safer than hard delete for business data
✅ **Context over prop-drilling** — AuthContext + UserRightsContext kept code clean

⚠️ **Challenges:**
- Managing merge conflicts across 5 contributors
- Testing auth flows with mocked Supabase in Vitest
- Coordinating RLS policies with frontend rights enforcement

---

## Slide 12: Thank You
**Hope CMS — Delivered**

🔗 **Live App:** https://pentabytess-cms-neu.vercel.app/login
📁 **GitHub:** github.com/AdrianJamesManadong/hope-cms

**Group 5 — New Era University**
BS Information Technology

*Questions?*