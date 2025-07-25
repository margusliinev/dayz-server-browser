import Fastify from 'fastify';

const fastify = Fastify({
    logger: true,
});

fastify.get('/', async (_request, reply) => {
    reply.send({ hello: 'world' });
});

const start = async () => {
    try {
        await fastify.listen({ port: Number(process.env.PORT) || 3000 });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
