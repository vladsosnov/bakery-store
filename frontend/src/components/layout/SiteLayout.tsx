import { NavLink, Outlet, useLocation } from 'react-router-dom';
import type { CSSProperties } from 'react';

const styles: Record<string, CSSProperties> = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(180deg, #fff7f0 0%, #fff 40%, #fff7f0 100%)',
    color: '#2d1d1d'
  },
  content: {
    flex: 1
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 28px',
    position: 'sticky',
    top: 0,
    backdropFilter: 'blur(8px)',
    backgroundColor: 'rgba(255, 247, 240, 0.85)',
    borderBottom: '1px solid #f1ddd0',
    zIndex: 20
  },
  nav: {
    display: 'flex',
    gap: '20px',
    fontWeight: 600
  },
  link: {
    textDecoration: 'none'
  },
  linkActive: {
    textDecoration: 'underline'
  },
  auth: {
    display: 'flex',
    gap: '10px'
  },
  buttonGhost: {
    border: '1px solid #d7b9a6',
    background: '#fff7f0',
    color: '#513333',
    borderRadius: '999px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontWeight: 600
  },
  buttonSolid: {
    border: '1px solid #513333',
    background: '#513333',
    color: '#fff',
    borderRadius: '999px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontWeight: 600
  },
  footer: {
    marginTop: '20px',
    padding: '24px 28px',
    borderTop: '1px solid #f1ddd0',
    color: '#76554a'
  },
  chatButton: {
    position: 'fixed',
    right: '18px',
    bottom: '18px',
    border: 'none',
    borderRadius: '999px',
    background: '#2f6f51',
    color: '#fff',
    padding: '14px 18px',
    fontWeight: 700,
    boxShadow: '0 10px 24px rgba(31, 90, 64, 0.35)',
    cursor: 'pointer',
    zIndex: 30
  }
};

const navItems = [
  { to: '/', label: 'Home Page', end: true },
  { to: '/shop', label: 'Shop Page' },
  { to: '/about', label: 'About Page' }
];

export function SiteLayout() {
  const location = useLocation();

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <strong>Bakery Store</strong>

        <nav style={styles.nav} aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                ...styles.link,
                ...(isActive ? styles.linkActive : {})
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={styles.auth}>
          <button type="button" style={styles.buttonGhost}>
            Sign In
          </button>
          <button type="button" style={styles.buttonSolid}>
            Sign Up
          </button>
        </div>
      </header>

      <main style={styles.content}>
        <div key={location.pathname} className="route-transition">
          <Outlet />
        </div>
      </main>

      <footer style={styles.footer}>
        Bakery Store - Freshly baked with care, every single day.
      </footer>

      <button
        type="button"
        style={styles.chatButton}
        aria-label="Open chat"
        title="Chat coming soon"
      >
        Chat
      </button>
    </div>
  );
}
