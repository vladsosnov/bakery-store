import type { FC, MouseEventHandler } from 'react';

import { USER_ROLES } from '@src/types/user-role';
import type { AdminUser } from '@src/services/admin-api';
import * as S from '@src/components/pages/styles/AdminDashboardPage.styles';

type UsersTabProps = {
  isLoading: boolean;
  users: AdminUser[];
  onOpenCreateModeratorModal: () => void;
  onEditClick: MouseEventHandler<HTMLButtonElement>;
  onDeleteClick: MouseEventHandler<HTMLButtonElement>;
};

export const UsersTab: FC<UsersTabProps> = ({
  isLoading,
  users,
  onOpenCreateModeratorModal,
  onEditClick,
  onDeleteClick
}) => {
  return (
    <S.Panel>
      <S.HeadWrapper>
        <S.BlockTitle $isTitleWithActions>All users</S.BlockTitle>
        <S.CreateButton type="button" onClick={onOpenCreateModeratorModal}>
          Create moderator
        </S.CreateButton>
      </S.HeadWrapper>

      {isLoading ? <S.EmptyText>Loading users...</S.EmptyText> : null}

      {!isLoading ? (
        <S.UserList>
          {users.map((user) => {
            const isModerator = user.role === USER_ROLES.moderator;

            return (
              <S.UserItem key={user.id}>
                <S.UserRow>
                  <S.UserName>
                    {user.firstName} {user.lastName}
                  </S.UserName>
                  <S.RolePill $role={user.role}>{user.role}</S.RolePill>
                  <S.StatusBadge $active={user.isActive}>
                    {user.isActive ? 'active' : 'disabled'}
                  </S.StatusBadge>
                  <span>{user.email}</span>
                </S.UserRow>

                {isModerator ? (
                  <S.Actions>
                    <S.ActionButton
                      type="button"
                      data-user-id={user.id}
                      onClick={onEditClick}
                    >
                      Edit
                    </S.ActionButton>
                    <S.ActionButton
                      type="button"
                      $danger
                      data-user-id={user.id}
                      onClick={onDeleteClick}
                    >
                      Remove
                    </S.ActionButton>
                  </S.Actions>
                ) : null}
              </S.UserItem>
            );
          })}
        </S.UserList>
      ) : null}
    </S.Panel>
  );
};
