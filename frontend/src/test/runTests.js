import { createVitest } from 'vitest/node';

async function run() {
  const vitest = await createVitest('test', { watch: false });
  await vitest.start();
  await vitest.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
