import { useState, type ChangeEvent, type FC, type FormEvent } from 'react';

import { Input } from '@src/components/common/Input';
import type { AdminProduct, CreateAdminProductRequest, UpdateAdminProductRequest } from '@src/types/admin';
import * as S from '@src/components/pages/admin-dashboard/AdminDashboardPage.styles';

type ShopFormState = {
  name: string;
  description: string;
  category: string;
  price: string;
  imageUrl: string;
  tags: string;
  stock: string;
  isAvailable: boolean;
};

type ShopTabProps = {
  isLoading: boolean;
  products: AdminProduct[];
  pendingProductId: string | null;
  onCreateProduct: (payload: CreateAdminProductRequest) => Promise<void>;
  onUpdateProduct: (productId: string, payload: UpdateAdminProductRequest) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
};

const INITIAL_FORM_STATE: ShopFormState = {
  name: '',
  description: '',
  category: '',
  price: '',
  imageUrl: '',
  tags: '',
  stock: '',
  isAvailable: true
};

const toTagsArray = (tagsInput: string) => {
  return tagsInput
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag !== '');
};

const toFormState = (product: AdminProduct): ShopFormState => {
  return {
    name: product.name,
    description: product.description,
    category: product.category,
    price: product.price.toString(),
    imageUrl: product.imageUrl,
    tags: product.tags.join(', '),
    stock: product.stock.toString(),
    isAvailable: product.isAvailable
  };
};

export const ShopTab: FC<ShopTabProps> = ({
  isLoading,
  products,
  pendingProductId,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct
}) => {
  const [form, setForm] = useState<ShopFormState>(INITIAL_FORM_STATE);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ShopFormState>(INITIAL_FORM_STATE);

  const handleFormChange =
    (field: keyof ShopFormState) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const fieldValue =
        field === 'isAvailable' && event.target instanceof HTMLInputElement
          ? event.target.checked
          : event.target.value;

        setForm((prev) => ({
          ...prev,
          [field]: fieldValue
        }));
      };

  const handleEditFormChange =
    (field: keyof ShopFormState) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const fieldValue =
        field === 'isAvailable' && event.target instanceof HTMLInputElement
          ? event.target.checked
          : event.target.value;

        setEditForm((prev) => ({
          ...prev,
          [field]: fieldValue
        }));
      };

  const handleCreateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await onCreateProduct({
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        imageUrl: form.imageUrl.trim(),
        tags: toTagsArray(form.tags),
        stock: Number(form.stock),
        isAvailable: form.isAvailable
      });

      setForm(INITIAL_FORM_STATE);
    } catch {
      // Errors are handled by parent page toasts.
    }
  };

  const handleUpdateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingProductId) {
      return;
    }

    try {
      await onUpdateProduct(editingProductId, {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        category: editForm.category.trim(),
        price: Number(editForm.price),
        imageUrl: editForm.imageUrl.trim(),
        tags: toTagsArray(editForm.tags),
        stock: Number(editForm.stock),
        isAvailable: editForm.isAvailable
      });

      setEditingProductId(null);
      setEditForm(INITIAL_FORM_STATE);
    } catch {
      // Errors are handled by parent page toasts.
    }
  };

  const handleEditClick = (product: AdminProduct) => {
    setEditingProductId(product._id);
    setEditForm(toFormState(product));
  };

  return (
    <S.Panel>
      <S.BlockTitle>Add and maintain products</S.BlockTitle>

      <S.Form onSubmit={handleCreateSubmit} aria-label="create product form">
        <S.FormRow>
          <S.Label>
            Name
            <Input required value={form.name} onChange={handleFormChange('name')} />
          </S.Label>
          <S.Label>
            Category
            <Input required value={form.category} onChange={handleFormChange('category')} />
          </S.Label>
          <S.Label>
            Price
            <Input required type="number" step="0.01" min="0" value={form.price} onChange={handleFormChange('price')} />
          </S.Label>
          <S.Label>
            Stock
            <Input required type="number" min="0" value={form.stock} onChange={handleFormChange('stock')} />
          </S.Label>
        </S.FormRow>

        <S.Label>
          Image URL
          <Input required type="url" value={form.imageUrl} onChange={handleFormChange('imageUrl')} />
        </S.Label>

        <S.Label>
          Tags (comma separated)
          <Input value={form.tags} onChange={handleFormChange('tags')} />
        </S.Label>

        <S.Label>
          Description
          <S.TextArea required value={form.description} onChange={handleFormChange('description')} />
        </S.Label>

        <S.InlineCheckboxLabel>
          <input type="checkbox" checked={form.isAvailable} onChange={handleFormChange('isAvailable')} />
          Available in shop
        </S.InlineCheckboxLabel>

        <S.CreateButton type="submit" disabled={pendingProductId === 'new'}>
          {pendingProductId === 'new' ? 'Creating...' : 'Add product'}
        </S.CreateButton>
      </S.Form>

      {isLoading ? <S.EmptyText>Loading products...</S.EmptyText> : null}

      {!isLoading ? (
        <S.ProductList>
          {products.length === 0 ? <S.EmptyText>No products yet. Add the first product above.</S.EmptyText> : null}

          {products.map((product) => {
            const isEditing = editingProductId === product._id;
            const isPending = pendingProductId === product._id;

            return (
              <S.ProductItem key={product._id}>
                <S.ProductItemHeader>
                  <div>
                    <S.ProductTitle>{product.name}</S.ProductTitle>
                    <S.ProductMeta>
                      {product.category} | ${product.price.toFixed(2)} | stock: {product.stock}
                    </S.ProductMeta>
                    <S.ProductMeta>{product.isAvailable ? 'visible in shop' : 'hidden from shop'}</S.ProductMeta>
                  </div>

                  <S.ProductActions>
                    <S.ActionButton type="button" onClick={() => handleEditClick(product)}>
                      Edit
                    </S.ActionButton>
                    <S.ActionButton
                      type="button"
                      onClick={() => {
                        onUpdateProduct(product._id, { isAvailable: !product.isAvailable }).catch(() => undefined);
                      }}
                      disabled={isPending}
                    >
                      {product.isAvailable ? 'Hide' : 'Show'}
                    </S.ActionButton>
                    <S.ActionButton
                      type="button"
                      $danger
                      onClick={() => {
                        onDeleteProduct(product._id).catch(() => undefined);
                      }}
                      disabled={isPending}
                    >
                      Delete
                    </S.ActionButton>
                  </S.ProductActions>
                </S.ProductItemHeader>

                {isEditing ? (
                  <S.Form onSubmit={handleUpdateSubmit} aria-label={`edit product form ${product.name}`}>
                    <S.FormRow>
                      <S.Label>
                        Name
                        <Input required value={editForm.name} onChange={handleEditFormChange('name')} />
                      </S.Label>
                      <S.Label>
                        Category
                        <Input required value={editForm.category} onChange={handleEditFormChange('category')} />
                      </S.Label>
                      <S.Label>
                        Price
                        <Input
                          required
                          type="number"
                          step="0.01"
                          min="0"
                          value={editForm.price}
                          onChange={handleEditFormChange('price')}
                        />
                      </S.Label>
                      <S.Label>
                        Stock
                        <Input required type="number" min="0" value={editForm.stock} onChange={handleEditFormChange('stock')} />
                      </S.Label>
                    </S.FormRow>

                    <S.Label>
                      Image URL
                      <Input required type="url" value={editForm.imageUrl} onChange={handleEditFormChange('imageUrl')} />
                    </S.Label>

                    <S.Label>
                      Tags
                      <Input value={editForm.tags} onChange={handleEditFormChange('tags')} />
                    </S.Label>

                    <S.Label>
                      Description
                      <S.TextArea required value={editForm.description} onChange={handleEditFormChange('description')} />
                    </S.Label>

                    <S.InlineCheckboxLabel>
                      <input type="checkbox" checked={editForm.isAvailable} onChange={handleEditFormChange('isAvailable')} />
                      Available in shop
                    </S.InlineCheckboxLabel>

                    <S.Actions>
                      <S.CreateButton type="submit" disabled={isPending}>
                        {isPending ? 'Saving...' : 'Save changes'}
                      </S.CreateButton>
                      <S.ActionButton
                        type="button"
                        onClick={() => {
                          setEditingProductId(null);
                          setEditForm(INITIAL_FORM_STATE);
                        }}
                      >
                        Cancel
                      </S.ActionButton>
                    </S.Actions>
                  </S.Form>
                ) : null}
              </S.ProductItem>
            );
          })}
        </S.ProductList>
      ) : null}
    </S.Panel>
  );
};
