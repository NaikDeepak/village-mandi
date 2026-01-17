import { initializeApp } from 'firebase/app';
import { ReCaptchaV3Provider, initializeAppCheck } from 'firebase/app-check';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize App Check
// Note: In development, you can use a debug token by setting:
// self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
// before initializing App Check.
// Initialize App Check
// Note: In development, you can use a debug token by setting:
// self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
// before initializing App Check.
export let appCheck: any = null;

if (import.meta.env.VITE_RECAPTCHA_SITE_KEY) {
  try {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (err) {
    console.warn('Failed to initialize App Check:', err);
  }
} else {
  console.warn('VITE_RECAPTCHA_SITE_KEY not found. App Check disabled.');
}
