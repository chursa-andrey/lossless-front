import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { AppBootstrap } from '@/features/auth/components/AppBootstrap';

const mockRestoreSession = jest.fn();

jest.mock('@/features/auth/store/authStore', () => ({
  useAuthStore: (selector: (state: { restoreSession: typeof mockRestoreSession }) => unknown) =>
    selector({ restoreSession: mockRestoreSession }),
}));

describe('AppBootstrap', () => {
  beforeEach(() => {
    mockRestoreSession.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls restoreSession once on mount', async () => {
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(<AppBootstrap />);
    });

    expect(mockRestoreSession).toHaveBeenCalledTimes(1);
  });
});
