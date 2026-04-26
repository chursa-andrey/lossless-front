export const en = {
  translation: {
    auth: {
      bootstrap: {
        title: 'Restoring session',
        subtitle: 'Checking the saved sign-in and refreshing tokens.',
      },
      errors: {
        continueGeneric: 'Could not continue. Please try again.',
        network: 'Could not reach the server. Check your connection and try again.',
        invalidCredentials: 'Invalid email or password.',
        passwordLoginNotAvailable:
          'Password login is not available for this account. Use social sign-in instead.',
        invalidAuthPayload: 'Check your email and password. The data may not meet the requirements.',
        socialGeneric: 'Could not sign in with social account. Please try again.',
        socialCancelled: 'Social sign-in was cancelled.',
        socialNotConfigured: 'This social sign-in method is not configured yet.',
        socialUnavailable: 'This social sign-in method is not available on this device.',
        socialTokenMissing: 'Could not get a provider token. Please try again.',
        invalidSocialToken: 'The social token could not be verified. Please try again.',
        socialEmailRequired: 'The provider did not return an email. Allow email access and try again.',
        socialEmailNotVerified:
          'The provider email is not verified, so we cannot safely link the account.',
        socialMisconfigured: 'This social sign-in method is not configured on the server yet.',
      },
      reg: {
        fields: {
          email: 'Email',
          password: 'Password',
        },
        buttons: {
          continueWithEmail: 'Continue with Email',
          loginWithGoogle: 'Continue with Google',
          loginWithApple: 'Continue with Apple',
          loginWithFacebook: 'Continue with Facebook',
        },
        info: {
          unifiedFlow: 'If the account exists, we will sign you in. \nIf not, we will create a new one.',
        },
        validation: {
          emailRequired: 'Enter your email',
          emailMax: 'Email must be no longer than 320 characters',
          emailInvalid: 'Enter a valid email',
          passwordRequired: 'Enter your password',
          passwordMin: 'Password must contain at least 8 characters',
          passwordMax: 'Password must be no longer than 128 characters',
        },
      },
      actions: {
        logout: 'Log out',
      },
    },
    home: {
      title: 'Session active',
      subtitleLoggedIn: 'You are signed in as {{displayName}} ({{email}})',
      subtitleFallback: 'User is loaded.',
    },
    start: {
      dialog: {
        first: 'Hello, my googly-eyed friend!',
        second: 'Oops, not that! :)',
        third: 'Greetings to you, dear music lover!',
        fourth: 'My name is Lossless. I am the local deity :)',
        fifth: 'Welcome to my humble temple of high-quality music!',
      },
      buttons: {
        register: 'Register',
        dismiss: 'Oh, get lost!',
      },
    },
  },
} as const;
