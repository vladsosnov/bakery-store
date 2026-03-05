import { useState, type ChangeEvent, type FC, type MouseEvent, type SyntheticEvent } from 'react';

import * as S from './ChatWidget.styles';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: 'assistant',
    text: 'Hey! I can help with cakes, delivery windows, and custom orders.'
  }
];

const QUICK_ACTIONS = ['Delivery info', 'Custom cake', 'Today specials'];

const generateReply = (text: string) => {
  const input = text.toLowerCase();

  if (input.includes('delivery')) {
    return 'Delivery is available from 9:00 to 20:00. Same-day delivery depends on your area.';
  }

  if (input.includes('custom') || input.includes('cake')) {
    return 'Custom cakes need at least 24 hours. Share size, flavor, and design preferences.';
  }

  if (input.includes('special')) {
    return 'Today specials: strawberry shortcake, butter croissant, and sourdough loaf.';
  }

  return 'Thanks! A bakery assistant will follow up soon. Meanwhile, check Shop for available products.';
}

type ChatWidgetProps = {
  onClose: () => void;
};

export const ChatWidget: FC<ChatWidgetProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');

  const pushMessage = (text: string, role: 'user' | 'assistant') => {
    setMessages((prev) => [...prev, { id: prev.length + 1, role, text }]);
  };

  const handleQuickActionClick = (event: MouseEvent<HTMLButtonElement>) => {
    const action = event.currentTarget.dataset.action;

    if (!action) {
      return;
    }

    pushMessage(action, 'user');
    pushMessage(generateReply(action), 'assistant');
  };

  const handleDraftChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraft(event.target.value);
  };

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = draft.trim();

    if (!next) {
      return;
    }

    pushMessage(next, 'user');
    pushMessage(generateReply(next), 'assistant');
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
        {messages.map((message) => (
          <S.Bubble key={message.id} $role={message.role}>
            {message.text}
          </S.Bubble>
        ))}
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
          />
          <S.SendButton type="submit">Send</S.SendButton>
        </S.Composer>
      </S.Footer>
    </S.Panel>
  );
};
