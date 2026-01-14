import { FastifyReply, FastifyRequest } from 'fastify';

// Authenticate any logged-in user
export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.status(401).send({ error: 'Unauthorized', message: 'Invalid or expired token' });
    }
}

// Require ADMIN role
export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify();
        if (request.user.role !== 'ADMIN') {
            reply.status(403).send({ error: 'Forbidden', message: 'Admin access required' });
        }
    } catch (err) {
        reply.status(401).send({ error: 'Unauthorized', message: 'Invalid or expired token' });
    }
}

// Require BUYER role
export async function requireBuyer(request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify();
        if (request.user.role !== 'BUYER') {
            reply.status(403).send({ error: 'Forbidden', message: 'Buyer access required' });
        }
    } catch (err) {
        reply.status(401).send({ error: 'Unauthorized', message: 'Invalid or expired token' });
    }
}
