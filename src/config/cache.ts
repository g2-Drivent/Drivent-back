import { createClient } from 'redis';

const client = createClient();

(async () => {
  client.on('error', () => {
    console.log('redis error');
  });

  await client.connect();
})();

export { client as redis };
