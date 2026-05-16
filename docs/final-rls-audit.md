# Final RLS Audit — HopeCMS Sprint 3
**Confirmed by: M3 Backend/Database Engineer**

---

## RLS Policy Audit

### customer table (5 policies)
| Policy | Role | Operation | Condition |
|--------|------|-----------|-----------|
| USER: view active customers only | USER | SELECT | record_status = 'ACTIVE' |
| ADMIN: view all customers | ADMIN | SELECT | No filter |
| SUPERADMIN: full access | SUPERADMIN | ALL | No filter |
| SUPERADMIN: INSERT | SUPERADMIN | INSERT | No filter |
| SUPERADMIN: UPDATE/DELETE | SUPERADMIN | UPDATE/DELETE | No filter |

✅ RLS enabled on customer table — confirmed in Supabase dashboard

---

### sales, salesdetail, product, pricehist (SELECT-only confirmed)
| Table | Policy | Operation |
|-------|--------|-----------|
| sales | authenticated: view all sales | SELECT only |
| salesdetail | authenticated: view all salesdetail | SELECT only |
| product | authenticated: view all products | SELECT only |
| pricehist | authenticated: view all pricehist | SELECT only |

✅ No INSERT, UPDATE, or DELETE policies exist on any of these tables
✅ Confirmed via Supabase SQL editor — no write operations possible

---

### users table (SUPERADMIN guard confirmed)
| Policy | Role | Operation | Condition |
|--------|------|-----------|-----------|
| users: read own row | authenticated | SELECT | userid = auth.uid() |
| SUPERADMIN: view all users | SUPERADMIN | SELECT | No filter |
| SUPERADMIN: update all users | SUPERADMIN | UPDATE | No filter |
| ADMIN: update record_status only | ADMIN | UPDATE | user_type != 'SUPERADMIN' |

✅ ADMIN cannot modify SUPERADMIN rows — confirmed
✅ ADMIN cannot change user_type column — confirmed

---

### usermodule_rights (SUPERADMIN guard confirmed)
| Policy | Role | Operation | Condition |
|--------|------|-----------|-----------|
| users: read own rights | authenticated | SELECT | userid = auth.uid() |
| SUPERADMIN: manage all rights | SUPERADMIN | ALL | No filter |
| ADMIN: cannot modify SUPERADMIN rights | ADMIN | ALL | target user_type != 'SUPERADMIN' |

✅ ADMIN cannot INSERT, UPDATE, or DELETE SUPERADMIN rights rows — confirmed

---

## Hard Delete Audit

| File | DELETE statements found |
|------|------------------------|
| src/services/customerService.js | ❌ None — soft delete only |
| src/services/salesService.js | ❌ None — read only |
| src/services/productService.js | ❌ None — read only |
| src/services/Adminservice.js | ❌ None — status update only |
| src/services/Reportsservice.js | ❌ None — read only |
| db/migrations/*.sql | ❌ None — no DELETE DML |

✅ Zero hard DELETE statements found in any service, trigger, or migration file
✅ Soft delete implemented via record_status = 'INACTIVE' on customer table only

---

## Database Backup
✅ Database backup verified in Supabase Dashboard under Project Settings > Backups