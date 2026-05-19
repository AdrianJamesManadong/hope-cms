import { useAuth } from '../context/AuthContext';
import { useRights } from '../context/UserRightsContext';
import { useNavigate, Outlet, NavLink } from 'react-router-dom';

const ICON_FONT = "https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css";

const NAV_ITEMS = [
  { to: '/customers',          label: 'Customers',        icon: 'ti-users',        dot: '#3b82f6' },
  { to: '/sales',              label: 'Sales Summary',    icon: 'ti-chart-bar',    dot: '#10b981' },
  { to: '/products',           label: 'Products',         icon: 'ti-box',          dot: '#f59e0b' },
];

const ADMIN_ITEMS = [
  { to: '/reports/products',   label: 'Product Revenue',  icon: 'ti-trending-up',  dot: '#8b5cf6' },
  { to: '/price-history',      label: 'Price History',    icon: 'ti-clock-dollar', dot: '#06b6d4' },
  { to: '/deleted-customers',  label: 'Deleted Customers',icon: 'ti-trash',        dot: '#6b7280' },
];

const SUPER_ITEMS = [
  { to: '/admin',              label: 'Admin',            icon: 'ti-settings',     dot: '#ef4444' },
];

const sidebarBg   = '#13131a';
const surfaceBg   = '#1a1a24';
const borderColor = 'rgba(255,255,255,0.07)';
const textPrimary = '#e8e8f0';
const textMuted   = '#5a5a72';
const textSub     = '#9090aa';

function SideNavLink({ to, label, icon, dot }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: '9px 12px',
        borderRadius: 10,
        fontSize: 13.5,
        fontWeight: isActive ? 500 : 400,
        color: isActive ? textPrimary : textSub,
        background: isActive ? surfaceBg : 'transparent',
        border: isActive ? `1px solid ${borderColor}` : '1px solid transparent',
        transition: 'all 0.13s ease',
        cursor: 'pointer',
      })}
      onMouseEnter={(e) => {
        const isActive = e.currentTarget.style.background === surfaceBg;
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
          e.currentTarget.style.color = textPrimary;
        }
      }}
      onMouseLeave={(e) => {
        const isActive = e.currentTarget.style.background === surfaceBg;
        if (!isActive) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = textSub;
        }
      }}
    >
      {/* Colored dot indicator */}
      <span style={{
        width: 26, height: 26, borderRadius: 7,
        background: dot + '22',
        border: `1px solid ${dot}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <i className={`ti ${icon}`} style={{ fontSize: 14, color: dot }} aria-hidden="true" />
      </span>
      {label}
    </NavLink>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '6px 14px',
      marginTop: 8, marginBottom: 2,
    }}>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', color: textMuted, textTransform: 'uppercase' }}>
        {children}
      </span>
    </div>
  );
}

function Divider() {
  return <div style={{ margin: '8px 4px', borderTop: `1px solid ${borderColor}` }} />;
}

export default function AppShell() {
  document.title = 'Hope CMS';
  const { currentUser, signOut } = useAuth();
  const { userType, rights } = useRights();
  const navigate = useNavigate();

  const isAdminOrSuper = ['ADMIN', 'SUPERADMIN'].includes(userType);
  const username = currentUser?.username || currentUser?.email || 'User';
  const initials = username.slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <>
      {/* Load Tabler icons */}
      <link rel="stylesheet" href={ICON_FONT} />

      <div style={{ display: 'flex', height: '100vh', fontFamily: "'SF Pro Text', 'Segoe UI', sans-serif", }}>

        {/* ── Sidebar ── */}
        <aside style={{
          width: 232,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          background: sidebarBg,
          borderRight: `1px solid ${borderColor}`,
          padding: '0 8px',
        }}>

          {/* Logo */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 8px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <i className="ti ti-building-hospital" style={{ fontSize: 16, color: '#fff' }} aria-hidden="true" />
              </div>
              <div>
                <div style={{ color: textPrimary, fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                  HOPE CMS
                </div>
                <div style={{ color: textMuted, fontSize: 11 }}>Management</div>
              </div>
            </div>

            {/* Sidebar toggle hint */}
            <button style={{
              background: 'rgba(255,255,255,0.05)', border: `1px solid ${borderColor}`,
              borderRadius: 7, width: 28, height: 28, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: textMuted,
            }}>
              <i className="ti ti-layout-sidebar" style={{ fontSize: 15 }} aria-hidden="true" />
            </button>
          </div>

          <Divider />

          {/* Main nav */}
          <SectionLabel>Main</SectionLabel>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV_ITEMS.map(item => <SideNavLink key={item.to} {...item} />)}
          </nav>

          {isAdminOrSuper && (
            <>
              <Divider />
              <SectionLabel>Reports</SectionLabel>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {ADMIN_ITEMS.map(item => <SideNavLink key={item.to} {...item} />)}
              </nav>
            </>
          )}

          {rights?.ADM_USER === 1 && (
            <>
              <Divider />
              <SectionLabel>System</SectionLabel>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {SUPER_ITEMS.map(item => <SideNavLink key={item.to} {...item} />)}
              </nav>
            </>
          )}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          <Divider />

          {/* User card */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 10px',
            margin: '4px 0 12px',
            borderRadius: 11,
            background: surfaceBg,
            border: `1px solid ${borderColor}`,
          }}>
            {/* Avatar */}
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 12, fontWeight: 600, flexShrink: 0,
              letterSpacing: '0.02em',
            }}>
              {initials}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{
                color: textPrimary, fontSize: 13, fontWeight: 500,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {username}
              </div>
              <div style={{ color: textMuted, fontSize: 11 }}>{userType}</div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: textMuted, display: 'flex', alignItems: 'center',
                padding: 4, borderRadius: 6, transition: 'color 0.13s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={(e) => e.currentTarget.style.color = textMuted}
            >
              <i className="ti ti-logout" style={{ fontSize: 16 }} aria-hidden="true" />
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0e0e16' }}>

          {/* Topbar */}
          <header style={{
            flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 32px',
            background: sidebarBg,
            borderBottom: `1px solid ${borderColor}`,
          }}>
            <div>
              <div style={{ color: textMuted, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                Welcome back
              </div>
              <div style={{ color: textPrimary, fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>
                {username}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

              {/* Sign out */}
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 9, cursor: 'pointer',
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                  color: '#f87171', fontSize: 13, fontWeight: 500, transition: 'all 0.13s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
              >
                <i className="ti ti-logout" style={{ fontSize: 15 }} aria-hidden="true" />
                Sign out
              </button>
            </div>
          </header>

          {/* Page content */}
          <main style={{ flex: 1, overflow: 'auto', padding: 32 }}>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}