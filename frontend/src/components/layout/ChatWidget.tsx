import { useEffect, useMemo, useState, type ChangeEvent, type FC, type MouseEvent, type SyntheticEvent } from 'react';
import { toast } from 'sonner';

import { getAuthSession } from '@src/services/auth-session';
import { getMyChatThread, postMyChatMessage } from '@src/services/chat-api';
import { subscribeToChatThreadUpdates } from '@src/services/chat-socket';
import type { ChatMessage } from '@src/types/chat';
import { USER_ROLES } from '@src/types/user-role';
import { toErrorMessage } from '@src/utils/error';
import * as S from './styles/ChatWidget.styles';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    senderRole: 'system',
    text: 'Hey! I can help with cakes, delivery windows, and custom orders.',
    createdAt: new Date().toISOString()
  }
];

const QUICK_ACTIONS = ['Delivery info', 'Custom cake', 'Today specials'];

type ChatWidgetProps = {
  onClose: () => void;
};

export const ChatWidget: FC<ChatWidgetProps> = ({ onClose }) => {
  const session = useMemo(() => getAuthSession(), []);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session || session.user.role !== USER_ROLES.customer) {
      setIsLoading(false);
      return;
    }

    const loadThread = async () => {
      setIsLoading(true);
      try {
        const response = await getMyChatThread();
        if (response.data) {
          setMessages(response.data.messages);
        }
      } catch (error) {
        toast.error(toErrorMessage(error, 'Failed to load chat messages.'));
      } finally {
        setIsLoading(false);
      }
    };

    loadThread();
  }, [session]);

  useEffect(() => {
    if (!session || session.user.role !== USER_ROLES.customer) {
      return;
    }

    return subscribeToChatThreadUpdates((thread) => {
      if (thread.customerId === session.user.id) {
        setMessages(thread.messages);
      }
    });
  }, [session]);

  const sendMessage = async (text: string) => {
    if (!session) {
      toast.error('Sign in first to chat with support.');
      return;
    }

    if (session.user.role !== USER_ROLES.customer) {
      toast.error('Chat inbox is available in Admin dashboard for moderators.');
      return;
    }

    try {
      setIsSending(true);
      const response = await postMyChatMessage({ text });
      setMessages(response.data.messages);
    } catch (error) {
      toast.error(toErrorMessage(error, 'Failed to send message.'));
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickActionClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isSending) {
      return;
    }

    const action = event.currentTarget.dataset.action;

    if (!action) {
      return;
    }

    sendMessage(action);
  };

  const handleDraftChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraft(event.target.value);
  };

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSending) {
      return;
    }

    const next = draft.trim();

    if (!next) {
      return;
    }

    sendMessage(next);
    setDraft('');
  };

  return (
    <S.Panel aria-label="Support chat panel">
      <S.Header>
        <S.HeaderText>
          <S.Title>Bakery support</S.Title>
          <S.HeaderMeta>Usually replies in a few minutes</S.HeaderMeta>
        </S.HeaderText>
        <S.CloseButton type="button" onClick={onClose} aria-label="Close chat">
          Close
        </S.CloseButton>
      </S.Header>

      <S.Messages>
        {!session ? (
          <S.Bubble $role="assistant">Sign in to start chatting with support.</S.Bubble>
        ) : session.user.role !== USER_ROLES.customer ? (
          <S.Bubble $role="assistant">Open Admin dashboard to answer customer chats.</S.Bubble>
        ) : isLoading ? (
          <S.Bubble $role="assistant">Loading chat...</S.Bubble>
        ) : (
          messages.map((message) => (
            <S.Bubble key={message.id} $role={message.senderRole === 'customer' ? 'user' : 'assistant'}>
              {message.text}
            </S.Bubble>
          ))
        )}
      </S.Messages>

      <S.Footer>
        <S.QuickActions>
          {QUICK_ACTIONS.map((action) => (
            <S.QuickButton key={action} type="button" data-action={action} onClick={handleQuickActionClick}>
              {action}
            </S.QuickButton>
          ))}
        </S.QuickActions>

        <S.Composer onSubmit={handleSubmit}>
          <S.Input
            value={draft}
            onChange={handleDraftChange}
            placeholder="Write a message..."
            aria-label="Chat message"
            disabled={!session || session.user.role !== USER_ROLES.customer || isSending}
          />
          <S.SendButton
            type="submit"
            disabled={!session || session.user.role !== USER_ROLES.customer || isSending}
          >
            {isSending ? 'Sending...' : 'Send'}
          </S.SendButton>
        </S.Composer>
      </S.Footer>
    </S.Panel>
  );
};
