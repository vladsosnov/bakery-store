import { StrictMode } from 'react';

const renderMock = jest.fn();
const createRootMock = jest.fn(() => ({
  render: renderMock
}));

jest.mock('react-dom/client', () => ({
  createRoot: createRootMock
}));

jest.mock('./app/App', () => ({
  App: () => <div>App</div>
}));

jest.mock('./styles/global.css', () => ({}));

describe('main bootstrap', () => {
  beforeEach(() => {
    jest.resetModules();
    createRootMock.mockClear();
    renderMock.mockClear();
    document.body.innerHTML = '';
  });

  it('creates root and renders app in StrictMode', async () => {
    document.body.innerHTML = '<div id="root"></div>';

    await import('./main');

    const rootElement = document.getElementById('root');
    expect(createRootMock).toHaveBeenCalledWith(rootElement);
    expect(renderMock).toHaveBeenCalledTimes(1);

    const renderedTree = renderMock.mock.calls[0][0] as { type: unknown; props?: { children?: unknown } };
    expect(renderedTree.type).toBe(StrictMode);
    expect(renderedTree.props?.children).toBeTruthy();
  });

  it('throws when root element is missing', async () => {
    await expect(import('./main')).rejects.toThrow('Root element not found');
  });
});
