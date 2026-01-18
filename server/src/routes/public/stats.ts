import { FastifyInstance } from 'fastify';
import { getLandingPageStats } from '../../services/stats-service';

export async function publicStatsRoutes(fastify: FastifyInstance) {
    fastify.get('/stats', async (request, reply) => {
        try {
            const stats = await getLandingPageStats();
            return reply.send(stats);
        } catch (error) {
            request.log.error(error, 'Failed to fetch public stats');
            return reply.status(500).send({ error: 'Internal Server Error' });
        }
    });
}
