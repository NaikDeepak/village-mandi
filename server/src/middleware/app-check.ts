import type { FastifyReply, FastifyRequest } from 'fastify';
import * as admin from 'firebase-admin';

export async function verifyAppCheck(request: FastifyRequest, reply: FastifyReply) {
  const appCheckToken = request.headers['x-firebase-appcheck'] as string;
  const isEnforced = process.env.APP_CHECK_ENFORCED === 'true';

  const logContext = {
    ip: request.ip,
    userAgent: request.headers['user-agent'],
    path: request.url,
    method: request.method,
  };

  if (!appCheckToken) {
    request.log.warn(logContext, 'Missing App Check token');
    if (isEnforced) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Missing App Check token',
      });
    }
    return;
  }

  try {
    const appCheckResponse = await admin.appCheck().verifyToken(appCheckToken);
    request.log.info(
      { ...logContext, appId: appCheckResponse.appId },
      'App Check verification successful'
    );
  } catch (err) {
    request.log.error(
      { ...logContext, err: err instanceof Error ? err.message : String(err) },
      'App Check verification failed'
    );

    if (isEnforced) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Invalid App Check token',
      });
    }
  }
}
