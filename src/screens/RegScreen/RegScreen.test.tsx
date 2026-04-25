/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-shadow */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { ApiClientError } from '@/features/auth/api/apiClient';
import { getSocialAuthInput } from '@/features/auth/api/socialAuthProvider';
import RegScreen from '@/screens/RegScreen/RegScreen';

const mockContinueWithEmail = jest.fn();
const mockSocialLogin = jest.fn();

jest.mock('@/features/auth/store/authStore', () => ({
  useAuthStore: (
    selector: (state: {
      continueWithEmail: typeof mockContinueWithEmail;
      socialLogin: typeof mockSocialLogin;
    }) => unknown,
  ) =>
    selector({
      continueWithEmail: mockContinueWithEmail,
      socialLogin: mockSocialLogin,
    }),
}));

jest.mock('@/features/auth/api/socialAuthProvider', () => ({
  getSocialAuthInput: jest.fn(),
  SocialAuthProviderError: class SocialAuthProviderError extends Error {
    code: string;

    constructor(code: string, message: string) {
      super(message);
      this.name = 'SocialAuthProviderError';
      this.code = code;
    }
  },
}));

jest.mock('@/hooks/animations', () => ({
  useZoomAndFadeIn: () => ({
    start: jest.fn(),
    reset: jest.fn(),
    style: {},
  }),
}));

jest.mock('@/components/DefaultButton/DefaultButton', () => ({
  DefaultButton: (props: {
    label: string;
    onPress?: () => void;
    disabled?: boolean;
    loading?: boolean;
  }) => {
    const React = require('react');
    const { Pressable, Text } = require('react-native');
    const { label, onPress, disabled, loading } = props;

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !!disabled, busy: !!loading }}
        onPress={disabled ? undefined : onPress}
        testID={`button:${label}`}
      >
        <Text>{label}</Text>
      </Pressable>
    );
  },
}));

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { Text, TextInput, View } = require('react-native');

  const PaperTextInput = React.forwardRef(
    (
      {
        label,
        value,
        onChangeText,
        onBlur,
        onSubmitEditing,
        disabled,
      }: {
        label: string;
        value: string;
        onChangeText: (value: string) => void;
        onBlur?: () => void;
        onSubmitEditing?: () => void;
        disabled?: boolean;
      },
      ref: React.Ref<unknown>,
    ) => (
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        editable={!disabled}
        value={value}
        onBlur={onBlur}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
      />
    ),
  );
  PaperTextInput.Icon = () => null;

  return {
    useTheme: () => ({
      roundness: 10,
      custom: {
        spacing: {
          screenPadding: 16,
          inputHeight: 48,
          xs: 8,
        },
        typography: {
          input: { fontSize: 16 },
          helperText: { fontSize: 12, lineHeight: 16 },
          infoText: { fontSize: 12, lineHeight: 16 },
        },
        colors: {
          success: '#0a7',
        },
      },
    }),
    HelperText: ({ children, visible }: { children: React.ReactNode; visible?: boolean }) =>
      visible === false ? null : <Text>{children}</Text>,
    Card: {
      Content: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
    },
    TextInput: PaperTextInput,
    Divider: () => <View />,
  };
});

function findInput(renderer: ReactTestRenderer.ReactTestRenderer, label: string) {
  return renderer.root.findByProps({ accessibilityLabel: label });
}

function findButton(renderer: ReactTestRenderer.ReactTestRenderer, label: string) {
  return renderer.root.findByProps({ testID: `button:${label}` });
}

async function fillEmailForm(renderer: ReactTestRenderer.ReactTestRenderer) {
  await ReactTestRenderer.act(async () => {
    findInput(renderer, 'Email').props.onChangeText('user@example.com');
    findInput(renderer, 'Password').props.onChangeText('Passw0rd!');
  });
}

describe('RegScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockContinueWithEmail.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      displayName: 'User',
      roles: ['USER'],
      createdAt: '2026-01-01T00:00:00Z',
    });
    mockSocialLogin.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      displayName: 'User',
      roles: ['USER'],
      createdAt: '2026-01-01T00:00:00Z',
    });
    jest.mocked(getSocialAuthInput).mockResolvedValue({
      provider: 'google',
      providerToken: 'google-token',
    });
  });

  it('submits email flow and delegates success to auth store', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<RegScreen />);
    });

    await fillEmailForm(renderer!);
    await ReactTestRenderer.act(async () => {
      findButton(renderer!, 'Продолжить с Email').props.onPress();
    });

    expect(mockContinueWithEmail).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'Passw0rd!',
    });
  });

  it('renders readable email error from backend response', async () => {
    mockContinueWithEmail.mockRejectedValue(
      new ApiClientError(
        {
          status: 401,
          code: 'INVALID_CREDENTIALS',
          error: 'Unauthorized',
        },
        'Unauthorized',
      ),
    );
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<RegScreen />);
    });

    await fillEmailForm(renderer!);
    await ReactTestRenderer.act(async () => {
      findButton(renderer!, 'Продолжить с Email').props.onPress();
    });

    expect(renderer!.root.findByProps({ children: 'Неверный email или пароль.' })).toBeTruthy();
  });

  it('shows social loading state and disables auth buttons while provider flow is pending', async () => {
    let resolveProvider: () => void;
    jest.mocked(getSocialAuthInput).mockReturnValue(
      new Promise(resolve => {
        resolveProvider = () =>
          resolve({
            provider: 'google',
            providerToken: 'google-token',
          });
      }),
    );
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<RegScreen />);
    });

    ReactTestRenderer.act(() => {
      findButton(renderer!, 'Войти с Google').props.onPress();
    });

    expect(findButton(renderer!, 'Войти с Google').props.accessibilityState).toMatchObject({
      disabled: true,
      busy: true,
    });
    expect(findButton(renderer!, 'Продолжить с Email').props.accessibilityState).toMatchObject({
      disabled: true,
    });
    expect(findButton(renderer!, 'Войти с Apple').props.accessibilityState).toMatchObject({
      disabled: true,
    });

    await ReactTestRenderer.act(async () => {
      resolveProvider!();
    });

    expect(mockSocialLogin).toHaveBeenCalledWith({
      provider: 'google',
      providerToken: 'google-token',
    });
  });
});
