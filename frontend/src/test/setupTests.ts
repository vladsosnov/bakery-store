import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

if (!window.CSS) {
  Object.defineProperty(window, 'CSS', {
    value: {},
    writable: true
  });
}

if (typeof window.CSS.supports !== 'function') {
  window.CSS.supports = () => false;
}
