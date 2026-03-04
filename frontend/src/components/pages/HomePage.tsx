import { useEffect, useMemo, useState } from 'react';

import * as S from './HomePage.styles';

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
    title: 'New: raspberry croissant cream',
    subtitle: 'Flaky layers, fresh berries, and silky vanilla cream.',
    cta: 'Shop new collection',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 2,
    title: 'Weekend cake specials',
    subtitle: 'Limited small-batch cakes baked fresh every morning.',
    cta: 'Order today',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 3,
    title: 'Sourdough of the month',
    subtitle: 'Stone-baked bread with deep aroma and crispy crust.',
    cta: 'Explore breads',
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=1600&q=80'
  }
];

const BENEFITS: BenefitCard[] = [
  {
    id: 1,
    title: 'Crafted by real bakers',
    text: 'Every pastry is handmade daily by a team that obsesses over quality and flavor.'
  },
  {
    id: 2,
    title: 'Premium ingredients',
    text: 'We use farm eggs, real butter, seasonal fruit, and no artificial shortcuts.'
  },
  {
    id: 3,
    title: 'Perfect for every moment',
    text: 'From coffee breaks to birthday parties, our bakery lineup fits every occasion.'
  }
];

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
    <S.Main>
      <S.Section>
        <S.Slider aria-label="New bakery products banner">
          <S.SlideStage key={currentSlide.id}>
            <S.SlideImage src={currentSlide.image} alt={currentSlide.title} />
            <S.SlideOverlay />

            <S.SlideContent>
              <S.Eyebrow>Fresh drop</S.Eyebrow>
              <S.HeroTitle>{currentSlide.title}</S.HeroTitle>
              <S.Subtitle>{currentSlide.subtitle}</S.Subtitle>
              <S.CTAButton type="button">{currentSlide.cta}</S.CTAButton>
            </S.SlideContent>
          </S.SlideStage>

          <S.SliderDots>
            {SLIDES.map((slide, index) => (
              <S.SliderDot
                key={slide.id}
                type="button"
                onClick={() => setSlideIndex(index)}
                $active={index === slideIndex}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </S.SliderDots>
        </S.Slider>
      </S.Section>

      <S.CardsSection>
        <S.CardsHeading>Why everyone loves our bakery</S.CardsHeading>
        <S.CardsText>
          We combine premium ingredients, old-school baking techniques, and modern design so every
          cake, pastry, and loaf tastes incredible and looks perfect for sharing.
        </S.CardsText>

        <S.CardsGrid>
          {BENEFITS.map((card) => (
            <S.Card key={card.id}>
              <S.CardTitle>{card.title}</S.CardTitle>
              <S.CardText>{card.text}</S.CardText>
            </S.Card>
          ))}
        </S.CardsGrid>
      </S.CardsSection>
    </S.Main>
  );
}
