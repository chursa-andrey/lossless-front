import * as Keychain from 'react-native-keychain';

const REFRESH_TOKEN_SERVICE = 'lossless.auth.refresh-token';
const REFRESH_TOKEN_USERNAME = 'refresh-token';

export const tokenStorage = {
  async getRefreshToken() {
    const credentials = await Keychain.getGenericPassword({
      service: REFRESH_TOKEN_SERVICE,
    });

    if (!credentials) {
      return null;
    }

    return credentials.password;
  },

  async setRefreshToken(refreshToken: string) {
    await Keychain.setGenericPassword(REFRESH_TOKEN_USERNAME, refreshToken, {
      service: REFRESH_TOKEN_SERVICE,
    });
  },

  async clearRefreshToken() {
    await Keychain.resetGenericPassword({
      service: REFRESH_TOKEN_SERVICE,
    });
  },
};
