import * as S from './AboutPage.styles';

export function AboutPage() {
  return (
    <S.Main>
      <S.Section>
        <S.Hero>
          <S.HeroTitle>About Bakery Store</S.HeroTitle>
          <p>
            Hi, I am <strong>Vlad Sosnov</strong>. I am a baker who cooks cakes, pastries, and
            artisan bread with a focus on clean ingredients and consistent quality.
          </p>
          <p>
            Bakery Store started as a small kitchen project and grew into a place where people can
            order beautiful desserts for daily moments and big celebrations.
          </p>
        </S.Hero>

        <S.Grid>
          <S.Card>
            <S.CardTitle>Our Mission</S.CardTitle>
            <S.CardText>
              To make every customer feel special with fresh bakery products made with care.
            </S.CardText>
          </S.Card>

          <S.Card>
            <S.CardTitle>What We Value</S.CardTitle>
            <S.CardText>Quality ingredients, honest recipes, and warm service for every order.</S.CardText>
          </S.Card>

          <S.Card>
            <S.CardTitle>Why Customers Choose Us</S.CardTitle>
            <S.CardText>
              Reliable taste, custom cake options, and beautiful presentation for events.
            </S.CardText>
          </S.Card>

          <S.Card>
            <S.CardTitle>Contact</S.CardTitle>
            <S.ContactLine>Email: hello@bakerystore.local</S.ContactLine>
            <S.ContactLineLast>Location: Warsaw, Poland</S.ContactLineLast>
          </S.Card>
        </S.Grid>
      </S.Section>
    </S.Main>
  );
}
