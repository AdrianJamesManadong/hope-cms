# Sprint 2 View-Only and Soft Delete Tests

## View-Only Enforcement Test

### Tested Pages
- Sales Page
- Sales Detail Page
- Product Catalogue
- Price History

### User Types Tested
- USER
- ADMIN
- SUPERADMIN

### Expected Result
No add, edit, or delete buttons should appear.

### Actual Result
PASS

- No Add buttons found
- No Edit buttons found
- No Delete buttons found
- No Supabase INSERT/UPDATE/DELETE calls detected

---

# Soft Delete Visibility Test

## Scenario
SUPERADMIN soft-deleted customer C0001.

## Expected Result
- USER cannot see deleted customer
- ADMIN can view deleted customer in Deleted Customers page

## Actual Result
PASS

---

# Recovery Test

## Scenario
ADMIN recovered customer C0001.

## Expected Result
Customer becomes visible again in all customer lists.

## Actual Result
PASS

---

# API Bypass Test

## Scenario
USER attempted direct getCustomers() call without ACTIVE filter.

## Expected Result
RLS should block INACTIVE rows.

## Actual Result
PASS

---

# Stamp Visibility Test

## USER
- stamp column hidden

## ADMIN
- stamp column visible

## Actual Result
PASS