import { useEffect, useMemo, useState, type FC, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import * as S from './HomePage.styles';
import { SLIDES, SLIDE_TIMEOUT, BENEFITS } from './HomePage.constants';


export const HomePage: FC = () => {
  const navigate = useNavigate();
  const [slideIndex, setSlideIndex] = useState(0);
  const currentSlide = useMemo(() => SLIDES[slideIndex], [slideIndex]);

  const handleSlideCtaClick = () => {
    navigate(currentSlide.to);
  };

  const handleSliderDotClick = (event: MouseEvent<HTMLButtonElement>) => {
    const indexValue = event.currentTarget.dataset.index;
    const nextSlideIndex = indexValue ? Number(indexValue) : Number.NaN;

    if (Number.isNaN(nextSlideIndex)) {
      return;
    }

    setSlideIndex(nextSlideIndex);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSlideIndex((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_TIMEOUT);

    return () => window.clearTimeout(timer);
  }, [slideIndex]);

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
              <S.CTAButton type="button" onClick={handleSlideCtaClick}>
                {currentSlide.cta}
              </S.CTAButton>
            </S.SlideContent>
          </S.SlideStage>

          <S.SliderDots>
            {SLIDES.map((slide, index) => (
              <S.SliderDot
                key={slide.id}
                type="button"
                data-index={index}
                onClick={handleSliderDotClick}
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
};
