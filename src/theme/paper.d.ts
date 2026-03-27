import type { AppTheme } from './index';

declare global {
  namespace ReactNativePaper {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Theme extends AppTheme {}
  }
}

export {};
