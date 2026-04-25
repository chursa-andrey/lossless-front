import { NativeModules, Platform } from 'react-native';

const API_PORT = 8080;

type SourceCodeModule = {
  getConstants?: () => {
    scriptURL?: string;
  };
};

function getMetroHost() {
  const sourceCode = NativeModules.SourceCode as SourceCodeModule | undefined;
  const scriptURL = sourceCode?.getConstants?.().scriptURL;

  if (!scriptURL) {
    return null;
  }

  const hostMatch = scriptURL.match(/^https?:\/\/([^/:]+)/);
  return hostMatch?.[1] ?? null;
}

function getDevApiBaseUrl() {
  const metroHost = getMetroHost();

  if (metroHost) {
    return `http://${metroHost}:${API_PORT}`;
  }

  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${API_PORT}`;
  }

  return `http://localhost:${API_PORT}`;
}

export const API_BASE_URL = __DEV__ ? getDevApiBaseUrl() : `https://api.lossless.fm`;
