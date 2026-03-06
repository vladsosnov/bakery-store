import { useState, type FC } from 'react';
import { toast } from 'sonner';

import { deleteAdminModerator } from '@src/services/admin-api';
import * as S from '@src/components/pages/admin-dashboard/AdminDashboardPage.styles';
import type { AdminUser } from '@src/types/admin';
import { toErrorMessage } from '@src/utils/error';

type RemoveModeratorModalProps = {
  isOpen: boolean;
  moderator: AdminUser | null;
  onClose: () => void;
  onRemoved: (userId: string) => void;
};

export const RemoveModeratorModal: FC<RemoveModeratorModalProps> = ({
  isOpen,
  moderator,
  onClose,
  onRemoved
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!moderator) {
      return;
    }

    setIsSubmitting(true);
    try {
      await deleteAdminModerator(moderator.id);
      onRemoved(moderator.id);
      toast.success('Moderator removed successfully.');
      onClose();
    } catch (error) {
      toast.error(toErrorMessage(error, 'Failed to remove moderator.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !moderator) {
    return null;
  }

  return (
    <S.ModalOverlay role="presentation" onClick={onClose}>
      <S.ModalCard
        role="dialog"
        aria-modal="true"
        aria-label="Remove moderator confirmation dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <S.ModalHeader>
          <S.BlockTitle $isTitleWithActions>Remove moderator</S.BlockTitle>
          <S.CloseButton type="button" onClick={onClose}>
            Close
          </S.CloseButton>
        </S.ModalHeader>
        <S.ModalBodyText>
          Are you sure you want to remove {moderator.firstName} {moderator.lastName}? This action cannot be undone.
        </S.ModalBodyText>
        <S.ModalActions>
          <S.ActionButton type="button" $danger onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Removing...' : 'Remove moderator'}
          </S.ActionButton>
          <S.CloseButton type="button" onClick={onClose}>
            Cancel
          </S.CloseButton>
        </S.ModalActions>
      </S.ModalCard>
    </S.ModalOverlay>
  );
};
