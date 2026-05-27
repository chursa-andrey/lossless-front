package fm.lossless.mobile

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule

class LosslessConfigModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "LosslessConfig"

  override fun getConstants(): MutableMap<String, Any> =
      mutableMapOf(
          "apiBaseUrl" to BuildConfig.LOSSLESS_API_BASE_URL,
          "googleWebClientId" to BuildConfig.LOSSLESS_GOOGLE_WEB_CLIENT_ID,
          "facebookAppId" to BuildConfig.LOSSLESS_FACEBOOK_APP_ID,
          "facebookClientToken" to BuildConfig.LOSSLESS_FACEBOOK_CLIENT_TOKEN,
          "appleAndroidClientId" to BuildConfig.LOSSLESS_APPLE_ANDROID_CLIENT_ID,
          "appleAndroidRedirectUri" to BuildConfig.LOSSLESS_APPLE_ANDROID_REDIRECT_URI,
      )
}
