import type { ChangeEvent, FC } from 'react';

import { useCart } from '@src/components/pages/cart/useCart';
import { ORDER_NOTE_MAX_LENGTH } from '@src/constants/validation';
import * as S from '@src/components/pages/cart/CartPage.styles';

export const CartPage: FC = () => {
  const {
    session,
    isLoading,
    errorMessage,
    items,
    totalPrice,
    pendingByProduct,
    isOrdering,
    isAnyItemPending,
    useProfileAddress,
    orderNote,
    deliveryAddress,
    handleUseProfileAddressChange,
    handleDeliveryAddressChange,
    handleOrderNoteChange,
    handleIncreaseClick,
    handleDecreaseClick,
    handleRemoveClick,
    handlePlaceOrderClick
  } = useCart();

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

  if (session.user.role === 'moderator') {
    return (
      <S.Section>
        <S.Card>
          <S.Title>Cart</S.Title>
          <S.Subtitle>As a moderator, you can not use cart or place orders.</S.Subtitle>
        </S.Card>
      </S.Section>
    );
  }

  if (session.user.role === 'admin') {
    return (
      <S.Section>
        <S.Card>
          <S.Title>Cart</S.Title>
          <S.Subtitle>As an admin, you can not use cart or place orders.</S.Subtitle>
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
                      disabled={Boolean(pendingByProduct[item.productId]) || item.quantity >= item.availableStock}
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
            <S.DeliveryCard>
              <S.DeliveryTitle>Delivery address</S.DeliveryTitle>
              <S.CheckboxLabel>
                <input
                  type="checkbox"
                  checked={useProfileAddress}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    handleUseProfileAddressChange(event.target.checked)
                  }
                />
                Use address from profile
              </S.CheckboxLabel>
              {useProfileAddress ? (
                <S.Subtitle>
                  {deliveryAddress.street || deliveryAddress.city || deliveryAddress.zip
                    ? `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.zip}`
                    : 'Address is not set in your profile. Add it in Profile page.'}
                </S.Subtitle>
              ) : (
                <S.AddressGrid>
                  <S.AddressInput
                    value={deliveryAddress.zip}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      handleDeliveryAddressChange('zip', event.target.value)
                    }
                    placeholder="ZIP"
                    aria-label="Delivery ZIP"
                  />
                  <S.AddressInput
                    value={deliveryAddress.city}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      handleDeliveryAddressChange('city', event.target.value)
                    }
                    placeholder="City"
                    aria-label="Delivery city"
                  />
                  <S.AddressInput
                    value={deliveryAddress.street}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      handleDeliveryAddressChange('street', event.target.value)
                    }
                    placeholder="Street address"
                    aria-label="Delivery street"
                  />
                </S.AddressGrid>
              )}
            </S.DeliveryCard>
            <S.DeliveryCard>
              <S.DeliveryTitle>Note for the shop</S.DeliveryTitle>
              <S.NoteInput
                value={orderNote}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => handleOrderNoteChange(event.target.value)}
                placeholder="Add pickup or packing notes (optional)"
                maxLength={ORDER_NOTE_MAX_LENGTH}
                aria-label="Order note"
              />
              <S.Status>
                {orderNote.length}/{ORDER_NOTE_MAX_LENGTH} characters
              </S.Status>
            </S.DeliveryCard>
            <S.CheckoutBar>
              <S.CheckoutButton
                type="button"
                onClick={handlePlaceOrderClick}
                disabled={isOrdering || isAnyItemPending}
              >
                {isOrdering ? 'Placing order...' : 'Place order'}
              </S.CheckoutButton>
            </S.CheckoutBar>
          </>
        )}
      </S.Card>
    </S.Section>
  );
};
