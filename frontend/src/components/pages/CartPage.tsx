import axios from 'axios';
import { useEffect, useMemo, useState, type FC, type MouseEvent } from 'react';
import { toast } from 'sonner';

import { fetchCart, removeCartItem, updateCartItemQuantity } from '@src/services/cart-api';
import { getAuthSession } from '@src/services/auth-session';

import * as S from './CartPage.styles';

export const CartPage: FC = () => {
  const session = useMemo(() => getAuthSession(), []);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [items, setItems] = useState<
    Array<{
      productId: string;
      name: string;
      price: number;
      quantity: number;
      lineTotal: number;
    }>
  >([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [pendingByProduct, setPendingByProduct] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!session) {
      setIsLoading(false);
      return;
    }

    const loadCart = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      setStatusMessage(null);
      setHasError(false);

      try {
        const response = await fetchCart();
        setItems(response.data.items);
        setTotalPrice(response.data.totalPrice);
      } catch {
        toast.error('Failed to load cart.');
        setErrorMessage('Failed to load cart.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadCart();
  }, [session]);

  if (!session) {
    return (
      <S.Section>
        <S.Card>
          <S.Title>Cart</S.Title>
          <S.Subtitle>Please sign in to access your cart.</S.Subtitle>
        </S.Card>
      </S.Section>
    );
  }

  if (isLoading) {
    return (
      <S.Section>
        <S.Card>
          <S.Title>Cart</S.Title>
          <S.Subtitle>Loading cart...</S.Subtitle>
        </S.Card>
      </S.Section>
    );
  }

  if (errorMessage) {
    return (
      <S.Section>
        <S.Card>
          <S.Title>Cart</S.Title>
          <S.Status $isError>{errorMessage}</S.Status>
        </S.Card>
      </S.Section>
    );
  }

  const applyCartResponse = (response: Awaited<ReturnType<typeof fetchCart>>) => {
    setItems(response.data.items);
    setTotalPrice(response.data.totalPrice);
  };

  const setProductPending = (productId: string, pending: boolean) => {
    setPendingByProduct((prev) => ({
      ...prev,
      [productId]: pending
    }));
  };

  const handleIncreaseClick = (event: MouseEvent<HTMLButtonElement>) => {
    const productId = event.currentTarget.dataset.productId;

    if (!productId) {
      return;
    }

    const cartItem = items.find((item) => item.productId === productId);
    if (!cartItem) {
      return;
    }

    const updateQuantity = async () => {
      try {
        setProductPending(productId, true);
        setStatusMessage(null);
        setHasError(false);
        const response = await updateCartItemQuantity({
          productId,
          quantity: cartItem.quantity + 1
        });

        applyCartResponse(response);
      } catch (error) {
        const errorMessage = axios.isAxiosError<{ error?: string }>(error)
          ? error.response?.data?.error ?? 'Failed to update quantity.'
          : 'Failed to update quantity.';
        toast.error(errorMessage);
        setStatusMessage(errorMessage);
        setHasError(true);
      } finally {
        setProductPending(productId, false);
      }
    };

    void updateQuantity();
  };

  const handleDecreaseClick = (event: MouseEvent<HTMLButtonElement>) => {
    const productId = event.currentTarget.dataset.productId;

    if (!productId) {
      return;
    }

    const cartItem = items.find((item) => item.productId === productId);
    if (!cartItem) {
      return;
    }

    if (cartItem.quantity <= 1) {
      return;
    }

    const updateQuantity = async () => {
      try {
        setProductPending(productId, true);
        setStatusMessage(null);
        setHasError(false);
        const response = await updateCartItemQuantity({
          productId,
          quantity: cartItem.quantity - 1
        });

        applyCartResponse(response);
      } catch (error) {
        const errorMessage = axios.isAxiosError<{ error?: string }>(error)
          ? error.response?.data?.error ?? 'Failed to update quantity.'
          : 'Failed to update quantity.';
        toast.error(errorMessage);
        setStatusMessage(errorMessage);
        setHasError(true);
      } finally {
        setProductPending(productId, false);
      }
    };

    void updateQuantity();
  };

  const handleRemoveClick = (event: MouseEvent<HTMLButtonElement>) => {
    const productId = event.currentTarget.dataset.productId;

    if (!productId) {
      return;
    }

    const removeItem = async () => {
      try {
        setProductPending(productId, true);
        setStatusMessage(null);
        setHasError(false);
        const response = await removeCartItem({ productId });
        applyCartResponse(response);
      } catch (error) {
        const errorMessage = axios.isAxiosError<{ error?: string }>(error)
          ? error.response?.data?.error ?? 'Failed to remove item.'
          : 'Failed to remove item.';
        toast.error(errorMessage);
        setStatusMessage(errorMessage);
        setHasError(true);
      } finally {
        setProductPending(productId, false);
      }
    };

    void removeItem();
  };

  return (
    <S.Section>
      <S.Card>
        <S.Title>Cart</S.Title>
        {items.length === 0 ? (
          <S.Subtitle>
            Hi {session.user.firstName}, your cart is empty for now. Add products from the shop to continue.
          </S.Subtitle>
        ) : (
          <>
            <S.Subtitle>Items in your cart:</S.Subtitle>
            {statusMessage ? (
              <S.Status role={hasError ? 'alert' : 'status'} $isError={hasError}>
                {statusMessage}
              </S.Status>
            ) : null}
            <S.ItemList>
              {items.map((item) => (
                <S.Item key={item.productId}>
                  <S.ItemName>{item.name}</S.ItemName>
                  <S.QuantityControls>
                    <S.QuantityButton
                      type="button"
                      data-product-id={item.productId}
                      onClick={handleDecreaseClick}
                      disabled={item.quantity <= 1 || Boolean(pendingByProduct[item.productId])}
                      aria-label={`Decrease quantity for ${item.name}`}
                    >
                      -
                    </S.QuantityButton>
                    <S.QuantityValue>Qty: {item.quantity}</S.QuantityValue>
                    <S.QuantityButton
                      type="button"
                      data-product-id={item.productId}
                      onClick={handleIncreaseClick}
                      disabled={Boolean(pendingByProduct[item.productId])}
                      aria-label={`Increase quantity for ${item.name}`}
                    >
                      +
                    </S.QuantityButton>
                  </S.QuantityControls>
                  <S.ItemPrice>${item.lineTotal.toFixed(2)}</S.ItemPrice>
                  <S.RemoveButton
                    type="button"
                    data-product-id={item.productId}
                    onClick={handleRemoveClick}
                    disabled={Boolean(pendingByProduct[item.productId])}
                  >
                    Remove
                  </S.RemoveButton>
                </S.Item>
              ))}
            </S.ItemList>
            <S.Total>Total: ${totalPrice.toFixed(2)}</S.Total>
          </>
        )}
      </S.Card>
    </S.Section>
  );
};
