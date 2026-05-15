# Sprint 2 Log - Hope CMS

**Period:** Weeks 3-4 (May 2026)  
**Status:** COMPLETED

## Tasks Accomplished:

### Services Layer
- ✅ `customerService.js` — getCustomers, addCustomer, updateCustomer, softDeleteCustomer, recoverCustomer
- ✅ `salesService.js` — getSalesByCustomer, getSalesDetail, getSalesDetailWithProducts
- ✅ `productService.js` — getProducts, getPriceHistory, getCurrentPrice, getProductsWithCurrentPrice
- ✅ Stamp format fixed to fit `varchar(60)` constraint (`ADD/UPD/DEL/REC:shortId date`)

### Rights & Auth
- ✅ `UserRightsContext.jsx` — loads rights from `usermodule_rights` table per user
- ✅ `useRights()` hook exposes `rights` map and `userType` app-wide
- ✅ Fixed column name bug: `UserModule_Rights` → `usermodule_rights`, `userId` → `userid`
- ✅ Rights seeded correctly for all user types (27 right entries across 3 users)

### Customer Module
- ✅ Customer list — ADMIN/SUPERADMIN see all; USER sees ACTIVE only
- ✅ Add Customer modal — rights-gated (CUST_ADD), with maxLength validation
- ✅ Edit Customer modal — rights-gated (CUST_EDIT), with maxLength validation
- ✅ Soft Delete confirmation dialog — rights-gated (CUST_DEL), sets INACTIVE
- ✅ Stamp column — visible to ADMIN/SUPERADMIN only, hidden from USER
- ✅ Customer name links to CustomerDetailPage (`/customers/:custno`)
- ✅ Input limits enforced: custno=5, custname=20, address=50 (with live counters)

### Customer Detail & Sales Drill-Down
- ✅ `CustomerDetailPage.jsx` — profile card + sales history panel
- ✅ Sales history table — all transactions for selected customer, newest first
- ✅ Sales detail modal — click any transaction → line items with product description + qty

### Product Catalogue
- ✅ `ProductCataloguePage.jsx` — read-only, no add/edit/delete buttons
- ✅ Displays prodcode, description, unit, current price (latest from pricehist)
- ✅ Search by product code or description

### Deleted Customers
- ✅ `DeletedCustomersPage.jsx` — shows all INACTIVE customers
- ✅ Recover button with confirmation dialog → sets record_status back to ACTIVE
- ✅ Stamp updated on every status change

### Sidebar & Navigation
- ✅ `AppShell.jsx` upgraded — `<a href>` replaced with `<NavLink>` (active highlighting)
- ✅ Admin and Deleted Customers links hidden from USER type
- ✅ `UserRightsProvider` wrapping app in `main.jsx`

### Routing
- ✅ `/customers` — CustomerListPage
- ✅ `/customers/:custno` — CustomerDetailPage
- ✅ `/products` — ProductCataloguePage
- ✅ `/deleted-customers` — DeletedCustomersPage

## Test Results:

| Test | Result |
|---|---|
| Stamp visible to ADMIN/SUPERADMIN | ✅ Pass |
| Stamp hidden from USER | ✅ Pass |
| Add/Edit/Delete buttons hidden from USER | ✅ Pass |
| Add/Edit/Delete buttons visible to SUPERADMIN | ✅ Pass |
| Soft-delete moves customer to INACTIVE | ✅ Pass |
| INACTIVE customer hidden from USER list | ✅ Pass |
| INACTIVE customer visible in Deleted Customers (ADMIN) | ✅ Pass |
| Recover sets customer back to ACTIVE | ✅ Pass |
| Recovered customer reappears in all views | ✅ Pass |
| Product page has zero write buttons | ✅ Pass |
| Admin/Deleted Customers nav hidden from USER | ✅ Pass |
| Character limits prevent DB varchar errors | ✅ Pass |

## Known Gaps / Carried to Sprint 3:

- ⚠️ RLS not yet enabled on `customer` table — API bypass possible
- ⚠️ Sales page not yet built — view-only enforcement test partially incomplete
- ⚠️ 27-case rights matrix not formally documented

## Blockers & Resolutions:

- `userId` column mismatch → Fixed to `userid` (lowercase) throughout
- `UserModule_Rights` table name mismatch → Fixed to `usermodule_rights`
- Stamp varchar(60) overflow → Fixed with short stamp format (`DEL:shortId date`)
- Rights inverted (USER had CUST_ADD=1, SUPERADMIN had 0) → Fixed via SQL UPDATE
- `user1` (jcesperanza) missing CUST_ADD right → Fixed via SQL UPDATE
- `custname varchar(20)` overflow on Add Customer → Fixed with maxLength + live counters

## Next Sprint (Sprint 3) Goals:
- Enable RLS on `customer` table (API bypass protection)
- Sales page — list all transactions, filter by date/customer
- Admin page — user management (activate/deactivate, change user type, manage rights)
- Register flow — new users default to INACTIVE, pending admin approval
- Formal 27-case rights test matrix documentation

**Sprint 2 Gate Passed** ✅