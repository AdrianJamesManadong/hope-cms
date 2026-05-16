# Rights Test Matrix - Hope CMS

**Date:** May 2026  
**Tester:** adrianjames.manadong  
**Status:** COMPLETED

## Test Accounts Used

| Username | User Type | Status |
|---|---|---|
| patriciafaye.campos | SUPERADMIN | ACTIVE |
| norfaida.nasser | ADMIN | ACTIVE |
| adrianjames.manadong | USER | ACTIVE |

## Rights Reference Table

| Right Code | Description |
|---|---|
| CUST_VIEW | View customer list |
| CUST_ADD | Add new customer |
| CUST_EDIT | Edit existing customer |
| CUST_DEL | Soft delete customer |
| ADM_USER | Access admin/user management |
| SALES_VIEW | View sales summary |
| PROD_VIEW | View product catalogue |
| PRICE_VIEW | View price history |
| SD_VIEW | View sales detail |

---

## Test Matrix: 3 User Types × 9 Rights = 27 Test Cases

### SUPERADMIN (patriciafaye.campos)

| # | Right Code | Expected | Result | Notes |
|---|---|---|---|---|
| 1 | CUST_VIEW | ✅ See ALL customers (ACTIVE + INACTIVE) | ✅ PASS | INACTIVE rows visible |
| 2 | CUST_ADD | ✅ Add Customer button visible + functional | ✅ PASS | Adds with stamp |
| 3 | CUST_EDIT | ✅ Edit button visible + functional | ✅ PASS | Updates with stamp |
| 4 | CUST_DEL | ✅ Delete button visible + functional | ✅ PASS | Soft delete to INACTIVE |
| 5 | ADM_USER | ✅ Admin link in sidebar visible | ✅ PASS | User Management page loads |
| 6 | SALES_VIEW | ✅ Sales Summary page accessible | ✅ PASS | Data loads from view |
| 7 | PROD_VIEW | ✅ Product Catalogue accessible | ✅ PASS | All products visible |
| 8 | PRICE_VIEW | ✅ Current price shown in catalogue | ✅ PASS | Latest price displayed |
| 9 | SD_VIEW | ✅ Sales detail modal opens | ✅ PASS | Line items load |

### ADMIN (norfaida.nasser)

| # | Right Code | Expected | Result | Notes |
|---|---|---|---|---|
| 10 | CUST_VIEW | ✅ See ALL customers (ACTIVE + INACTIVE) | ✅ PASS | INACTIVE rows visible |
| 11 | CUST_ADD | ✅ Add Customer button visible + functional | ✅ PASS | Adds with stamp |
| 12 | CUST_EDIT | ✅ Edit button visible + functional | ✅ PASS | Updates with stamp |
| 13 | CUST_DEL | ❌ Delete button NOT visible | ✅ PASS | CUST_DEL = 0 for ADMIN |
| 14 | ADM_USER | ✅ Admin link in sidebar visible | ✅ PASS | User Management page loads |
| 15 | SALES_VIEW | ✅ Sales Summary page accessible | ✅ PASS | Data loads from view |
| 16 | PROD_VIEW | ✅ Product Catalogue accessible | ✅ PASS | All products visible |
| 17 | PRICE_VIEW | ✅ Current price shown in catalogue | ✅ PASS | Latest price displayed |
| 18 | SD_VIEW | ✅ Sales detail modal opens | ✅ PASS | Line items load |

### USER (adrianjames.manadong)

| # | Right Code | Expected | Result | Notes |
|---|---|---|---|---|
| 19 | CUST_VIEW | ✅ See ACTIVE customers only | ✅ PASS | INACTIVE rows hidden |
| 20 | CUST_ADD | ❌ Add Customer button NOT visible | ✅ PASS | CUST_ADD = 0 for USER |
| 21 | CUST_EDIT | ❌ Edit button NOT visible | ✅ PASS | CUST_EDIT = 0 for USER |
| 22 | CUST_DEL | ❌ Delete button NOT visible | ✅ PASS | CUST_DEL = 0 for USER |
| 23 | ADM_USER | ❌ Admin link NOT in sidebar | ✅ PASS | ADM_USER = 0 for USER |
| 24 | SALES_VIEW | ✅ Sales Summary page accessible | ✅ PASS | Data loads from view |
| 25 | PROD_VIEW | ✅ Product Catalogue accessible | ✅ PASS | All products visible |
| 26 | PRICE_VIEW | ✅ Current price shown in catalogue | ✅ PASS | Latest price displayed |
| 27 | SD_VIEW | ✅ Sales detail modal opens | ✅ PASS | Line items load |

---

## Summary

| User Type | Pass | Fail | Total |
|---|---|---|---|
| SUPERADMIN | 9 | 0 | 9 |
| ADMIN | 9 | 0 | 9 |
| USER | 9 | 0 | 9 |
| **TOTAL** | **27** | **0** | **27** |

---

## Additional Security Tests

| Test | Expected | Result |
|---|---|---|
| INACTIVE user login blocked | Redirected with pending message | ✅ PASS |
| SUPERADMIN row in User Management | No activate/deactivate/role buttons | ✅ PASS |
| Current user row in User Management | Locked — cannot self-deactivate | ✅ PASS |
| USER calls getCustomers() directly | RLS blocks INACTIVE rows | ✅ PASS |
| Soft delete hides from USER list | Customer disappears from USER view | ✅ PASS |
| Recover restores to all views | Customer reappears after recovery | ✅ PASS |
| Stamp column hidden from USER | No stamp column in USER view | ✅ PASS |
| Stamp column visible to ADMIN | Stamp column shown with audit trail | ✅ PASS |
| Google OAuth new user → INACTIVE | Redirected to login with pending msg | ✅ PASS |
| Role change syncs all 9 rights | Promoted ADMIN gets correct buttons | ✅ PASS |

**All 27 rights test cases passed** ✅  
**All 10 security tests passed** ✅

