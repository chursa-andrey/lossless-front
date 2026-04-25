/* eslint-disable @typescript-eslint/no-require-imports */

jest.mock('react-native-keychain', () => ({
  getGenericPassword: jest.fn(),
  setGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
}));

jest.mock('react-native-reanimated', () => {
  const { Text, View } = require('react-native');

  const animated = {
    Text,
    View,
    createAnimatedComponent: (component: unknown) => component,
  };
  const passthroughAnimation = (value: unknown, _config?: unknown, callback?: (finished: boolean) => void) => {
    callback?.(true);
    return value;
  };
  const chainableEntering = {
    delay: () => chainableEntering,
    damping: () => chainableEntering,
    duration: () => chainableEntering,
    easing: () => chainableEntering,
    mass: () => chainableEntering,
    springify: () => chainableEntering,
    stiffness: () => chainableEntering,
  };
  const easing = () => 0;

  return {
    __esModule: true,
    default: animated,
    ...animated,
    FadeIn: chainableEntering,
    ZoomIn: chainableEntering,
    cancelAnimation: jest.fn(),
    runOnJS: (fn: (...args: unknown[]) => unknown) => fn,
    useSharedValue: (value: unknown) => ({ value }),
    useAnimatedStyle: (factory: () => unknown) => factory(),
    withTiming: passthroughAnimation,
    withDelay: (_delay: number, value: unknown) => value,
    withRepeat: (value: unknown) => value,
    withSequence: (...values: unknown[]) => values[values.length - 1],
    Easing: {
      linear: easing,
      cubic: easing,
      quad: easing,
      in: () => easing,
      out: () => easing,
      inOut: () => easing,
    },
  };
});

jest.mock('react-native-vector-icons/Ionicons', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock(
  '@react-native-vector-icons/material-design-icons',
  () => ({
    __esModule: true,
    default: () => null,
  }),
  { virtual: true },
);

jest.mock('@react-navigation/native', () => {
  const React = require('react');

  return {
    NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
    useFocusEffect: (callback: () => void | (() => void)) => {
      React.useEffect(() => callback(), [callback]);
    },
  };
});

jest.mock('@react-navigation/native-stack', () => {
  const React = require('react');

  return {
    createNativeStackNavigator: () => ({
      Navigator: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
      Screen: ({ component: Component }: { component: React.ComponentType }) =>
        Component ? React.createElement(Component) : null,
    }),
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  const frame = { x: 0, y: 0, width: 390, height: 844 };

  return {
    SafeAreaInsetsContext: React.createContext(insets),
    SafeAreaFrameContext: React.createContext(frame),
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
    initialWindowMetrics: { frame, insets },
    useSafeAreaFrame: () => frame,
    useSafeAreaInsets: () => insets,
  };
});

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(),
    signIn: jest.fn(),
    getTokens: jest.fn(),
  },
  statusCodes: {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
  },
}));

jest.mock('@invertase/react-native-apple-authentication', () => ({
  __esModule: true,
  default: {
    performRequest: jest.fn(),
    Operation: { LOGIN: 1 },
    Scope: { FULL_NAME: 0, EMAIL: 1 },
    Error: { CANCELED: '1001' },
  },
  appleAuthAndroid: {
    isSupported: false,
    configure: jest.fn(),
    signIn: jest.fn(),
    ResponseType: { ALL: 'ALL' },
    Scope: { ALL: 'ALL' },
    Error: { SIGNIN_CANCELLED: 'SIGNIN_CANCELLED' },
  },
}));

jest.mock('react-native-fbsdk-next', () => ({
  AccessToken: {
    getCurrentAccessToken: jest.fn(),
  },
  LoginManager: {
    logInWithPermissions: jest.fn(),
  },
  Settings: {
    setAppID: jest.fn(),
    setClientToken: jest.fn(),
    initializeSDK: jest.fn(),
  },
}));
