import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import * as admin from 'firebase-admin';

declare module 'fastify' {
  interface FastifyInstance {
    firebase: admin.app.App;
  }
}

const firebasePlugin: FastifyPluginAsync = async (fastify) => {
  if (admin.apps.length === 0) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

    if (!serviceAccountJson) {
      fastify.log.warn('FIREBASE_SERVICE_ACCOUNT_JSON not found. Firebase Admin not initialized.');
      return;
    }

    try {
      // Clean up common copy-paste errors in Vercel env vars
      // 1. Remove wrapping quotes if present
      let cleanJson = serviceAccountJson.trim();
      if (cleanJson.startsWith('"') && cleanJson.endsWith('"')) {
        cleanJson = cleanJson.slice(1, -1);
      }
      // 2. Remove all control characters (newlines, returns) that might break JSON.parse
      // Note: We presume 'private_key' uses escaped \n (\\n), which are maintained.
      // Real newlines in the structure are removed.
      cleanJson = cleanJson.replace(/[\n\r\t]/g, ' ');

      const serviceAccount = JSON.parse(cleanJson);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      fastify.log.info('Firebase Admin initialized successfully');
    } catch (error) {
      fastify.log.error({ err: error }, 'Failed to initialize Firebase Admin');
      // Do not throw, allowing server to start.
      // But we must handle the case where firebase is missing in routes.
    }
  }

  // If initialized, decorate.
  if (admin.apps.length > 0) {
    fastify.decorate('firebase', admin.app());
  } else {
    // Decorate with a dummy that throws to alert dev/admin at runtime
    fastify.decorate('firebase', {
      auth: () => {
        throw new Error('Firebase Admin not initialized');
      },
    } as any);
  }
};

export default fp(firebasePlugin, {
  name: 'firebase',
});
