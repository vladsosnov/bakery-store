import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import { toast } from 'sonner';

import { fetchCart, removeCartItem, updateCartItemQuantity } from '@src/services/cart-api';
import { getAuthSession } from '@src/services/auth-session';
import { placeOrder } from '@src/services/order-api';
import { toErrorMessage } from '@src/utils/error';

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  availableStock: number;
  lineTotal: number;
};

export const useCart = () => {
  const session = useMemo(() => getAuthSession(), []);
  const isCustomer = session?.user.role === 'customer';
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [pendingByProduct, setPendingByProduct] = useState<Record<string, boolean>>({});
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    if (!session || !isCustomer) {
      setIsLoading(false);
      return;
    }

    const loadCart = async () => {
      setIsLoading(true);
      setErrorMessage(null);

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

    loadCart();
  }, [isCustomer, session]);

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
    if (!isCustomer) {
      return;
    }

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
        const response = await updateCartItemQuantity({
          productId,
          quantity: cartItem.quantity + 1
        });

        applyCartResponse(response);
      } catch (error) {
        toast.error(toErrorMessage(error, 'Failed to update quantity.'));
      } finally {
        setProductPending(productId, false);
      }
    };

    updateQuantity();
  };

  const handleDecreaseClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!isCustomer) {
      return;
    }

    const productId = event.currentTarget.dataset.productId;

    if (!productId) {
      return;
    }

    const cartItem = items.find((item) => item.productId === productId);
    if (!cartItem || cartItem.quantity <= 1) {
      return;
    }

    const updateQuantity = async () => {
      try {
        setProductPending(productId, true);
        const response = await updateCartItemQuantity({
          productId,
          quantity: cartItem.quantity - 1
        });

        applyCartResponse(response);
      } catch (error) {
        toast.error(toErrorMessage(error, 'Failed to update quantity.'));
      } finally {
        setProductPending(productId, false);
      }
    };

    updateQuantity();
  };

  const handleRemoveClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!isCustomer) {
      return;
    }

    const productId = event.currentTarget.dataset.productId;

    if (!productId) {
      return;
    }

    const removeItem = async () => {
      try {
        setProductPending(productId, true);
        const response = await removeCartItem({ productId });
        applyCartResponse(response);
      } catch (error) {
        toast.error(toErrorMessage(error, 'Failed to remove item.'));
      } finally {
        setProductPending(productId, false);
      }
    };

    removeItem();
  };

  const handlePlaceOrderClick = () => {
    if (!isCustomer) {
      toast.error('Only customers can place orders.');
      return;
    }

    const placeOrderRequest = async () => {
      try {
        setIsOrdering(true);
        const response = await placeOrder();
        setItems(response.data.cart.items);
        setTotalPrice(response.data.cart.totalPrice);
        toast.success('Order placed successfully.');
      } catch (error) {
        toast.error(toErrorMessage(error, 'Failed to place order.'));
      } finally {
        setIsOrdering(false);
      }
    };

    placeOrderRequest();
  };

  return {
    session,
    isLoading,
    errorMessage,
    items,
    totalPrice,
    pendingByProduct,
    isOrdering,
    isAnyItemPending: Object.values(pendingByProduct).some(Boolean),
    handleIncreaseClick,
    handleDecreaseClick,
    handleRemoveClick,
    handlePlaceOrderClick
  };
};
