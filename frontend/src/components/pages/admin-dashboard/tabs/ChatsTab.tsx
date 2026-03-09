import { useEffect, useMemo, useState, type ChangeEvent, type FC, type FormEvent } from 'react';
import { toast } from 'sonner';

import {
  getModeratorChatThread,
  getModeratorChatThreads,
  postModeratorChatMessage
} from '@src/services/chat-api';
import { subscribeToChatThreadUpdates } from '@src/services/chat-socket';
import type { ChatThread } from '@src/types/chat';
import { toErrorMessage } from '@src/utils/error';
import * as S from '@src/components/pages/admin-dashboard/AdminDashboardPage.styles';
import * as C from './ChatsTab.styles';

export const ChatsTab: FC = () => {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [activeThread, setActiveThread] = useState<ChatThread | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    const loadThreads = async () => {
      setIsLoading(true);
      try {
        const response = await getModeratorChatThreads();
        setThreads(response.data);
        if (response.data.length > 0) {
          setSelectedThreadId(response.data[0].id);
        }
      } catch (error) {
        toast.error(toErrorMessage(error, 'Failed to load chats.'));
      } finally {
        setIsLoading(false);
      }
    };

    loadThreads();
  }, []);

  useEffect(() => {
    if (!selectedThreadId) {
      setActiveThread(null);
      return;
    }

    const loadThread = async () => {
      try {
        const response = await getModeratorChatThread(selectedThreadId);
        setActiveThread(response.data);
        setThreads((prev) => prev.map((thread) => (thread.id === response.data.id ? response.data : thread)));
      } catch (error) {
        toast.error(toErrorMessage(error, 'Failed to load chat thread.'));
      }
    };

    loadThread();
  }, [selectedThreadId]);

  useEffect(() => {
    return subscribeToChatThreadUpdates((thread) => {
      const nextThread =
        thread.id === selectedThreadId
          ? {
              ...thread,
              unreadForSupport: false
            }
          : thread;

      setThreads((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === nextThread.id);
        if (existingIndex === -1) {
          return [nextThread, ...prev];
        }

        const next = [...prev];
        next[existingIndex] = nextThread;
        return next;
      });

      if (nextThread.id === selectedThreadId) {
        setActiveThread(nextThread);
      }
    });
  }, [selectedThreadId]);

  const sortedThreads = useMemo(() => {
    return [...threads].sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  }, [threads]);

  const handleThreadSelect = (threadId: string) => {
    setSelectedThreadId(threadId);
  };

  const handleDraftChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraft(event.target.value);
  };

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = draft.trim();

    if (!selectedThreadId || next === '') {
      return;
    }

    try {
      setIsSending(true);
      const response = await postModeratorChatMessage(selectedThreadId, { text: next });
      setActiveThread(response.data);
      setThreads((prev) =>
        prev.map((thread) => (thread.id === selectedThreadId ? response.data : thread))
      );
      setDraft('');
    } catch (error) {
      toast.error(toErrorMessage(error, 'Failed to send message.'));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <S.Panel>
      <S.BlockTitle>Chats</S.BlockTitle>
      {isLoading ? (
        <S.EmptyText>Loading chats...</S.EmptyText>
      ) : sortedThreads.length === 0 ? (
        <S.EmptyText>No customer chats yet.</S.EmptyText>
      ) : (
        <C.Layout>
          <C.ThreadList>
            {sortedThreads.map((thread) => (
              <C.ThreadItem
                key={thread.id}
                type="button"
                $active={thread.id === selectedThreadId}
                onClick={() => handleThreadSelect(thread.id)}
              >
                <C.ThreadHead>
                  <C.ThreadName>{thread.customerName}</C.ThreadName>
                  {thread.unreadForSupport ? <C.UnreadDot aria-label="Unread messages" /> : null}
                </C.ThreadHead>
                <C.ThreadMeta>{thread.customerEmail}</C.ThreadMeta>
                <C.ThreadMeta>{thread.lastMessageText || 'No messages yet'}</C.ThreadMeta>
              </C.ThreadItem>
            ))}
          </C.ThreadList>

          <C.Conversation>
            <C.ConversationHeader>
              <S.MutedText>
                {activeThread
                  ? `Conversation with ${activeThread.customerName}`
                  : 'Select a customer conversation'}
              </S.MutedText>
            </C.ConversationHeader>

            <C.Messages>
              {activeThread ? (
                activeThread.messages.map((message) => (
                  <C.MessageBubble
                    key={message.id}
                    $fromCustomer={message.senderRole === 'customer' || message.senderRole === 'system'}
                  >
                    {message.text}
                  </C.MessageBubble>
                ))
              ) : (
                <S.EmptyText>No active chat selected.</S.EmptyText>
              )}
            </C.Messages>

            <C.Composer onSubmit={handleSend}>
              <C.Input
                value={draft}
                onChange={handleDraftChange}
                placeholder="Write reply..."
                aria-label="Moderator chat reply"
                disabled={!activeThread || isSending}
              />
              <C.SendButton type="submit" disabled={!activeThread || isSending}>
                {isSending ? 'Sending...' : 'Send'}
              </C.SendButton>
            </C.Composer>
          </C.Conversation>
        </C.Layout>
      )}
    </S.Panel>
  );
};
