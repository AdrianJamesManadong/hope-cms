# Sprint 1 Log — Hope CMS
**Weeks 1–2 | Theme: Project Setup, CMS Database & Authentication**

---

## Sprint Overview

| Item | Detail |
|------|--------|
| **Sprint** | Sprint 1 |
| **Dates** | Week 1–2 |
| **Goal** | Project scaffold, full HopeDB seeded, Email + Google OAuth, login guard |
| **Status** | ✅ Complete |

---

## Tasks Completed

### M1 — Project Lead
| Date | Task | Status |
|------|------|--------|
| Week 1 | Vite + React 18 + Tailwind CSS scaffolded | ✅ Done |
| Week 1 | Supabase JS client initialized; `.env.example` committed | ✅ Done |
| Week 1 | React Router v6 with ProtectedRoute configured | ✅ Done |
| Week 2 | All placeholder pages wired: `/customers`, `/sales`, `/products`, `/admin`, `/deleted-customers` | ✅ Done |
| Week 2 | `dev` and `main` branch protection rules set in GitHub | ✅ Done |

### M2 — Frontend Developer
| Date | Task | Status |
|------|------|--------|
| Week 1 | Login page: email/password form + Google button + validation | ✅ Done |
| Week 1 | Register page: all 5 fields + Google register button | ✅ Done |
| Week 2 | App shell: Navbar + Sidebar + layout wrapper | ✅ Done |
| Week 2 | `/auth/callback` loading page for OAuth redirect | ✅ Done |

### M3 — DB Engineer
| Date | Task | Status |
|------|------|--------|
| Week 1 | Supabase project created; URL + anon key shared | ✅ Done |
| Week 1 | All 5 HopeDB tables created and seeded: customer (82), sales (124), salesDetail (~250), product (52), priceHist (~70) | ✅ Done |
| Week 1 | `record_status DEFAULT 'ACTIVE'` and `stamp` columns added to `customer` only | ✅ Done |
| Week 2 | Rights tables seeded: 4 modules, 9 rights, SUPERADMIN user | ✅ Done |
| Week 2 | ERD committed to `/docs/` | ✅ Done |
| Week 2 | SQL verification queries committed | ✅ Done |

### M4 — Rights & Auth
| Date | Task | Status |
|------|------|--------|
| Week 1 | `AuthContext.jsx` with `onAuthStateChange` and `currentUser` state | ✅ Done |
| Week 1 | Email/password `signUp()` + `signIn()` wired to forms | ✅ Done |
| Week 2 | Google OAuth `signInWithOAuth()` + `/auth/callback` route | ✅ Done |
| Week 2 | Login guard: checks `record_status = 'ACTIVE'`; signs out + error if INACTIVE | ✅ Done |
| Week 2 | `provision_new_user()` trigger: creates USER/INACTIVE row + 9 rights defaults on new signup | ✅ Done |

### M5 — QA / Docs
| Date | Task | Status |
|------|------|--------|
| Week 2 | Vitest + React Testing Library configured | ✅ Done |
| Week 2 | 11 test cases written and passing: email reg, Google OAuth, login guard (ACTIVE + INACTIVE) | ✅ Done |
| Week 2 | Sprint 1 log completed | ✅ Done |
| Week 2 | README updated with setup instructions | ✅ Done |

---

## Test Results — Sprint 1

```
✓ Email Registration Form (4)
  ✓ renders an email input field
  ✓ renders a password input field
  ✓ renders a submit / register button
  ✓ calls signUp when the registration form is submitted

✓ Google OAuth Button (3)
  ✓ renders "Continue with Google" button on Login page
  ✓ renders a Google button on Register page
  ✓ calls signInWithGoogle when Google button is clicked on Login

✓ Login Guard — INACTIVE user is blocked (2)
  ✓ displays login guard structure on Login page
  ✓ does NOT navigate to /customers when login returns an error

✓ Login Guard — ACTIVE user is allowed (2)
  ✓ navigates to /customers when signIn succeeds with no error
  ✓ does NOT show an error message when login succeeds

Tests: 11 passed (11) | Duration: ~1.3s
```

---

## Blockers & Resolutions

| Blocker | Resolution |
|---------|------------|
| Vitest tests failing — `useAuth must be used within AuthProvider` | Mocked `AuthContext` module directly with `vi.mock()` to bypass provider requirement |
| Register form submit not triggering `signUp` | All 5 required fields (`firstName`, `lastName`, `email`, `password`, `confirmPassword`) must be filled before form submits |
| Test file not in correct path | Moved `tests/` folder from project root into `src/tests/` to match import paths |

---

## Sprint 1 Gate Checklist

- [x] All 5 tables seeded with correct row counts
- [x] Login guard works for email auth (ACTIVE allowed, INACTIVE blocked)
- [x] Login guard works for Google OAuth
- [x] `provision_new_user()` trigger fires on new signup
- [x] All 11 Sprint 1 test cases passing

---

## Next Sprint Goals (Sprint 2)

- Customer CRUD with rights gating (CUST_ADD, CUST_EDIT, CUST_DEL)
- RLS policies on all 5 tables
- Sales and Product view-only pages
- Soft-delete and Deleted Customers page
- 27-case rights test matrix (3 user types × 9 rights)