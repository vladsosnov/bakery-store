import { useEffect, useState, type ChangeEvent, type FC, type FormEventHandler, type MouseEvent } from 'react';
import { toast } from 'sonner';

import { Input } from '@src/components/common/Input';
import { NAME_MAX_LENGTH } from '@src/constants/validation';
import { SubmitButton } from '@src/components/common/SubmitButton';
import { createAdminModerator } from '@src/services/admin-api';
import * as S from '@src/components/pages/admin-dashboard/AdminDashboardPage.styles';
import type { AdminUser } from '@src/types/admin';
import { toErrorMessage } from '@src/utils/error';

type CreateModeratorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (user: AdminUser) => void;
};

type CreateModeratorForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const EMPTY_FORM: CreateModeratorForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: ''
};

export const CreateModeratorModal: FC<CreateModeratorModalProps> = ({
  isOpen,
  onClose,
  onCreated
}) => {
  const [form, setForm] = useState<CreateModeratorForm>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY_FORM);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleModalCardClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleFormFieldChange = (field: keyof CreateModeratorForm) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value
      }));
    };
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await createAdminModerator(form);
      onCreated(response.data);
      toast.success('Moderator created successfully.');
      onClose();
    } catch (error) {
      toast.error(toErrorMessage(error, 'Failed to create moderator.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <S.ModalOverlay role="presentation" onClick={isSubmitting ? undefined : onClose}>
      <S.ModalCard
        role="dialog"
        aria-modal="true"
        aria-label="Create moderator dialog"
        onClick={handleModalCardClick}
      >
        <S.ModalHeader>
          <S.BlockTitle $isTitleWithActions>Create moderator</S.BlockTitle>
          <S.CloseButton type="button" onClick={onClose} disabled={isSubmitting}>
            Close
          </S.CloseButton>
        </S.ModalHeader>
        <S.Form onSubmit={handleSubmit}>
          <S.Label>
            First name
            <Input value={form.firstName} onChange={handleFormFieldChange('firstName')} maxLength={NAME_MAX_LENGTH} required />
          </S.Label>
          <S.Label>
            Last name
            <Input value={form.lastName} onChange={handleFormFieldChange('lastName')} maxLength={NAME_MAX_LENGTH} required />
          </S.Label>
          <S.Label>
            Email
            <Input type="email" value={form.email} onChange={handleFormFieldChange('email')} required />
          </S.Label>
          <S.Label>
            Temporary password
            <Input
              type="password"
              value={form.password}
              onChange={handleFormFieldChange('password')}
              minLength={8}
              required
            />
          </S.Label>
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create moderator'}
          </SubmitButton>
        </S.Form>
      </S.ModalCard>
    </S.ModalOverlay>
  );
};
