import { Link } from 'react-router-dom';

const pageStyle = {
  section: {
    width: 'min(1120px, 92vw)',
    margin: '0 auto',
    padding: '34px 0 14px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '18px'
  },
  panel: {
    borderRadius: '20px',
    border: '1px solid #f0d8c9',
    background: '#fff',
    boxShadow: '0 16px 34px rgba(118, 77, 48, 0.11)',
    padding: '28px'
  },
  accentPanel: {
    borderRadius: '20px',
    background: 'linear-gradient(145deg, #4f2d2d, #7d4738)',
    color: '#fff',
    padding: '28px',
    boxShadow: '0 18px 36px rgba(79, 45, 45, 0.3)'
  }
} as const;

export function SignInPage() {
  return (
    <section style={pageStyle.section}>
      <article style={pageStyle.panel}>
        <p style={{ margin: 0, color: '#856459', fontWeight: 700 }}>WELCOME BACK</p>
        <h1 style={{ marginTop: '8px', marginBottom: '6px' }}>Sign In</h1>
        <p style={{ marginTop: 0, color: '#7a5a4f' }}>
          Continue to your bakery account and manage your orders.
        </p>

        <form style={{ display: 'grid', gap: '12px', marginTop: '18px' }}>
          <label style={{ display: 'grid', gap: '6px', fontWeight: 600 }}>
            Email
            <input
              type="email"
              placeholder="vlad@bakerystore.com"
              style={{
                borderRadius: '12px',
                border: '1px solid #e3cbbb',
                padding: '12px 13px',
                fontSize: '0.98rem'
              }}
            />
          </label>

          <label style={{ display: 'grid', gap: '6px', fontWeight: 600 }}>
            Password
            <input
              type="password"
              placeholder="Enter your password"
              style={{
                borderRadius: '12px',
                border: '1px solid #e3cbbb',
                padding: '12px 13px',
                fontSize: '0.98rem'
              }}
            />
          </label>

          <button
            type="submit"
            style={{
              marginTop: '8px',
              borderRadius: '12px',
              border: 'none',
              background: '#2f6f51',
              color: '#fff',
              fontWeight: 700,
              padding: '12px 14px',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
        </form>

        <p style={{ marginBottom: 0, marginTop: '14px', color: '#6f5045' }}>
          New here? <Link to="/sign-up">Create an account</Link>
        </p>
      </article>

      <aside style={pageStyle.accentPanel}>
        <h2 style={{ marginTop: 0 }}>Your daily bakery dashboard</h2>
        <p style={{ opacity: 0.95 }}>
          Track orders, save favorite cakes, and receive early access to weekly specials.
        </p>
        <ul style={{ marginTop: '14px', paddingLeft: '20px' }}>
          <li>Fast checkout with saved details</li>
          <li>Exclusive members-only cake drops</li>
          <li>Order history and invoice access</li>
        </ul>
      </aside>
    </section>
  );
}
