import { useEffect, useMemo, useState, type CSSProperties } from 'react';

type Slide = {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
};

type BenefitCard = {
  id: number;
  title: string;
  text: string;
};

const SLIDES: Slide[] = [
  {
    id: 1,
    title: 'New: Raspberry Croissant Cream',
    subtitle: 'Flaky layers, fresh berries, and silky vanilla cream.',
    cta: 'Shop New Collection',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 2,
    title: 'Weekend Cake Specials',
    subtitle: 'Limited small-batch cakes baked fresh every morning.',
    cta: 'Order Today',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 3,
    title: 'Sourdough of the Month',
    subtitle: 'Stone-baked bread with deep aroma and crispy crust.',
    cta: 'Explore Breads',
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=1600&q=80'
  }
];

const BENEFITS: BenefitCard[] = [
  {
    id: 1,
    title: 'Crafted by Real Bakers',
    text: 'Every pastry is handmade daily by a team that obsesses over quality and flavor.'
  },
  {
    id: 2,
    title: 'Premium Ingredients',
    text: 'We use farm eggs, real butter, seasonal fruit, and no artificial shortcuts.'
  },
  {
    id: 3,
    title: 'Perfect for Every Moment',
    text: 'From coffee breaks to birthday parties, our bakery lineup fits every occasion.'
  }
];

const pageStyles: Record<string, CSSProperties> = {
  section: {
    width: 'min(1120px, 92vw)',
    margin: '0 auto'
  },
  slider: {
    marginTop: '24px',
    borderRadius: '24px',
    overflow: 'hidden',
    position: 'relative',
    minHeight: '360px',
    display: 'flex',
    alignItems: 'flex-end',
    boxShadow: '0 16px 30px rgba(117, 79, 52, 0.18)'
  },
  slideImage: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  slideOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(90deg, rgba(34, 19, 13, 0.78), rgba(34, 19, 13, 0.22))'
  },
  slideContent: {
    position: 'relative',
    padding: '36px',
    color: '#fff',
    maxWidth: '540px'
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
  sliderDots: {
    position: 'absolute',
    right: '20px',
    bottom: '18px',
    display: 'flex',
    gap: '8px',
    zIndex: 3
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    border: 0,
    cursor: 'pointer'
  },
  cardsSection: {
    padding: '50px 0 72px'
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px'
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid #f0d8c9',
    padding: '20px',
    boxShadow: '0 8px 18px rgba(118, 77, 48, 0.08)'
  }
};

export function HomePage() {
  const [slideIndex, setSlideIndex] = useState(0);
  const currentSlide = useMemo(() => SLIDES[slideIndex], [slideIndex]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main>
      <section style={pageStyles.section}>
        <article style={pageStyles.slider} aria-label="New bakery products banner">
          <img src={currentSlide.image} alt={currentSlide.title} style={pageStyles.slideImage} />
          <div style={pageStyles.slideOverlay} />

          <div style={pageStyles.slideContent}>
            <p style={{ margin: 0, opacity: 0.8 }}>Fresh drop</p>
            <h1 style={{ marginTop: '8px', marginBottom: '8px', fontSize: 'clamp(2rem, 6vw, 3rem)' }}>
              {currentSlide.title}
            </h1>
            <p style={{ marginTop: 0 }}>{currentSlide.subtitle}</p>
            <button type="button" style={pageStyles.buttonSolid}>
              {currentSlide.cta}
            </button>
          </div>

          <div style={pageStyles.sliderDots}>
            {SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setSlideIndex(index)}
                style={{
                  ...pageStyles.dot,
                  background: index === slideIndex ? '#fff' : 'rgba(255, 255, 255, 0.5)'
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </article>
      </section>

      <section style={{ ...pageStyles.section, ...pageStyles.cardsSection }}>
        <h2 style={{ marginTop: 0 }}>Why everyone loves our bakery</h2>
        <p style={{ maxWidth: '700px', color: '#76554a' }}>
          We combine premium ingredients, old-school baking techniques, and modern design so every
          cake, pastry, and loaf tastes incredible and looks perfect for sharing.
        </p>

        <div style={pageStyles.cardsGrid}>
          {BENEFITS.map((card) => (
            <article key={card.id} style={pageStyles.card}>
              <h3 style={{ marginTop: 0 }}>{card.title}</h3>
              <p style={{ marginBottom: 0, color: '#6f5045' }}>{card.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
