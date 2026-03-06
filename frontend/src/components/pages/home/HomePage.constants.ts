import { shopRoutes } from '@src/app/routes';

type Slide = {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  to: string;
};

type BenefitCard = {
  id: number;
  title: string;
  text: string;
};

export const SLIDE_TIMEOUT = 4500;

export const SLIDES: Slide[] = [
  {
    id: 1,
    title: 'New: raspberry croissant cream',
    subtitle: 'Flaky layers, fresh berries, and silky vanilla cream.',
    cta: 'Shop new collection',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80',
    to: shopRoutes.withTag('New')
  },
  {
    id: 2,
    title: 'Weekend cake specials',
    subtitle: 'Limited small-batch cakes baked fresh every morning.',
    cta: 'Order today',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1600&q=80',
    to: shopRoutes.base
  },
  {
    id: 3,
    title: 'Sourdough of the month',
    subtitle: 'Stone-baked bread with deep aroma and crispy crust.',
    cta: 'Explore breads',
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=1600&q=80',
    to: shopRoutes.withTag('Bread')
  }
];

export const BENEFITS: BenefitCard[] = [
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