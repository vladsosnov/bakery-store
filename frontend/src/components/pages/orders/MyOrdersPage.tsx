import { useEffect, useMemo, useState, type ChangeEvent, type FC, type FormEvent } from 'react';
import { toast } from 'sonner';

import { REVIEW_COMMENT_MAX_LENGTH } from '@src/constants/validation';
import { getAuthSession } from '@src/services/auth-session';
import { getMyOrders } from '@src/services/order-api';
import { saveProductReview } from '@src/services/product-api';
import type { MyOrder } from '@src/types/order';
import { USER_ROLES } from '@src/types/user-role';
import { formatOrderDate } from '@src/utils/date';
import { toErrorMessage } from '@src/utils/error';
import * as S from './MyOrdersPage.styles';

type ReviewDraft = {
    rating: string;
    comment: string;
};

const getReviewKey = (orderId: string, productId: string) => `${orderId}:${productId}`;

export const MyOrdersPage: FC = () => {
  const session = useMemo(() => getAuthSession(), []);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeReviewKey, setActiveReviewKey] = useState<string | null>(null);
  const [reviewDrafts, setReviewDrafts] = useState<Record<string, ReviewDraft>>({});
  const [savingReviewKey, setSavingReviewKey] = useState<string | null>(null);

  const toggleReviewForm = (
    orderId: string,
    productId: string,
    review: MyOrder['items'][number]['review'],
  ) => {
    const reviewKey = getReviewKey(orderId, productId);

    setReviewDrafts((previous) => ({
      ...previous,
      [reviewKey]: previous[reviewKey] ?? {
        rating: review?.rating ? String(review.rating) : '5',
        comment: review?.comment ?? '',
      },
    }));
    setActiveReviewKey((previous) => (previous === reviewKey ? null : reviewKey));
  };

  const handleReviewDraftChange = (
    reviewKey: string,
    field: keyof ReviewDraft,
    value: string,
  ) => {
    setReviewDrafts((previous) => ({
      ...previous,
      [reviewKey]: {
        rating: previous[reviewKey]?.rating ?? '5',
        comment: previous[reviewKey]?.comment ?? '',
        [field]: value,
      },
    }));
  };

  const handleReviewSubmit = async (
    event: FormEvent<HTMLFormElement>,
    orderId: string,
    productId: string,
  ) => {
    event.preventDefault();
    const reviewKey = getReviewKey(orderId, productId);
    const draft = reviewDrafts[reviewKey] ?? { rating: '5', comment: '' };

    try {
      setSavingReviewKey(reviewKey);
      const response = await saveProductReview(productId, {
        rating: Number(draft.rating),
        comment: draft.comment.trim(),
      });

      setOrders((previous) =>
        previous.map((order) => ({
          ...order,
          items: order.items.map((item) =>
            order.id === orderId && item.productId === productId
              ? {
                ...item,
                review: response.data.review
                  ? {
                    rating: response.data.review.rating,
                    comment: response.data.review.comment,
                    updatedAt: response.data.review.updatedAt,
                  }
                  : null,
              }
              : item,
          ),
        })),
      );
      setActiveReviewKey(null);
      toast.success('Review saved.');
    } catch (error) {
      toast.error(toErrorMessage(error, 'Failed to save review.'));
    } finally {
      setSavingReviewKey(null);
    }
  };

  useEffect(() => {
    if (!session || session.user.role !== USER_ROLES.customer) {
      setIsLoading(false);
      return;
    }

    const loadOrders = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMyOrders();
        setOrders(response.data);
      } catch (error) {
        const errorMessage = toErrorMessage(error, 'Failed to load your orders.');
        toast.error(errorMessage);
        setErrorMessage(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [session]);

  if (!session) {
    return (
      <S.Section>
        <S.Card>
          <S.Title>My orders</S.Title>
          <S.Subtitle>Please sign in to view your orders.</S.Subtitle>
        </S.Card>
      </S.Section>
    );
  }

  if (session.user.role !== USER_ROLES.customer) {
    return (
      <S.Section>
        <S.Card>
          <S.Title>My orders</S.Title>
          <S.Subtitle>Order history is available only for customer accounts.</S.Subtitle>
        </S.Card>
      </S.Section>
    );
  }

  if (isLoading) {
    return (
      <S.Section>
        <S.Card>
          <S.Title>My orders</S.Title>
          <S.Subtitle>Loading orders...</S.Subtitle>
        </S.Card>
      </S.Section>
    );
  }

  if (errorMessage) {
    return (
      <S.Section>
        <S.Card>
          <S.Title>My orders</S.Title>
          <S.Subtitle>{errorMessage}</S.Subtitle>
        </S.Card>
      </S.Section>
    );
  }

  return (
    <S.Section>
      <S.Card>
        <S.Title>My orders</S.Title>
        {orders.length === 0 ? (
          <S.Subtitle>You do not have any orders yet.</S.Subtitle>
        ) : (
          <S.OrderList>
            {orders.map((order) => (
              <S.OrderItem key={order.id}>
                <S.OrderHeader>
                  <S.Total>Order #{order.id.slice(-6)}</S.Total>
                  <S.Status>{order.status}</S.Status>
                </S.OrderHeader>
                <S.Subtitle>Placed: {formatOrderDate(order.createdAt)}</S.Subtitle>
                {order.note.trim() !== '' ? (
                  <S.Subtitle>Note: {order.note}</S.Subtitle>
                ) : null}
                <S.Total>Total: ${order.totalPrice.toFixed(2)}</S.Total>
                <S.ItemList>
                  {order.items.map((item) => (
                    <S.Item key={`${order.id}-${item.productId}`}>
                      <S.ItemCard>
                        <S.ItemRow>
                          <S.ItemSummary>
                            {item.name} x {item.quantity} - $
                            {item.lineTotal.toFixed(2)}
                          </S.ItemSummary>
                          <S.SecondaryButton
                            type="button"
                            onClick={() =>
                              toggleReviewForm(
                                order.id,
                                item.productId,
                                item.review,
                              )
                            }
                          >
                            {item.review ? 'Edit review' : 'Write review'}
                          </S.SecondaryButton>
                        </S.ItemRow>
                        {item.review ? (
                          <S.ReviewCard>
                            <S.Total>
                              Rating: {item.review.rating} / 5
                            </S.Total>
                            <S.ReviewText>
                              {item.review.comment.trim() !== ''
                                ? item.review.comment
                                : 'No written comment.'}
                            </S.ReviewText>
                            <S.ReviewText>
                              Updated:{' '}
                              {formatOrderDate(item.review.updatedAt)}
                            </S.ReviewText>
                          </S.ReviewCard>
                        ) : null}
                        {activeReviewKey === getReviewKey(order.id, item.productId) ? (
                          <S.ReviewForm
                            onSubmit={(event) =>
                              handleReviewSubmit(
                                event,
                                order.id,
                                item.productId,
                              )
                            }
                          >
                            <S.FieldGroup>
                              <S.Total
                                as="label"
                                htmlFor={`rating-${order.id}-${item.productId}`}
                              >
                                Rating
                              </S.Total>
                              <S.Select
                                id={`rating-${order.id}-${item.productId}`}
                                value={
                                  reviewDrafts[
                                    getReviewKey(
                                      order.id,
                                      item.productId,
                                    )
                                  ]?.rating ?? '5'
                                }
                                onChange={(
                                  event: ChangeEvent<HTMLSelectElement>,
                                ) =>
                                  handleReviewDraftChange(
                                    getReviewKey(
                                      order.id,
                                      item.productId,
                                    ),
                                    'rating',
                                    event.target.value,
                                  )
                                }
                              >
                                <option value="5">5 - Excellent</option>
                                <option value="4">4 - Very good</option>
                                <option value="3">3 - Good</option>
                                <option value="2">2 - Fair</option>
                                <option value="1">1 - Poor</option>
                              </S.Select>
                            </S.FieldGroup>
                            <S.FieldGroup>
                              <S.Total
                                as="label"
                                htmlFor={`comment-${order.id}-${item.productId}`}
                              >
                                Comment
                              </S.Total>
                              <S.Textarea
                                id={`comment-${order.id}-${item.productId}`}
                                maxLength={
                                  REVIEW_COMMENT_MAX_LENGTH
                                }
                                value={
                                  reviewDrafts[
                                    getReviewKey(
                                      order.id,
                                      item.productId,
                                    )
                                  ]?.comment ?? ''
                                }
                                onChange={(
                                  event: ChangeEvent<HTMLTextAreaElement>,
                                ) =>
                                  handleReviewDraftChange(
                                    getReviewKey(
                                      order.id,
                                      item.productId,
                                    ),
                                    'comment',
                                    event.target.value,
                                  )
                                }
                              />
                              <S.ReviewText>
                                {
                                  (
                                    reviewDrafts[
                                      getReviewKey(
                                        order.id,
                                        item.productId,
                                      )
                                    ]?.comment ?? ''
                                  ).length
                                }
                                /{REVIEW_COMMENT_MAX_LENGTH}
                              </S.ReviewText>
                            </S.FieldGroup>
                            <S.FormActions>
                              <S.SecondaryButton
                                type="button"
                                onClick={() =>
                                  setActiveReviewKey(null)
                                }
                              >
                                Cancel
                              </S.SecondaryButton>
                              <S.SecondaryButton
                                type="submit"
                                disabled={savingReviewKey === getReviewKey(order.id, item.productId)}
                              >
                                {savingReviewKey === getReviewKey(order.id, item.productId)
                                  ? 'Saving...'
                                  : 'Save review'}
                              </S.SecondaryButton>
                            </S.FormActions>
                          </S.ReviewForm>
                        ) : null}
                      </S.ItemCard>
                    </S.Item>
                  ))}
                </S.ItemList>
              </S.OrderItem>
            ))}
          </S.OrderList>
        )}
      </S.Card>
    </S.Section>
  );
};
