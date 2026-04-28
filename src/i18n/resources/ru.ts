export const ru = {
  translation: {
    auth: {
      bootstrap: {
        title: 'Восстанавливаем сессию',
        subtitle: 'Проверяем сохранённый вход и обновляем токены.',
      },
      errors: {
        continueGeneric: 'Не удалось продолжить. Попробуйте ещё раз.',
        network: 'Не удалось связаться с сервером. Проверьте подключение и попробуйте ещё раз.',
        invalidCredentials: 'Неверный email или пароль.',
        passwordLoginNotAvailable:
          'Для этого аккаунта вход по паролю недоступен. Используйте вход через соцсети.',
        invalidAuthPayload:
          'Проверьте email и пароль. Возможно, данные не соответствуют требованиям.',
        socialGeneric: 'Не удалось войти через соцсеть. Попробуйте ещё раз.',
        socialCancelled: 'Вход через соцсеть отменён.',
        socialNotConfigured: 'Вход через эту соцсеть пока не настроен.',
        socialUnavailable: 'Вход через эту соцсеть недоступен на этом устройстве.',
        socialTokenMissing: 'Не удалось получить токен провайдера. Попробуйте ещё раз.',
        invalidSocialToken: 'Токен соцсети не прошёл проверку. Попробуйте войти ещё раз.',
        socialEmailRequired:
          'Провайдер не передал email. Разрешите доступ к email и попробуйте ещё раз.',
        socialEmailNotVerified:
          'Email не подтверждён провайдером, поэтому мы не можем безопасно связать аккаунт.',
        socialMisconfigured: 'Вход через эту соцсеть пока не настроен на сервере.',
      },
      reg: {
        fields: {
          email: 'Email',
          password: 'Password',
        },
        buttons: {
          continueWithEmail: 'Продолжить с Email',
          loginWithGoogle: 'Войти с Google',
          loginWithApple: 'Войти с Apple',
          loginWithFacebook: 'Войти с Facebook',
        },
        info: {
          unifiedFlow: 'Аккаунт существует — войдём. \nЕсли нет — создадим новый.',
        },
        validation: {
          emailRequired: 'Введите email',
          emailMax: 'Email должен содержать не больше 320 символов',
          emailInvalid: 'Введите валидный email',
          passwordRequired: 'Введите пароль',
          passwordMin: 'Пароль должен содержать минимум 8 символов',
          passwordMax: 'Пароль должен содержать не больше 128 символов',
        },
      },
      actions: {
        logout: 'Выйти',
      },
    },
    home: {
      title: 'Сессия активна',
      subtitleLoggedIn: 'Вы вошли как {{displayName}} ({{email}})',
      subtitleFallback: 'Пользователь загружен.',
      cardTitle: 'Карточка {{index}}',
      cardDescription: 'Временный контент для центральной области. Позже здесь появятся реальные данные.',
      actions: {
        logout: 'Выйти',
      },
      menu: {
        home: 'Главное меню',
        search: 'Поиск',
        notifications: 'Уведомления',
        library: 'Библиотека',
        favorites: 'Избранное',
        profile: 'Профиль',
      },
    },
    profile: {
      title: 'Профиль',
      subtitleLoggedIn: 'Вы вошли как {{displayName}} ({{email}})',
      subtitleFallback: 'Пользователь загружен.',
      sections: {
        account: 'Аккаунт',
        session: 'Сессия',
      },
      sessionDescription: 'Управление текущей сессией аккаунта.',
    },
    start: {
      dialog: {
        first: 'Привет мой пучеглазый друг!',
        second: 'Упс, не то! :)',
        third: 'Приветствую тебя многоуважаемый меломан!',
        fourth: 'Меня зовут Lossless. Я местное божество :)',
        fifth: 'Добро пожаловать в мой скромный храм качественной музыки!',
      },
      buttons: {
        register: 'Регистрация',
        dismiss: 'Ой, иди в ..опу!',
      },
    },
  },
} as const;
