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
      const serviceAccount = JSON.parse(serviceAccountJson);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      fastify.log.info('Firebase Admin initialized successfully');
    } catch (error) {
      fastify.log.error({ err: error }, 'Failed to initialize Firebase Admin');
      throw error;
    }
  }

  fastify.decorate('firebase', admin.app());
};

export default fp(firebasePlugin, {
  name: 'firebase',
});
