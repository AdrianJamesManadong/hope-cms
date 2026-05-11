# Sprint 3 Log - Hope CMS

**Period:** Weeks 5-6 (May 2026)  
**Status:** COMPLETED

## Tasks Accomplished:

### Database
- ✅ SQL view `product_current_price` — latest price per product
- ✅ SQL view `customer_sales_summary` — total transactions + total spend per customer
- ✅ SQL view `product_revenue` — total qty sold + total revenue per product
- ✅ RLS enabled on `customer` table — ACTIVE-only filter for USER, full access for ADMIN/SUPERADMIN
- ✅ RLS enabled on `users` table — authenticated read, SUPERADMIN-only write
- ✅ RLS enabled on `usermodule_rights` table — own rights read, SUPERADMIN update
- ✅ `provision_new_user()` trigger fixed — table name casing corrected (`usermodule_rights`)

### Services Layer
- ✅ `adminService.js` — getUsers, activateUser, deactivateUser, changeUserType
- ✅ `adminService.changeUserType` — upserts all 9 rights on role change (USER ↔ ADMIN)
- ✅ `reportsService.js` — getCustomerSalesSummary, getTopCustomers, getProductRevenue

### Admin Module
- ✅ `UserManagementPage.jsx` — activate/deactivate users, change role (USER ↔ ADMIN)
- ✅ SUPERADMIN rows protected — no buttons, no dropdown, "Protected" badge shown
- ✅ Current user row locked — prevents self-deactivation
- ✅ ADM_USER right gates Admin sidebar link
- ✅ Role change syncs all 9 rights automatically via upsert

### Reports Module
- ✅ `CustomerSalesSummaryPage.jsx` — ranked by total spend, summary cards, search
- ✅ `ProductRevenuePage.jsx` — ranked by revenue, % of total bar, summary cards
- ✅ Both pages are read-only — zero add/edit/delete buttons

### Auth & Registration
- ✅ `Register.jsx` — firstName + lastName builds username (e.g. `john.doe`)
- ✅ Live username preview shown as user types
- ✅ Confirm password field + min 6 character validation
- ✅ Success screen replaces alert() — shows pending activation message
- ✅ `AuthContext.signUp` saves username to `users` table after registration
- ✅ Dev bypass removed from catch block in `AuthContext`
- ✅ Google OAuth configured — Client ID + Secret set in Supabase
- ✅ Test users added to Google Cloud OAuth consent screen
- ✅ `AuthCallback.jsx` — retry loop waits up to 5s for DB trigger to provision user row
- ✅ `Login.jsx` — detects `?pending=true` from Google redirect, shows yellow warning
- ✅ Clock skew issue resolved — device time sync fixed

## Blockers & Resolutions:
- `changeUserType` UPDATE silently failed for users with missing rights rows → Fixed with upsert
- Rights inverted after role promotion → Fixed by syncing all 9 rights on every role change
- Google OAuth blank page after callback → Fixed with retry loop in AuthCallback + import path fix
- Clock skew error on Google sign-in → Fixed by syncing device time
- `provision_new_user()` rights INSERT failing → Fixed table name casing (`UserModule_Rights` → `usermodule_rights`)
- Stamp varchar(60) overflow → Fixed with short stamp format in customerService
- `authError` not showing on Login page → Fixed by pulling `authError` from AuthContext

## Test Results:

| Test | Result |
|---|---|
| Google OAuth sign-in works | ✅ Pass |
| New Google user created as INACTIVE | ✅ Pass |
| Pending activation message shown on login | ✅ Pass |
| Username saved as firstname.lastname on register | ✅ Pass |
| SUPERADMIN row locked in User Management | ✅ Pass |
| Role change USER → ADMIN syncs all rights | ✅ Pass |
| Promoted ADMIN sees Add/Edit buttons | ✅ Pass |
| Demoted USER loses Add/Edit buttons | ✅ Pass |
| RLS blocks INACTIVE customers from USER | ✅ Pass |
| Customer Sales Summary loads from view | ✅ Pass |
| Product Revenue loads from view | ✅ Pass |
| Reports pages have zero write buttons | ✅ Pass |
| ADM_USER right gates Admin sidebar link | ✅ Pass |

## Known Gaps / Carried to Sprint 4:
- ⚠️ Deployment to production (Vercel/Netlify) not yet done
- ⚠️ Formal 27-case rights test matrix document pending
- ⚠️ User manual pending
- ⚠️ Google OAuth test users limited to manually added emails (app in Testing mode)

## Next Sprint (Sprint 4) Goals:
- Deploy to Vercel/Netlify
- Publish Google OAuth app (remove Testing restriction)
- Final UI polish — loading skeletons, toast notifications
- Complete documentation package (test matrix, user manual, presentation)

**Sprint 3 Gate Passed** ✅