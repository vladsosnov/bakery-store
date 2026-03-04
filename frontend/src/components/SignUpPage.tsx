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
    background: 'linear-gradient(145deg, #205245, #2f6f51)',
    color: '#fff',
    padding: '28px',
    boxShadow: '0 18px 36px rgba(47, 111, 81, 0.3)'
  }
} as const;

export function SignUpPage() {
  return (
    <section style={pageStyle.section}>
      <article style={pageStyle.accentPanel}>
        <h1 style={{ marginTop: 0, marginBottom: '8px' }}>Create Your Account</h1>
        <p style={{ opacity: 0.95 }}>
          Join Bakery Store to get personalized offers, easy reorders, and seasonal cake alerts.
        </p>
        <ul style={{ marginTop: '14px', paddingLeft: '20px' }}>
          <li>Save delivery details securely</li>
          <li>Receive early discounts</li>
          <li>Get recommended products based on your taste</li>
        </ul>
      </article>

      <article style={pageStyle.panel}>
        <p style={{ margin: 0, color: '#856459', fontWeight: 700 }}>START HERE</p>
        <h2 style={{ marginTop: '8px', marginBottom: '6px' }}>Sign Up</h2>
        <p style={{ marginTop: 0, color: '#7a5a4f' }}>It takes less than a minute.</p>

        <form style={{ display: 'grid', gap: '12px', marginTop: '18px' }}>
          <label style={{ display: 'grid', gap: '6px', fontWeight: 600 }}>
            Full Name
            <input
              type="text"
              placeholder="Vlad Sosnov"
              style={{
                borderRadius: '12px',
                border: '1px solid #e3cbbb',
                padding: '12px 13px',
                fontSize: '0.98rem'
              }}
            />
          </label>

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
              placeholder="Create a password"
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
              background: '#513333',
              color: '#fff',
              fontWeight: 700,
              padding: '12px 14px',
              cursor: 'pointer'
            }}
          >
            Create Account
          </button>
        </form>

        <p style={{ marginBottom: 0, marginTop: '14px', color: '#6f5045' }}>
          Already have an account? <Link to="/sign-in">Sign in</Link>
        </p>
      </article>
    </section>
  );
}
