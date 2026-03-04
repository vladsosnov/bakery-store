import type { CSSProperties } from 'react';

const styles: Record<string, CSSProperties> = {
  section: {
    width: 'min(1120px, 92vw)',
    margin: '0 auto',
    padding: '30px 0 12px'
  },
  hero: {
    background: '#fff',
    border: '1px solid #f0d8c9',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 8px 18px rgba(118, 77, 48, 0.08)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginTop: '18px'
  },
  card: {
    background: '#fff',
    border: '1px solid #f0d8c9',
    borderRadius: '16px',
    padding: '18px',
    boxShadow: '0 8px 18px rgba(118, 77, 48, 0.08)'
  }
};

export function AboutPage() {
  return (
    <main>
      <section style={styles.section}>
        <article style={styles.hero}>
          <h1 style={{ marginTop: 0 }}>About Bakery Store</h1>
          <p>
            Hi, I am <strong>Vlad Sosnov</strong>. I am a baker who cooks cakes, pastries, and
            artisan bread with a focus on clean ingredients and consistent quality.
          </p>
          <p>
            Bakery Store started as a small kitchen project and grew into a place where people can
            order beautiful desserts for daily moments and big celebrations.
          </p>
        </article>

        <div style={styles.grid}>
          <article style={styles.card}>
            <h2 style={{ marginTop: 0 }}>Our Mission</h2>
            <p style={{ marginBottom: 0 }}>
              To make every customer feel special with fresh bakery products made with care.
            </p>
          </article>

          <article style={styles.card}>
            <h2 style={{ marginTop: 0 }}>What We Value</h2>
            <p style={{ marginBottom: 0 }}>
              Quality ingredients, honest recipes, and warm service for every order.
            </p>
          </article>

          <article style={styles.card}>
            <h2 style={{ marginTop: 0 }}>Why Customers Choose Us</h2>
            <p style={{ marginBottom: 0 }}>
              Reliable taste, custom cake options, and beautiful presentation for events.
            </p>
          </article>

          <article style={styles.card}>
            <h2 style={{ marginTop: 0 }}>Contact</h2>
            <p style={{ margin: 0 }}>Email: hello@bakerystore.local</p>
            <p style={{ marginBottom: 0 }}>Location: Warsaw, Poland</p>
          </article>
        </div>
      </section>
    </main>
  );
}
