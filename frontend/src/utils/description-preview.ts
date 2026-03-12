import { PRODUCT_DESCRIPTION_MAX_LENGTH } from '@src/constants/validation';

type DescriptionPreview = {
  text: string;
  isTruncated: boolean;
};

export const getDescriptionPreview = (description: string): DescriptionPreview => {
  if (description.length <= PRODUCT_DESCRIPTION_MAX_LENGTH) {
    return {
      text: description,
      isTruncated: false
    };
  }

  return {
    text: `${description.slice(0, PRODUCT_DESCRIPTION_MAX_LENGTH)}...`,
    isTruncated: true
  };
};
