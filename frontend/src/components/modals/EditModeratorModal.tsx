import { useEffect, useState, type FC } from 'react';
import { toast } from 'sonner';

import { Input } from '@src/components/common/Input';
import { NAME_MAX_LENGTH } from '@src/constants/validation';
import { SubmitButton } from '@src/components/common/SubmitButton';
import { updateAdminModerator } from '@src/services/admin-api';
import * as S from '@src/components/pages/admin-dashboard/AdminDashboardPage.styles';
import type { AdminUser } from '@src/types/admin';
import { toErrorMessage } from '@src/utils/error';

type EditModeratorModalProps = {
  isOpen: boolean;
  moderator: AdminUser | null;
  onClose: () => void;
  onUpdated: (user: AdminUser) => void;
};

export const EditModeratorModal: FC<EditModeratorModalProps> = ({
  isOpen,
  moderator,
  onClose,
  onUpdated
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen || !moderator) {
      return;
    }

    setFirstName(moderator.firstName);
    setLastName(moderator.lastName);
    setEmail(moderator.email);
    setIsActive(moderator.isActive);
    setIsSubmitting(false);
  }, [isOpen, moderator]);

  const handleSaveClick = async () => {
    if (!moderator) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateAdminModerator(moderator.id, {
        firstName,
        lastName,
        email,
        isActive
      });
      onUpdated(response.data);
      toast.success('Moderator updated successfully.');
      onClose();
    } catch (error) {
      toast.error(toErrorMessage(error, 'Failed to update moderator.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !moderator) {
    return null;
  }

  return (
    <S.ModalOverlay role="presentation" onClick={isSubmitting ? undefined : onClose}>
      <S.ModalCard
        role="dialog"
        aria-modal="true"
        aria-label="Edit moderator dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <S.ModalHeader>
          <S.BlockTitle $isTitleWithActions>Edit moderator</S.BlockTitle>
          <S.CloseButton type="button" onClick={onClose} disabled={isSubmitting}>
            Close
          </S.CloseButton>
        </S.ModalHeader>
        <S.Form>
          <S.Label>
            First name
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} maxLength={NAME_MAX_LENGTH} />
          </S.Label>
          <S.Label>
            Last name
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} maxLength={NAME_MAX_LENGTH} />
          </S.Label>
          <S.Label>
            Email
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </S.Label>
          <S.InlineCheckboxLabel>
            Active
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          </S.InlineCheckboxLabel>
        </S.Form>
        <S.ModalActions>
          <SubmitButton type="button" disabled={isSubmitting} onClick={handleSaveClick}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </SubmitButton>
          <S.CloseButton type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </S.CloseButton>
        </S.ModalActions>
      </S.ModalCard>
    </S.ModalOverlay>
  );
};
