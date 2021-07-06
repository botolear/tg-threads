# Threads Middleware from [BotolTG](https://www.npmjs.com/package/@botol/tg-bot)

## Options
| Name | Type | Default | Description |
|---|---|---|---|
| scriptPath | string | - | Path to script |
| workerCount | number | 3 | (Optional) Workers count |
| execTimeout | number | 0 | (Optional) Max allowed time to process update (Set 0 to unlimit). Throw error on limit |

## Example
```main.ts```
```typescript
import { BotolTg } from '@botol/tg-bot';
import { BotThreads } from '@botol/tg-threads';
import { isMainThread } from 'worker_threads';

let bot = new BotolTg('<token>');
bot.use(async (ctx, next) => {
    if (isMainThread) {
        // Some in main thread before pass update to workers
    } else {
        // Some in worker thread before executing
    }
    await next();
    if (isMainThread) {
        // Some in main thread after pass update to workers
    } else {
        // Some in worker thread after executing
    }
});
bot.middleware(
    BotThreads(bot, {
        scriptPath: __filename,
    }),
);
bot.use((ctx) => {
    ctx.reply('hi');
});
if (isMainThread) {
    bot.startPolling();
}

```
### With ts-node
```index.js```
```js
const path = require('path');

require('ts-node').register({ transpileOnly: true });
require(path.resolve(__dirname, './main.ts'));
```
```main.ts```
```typescript
import { BotolTg } from '@botol/tg-bot';
import { BotThreads } from '@botol/tg-threads';
import { isMainThread } from 'worker_threads';
import path from 'path';

let bot = new BotolTg('<token>');
bot.use(async (ctx, next) => {
    if (isMainThread) {
        // Some in main thread before pass update to workers
    } else {
        // Some in worker thread before executing
    }
    await next();
    if (isMainThread) {
        // Some in main thread after pass update to workers
    } else {
        // Some in worker thread after executing
    }
});
bot.middleware(
    BotThreads(bot, {
        scriptPath: path.resolve(__dirname, './index.js'),
    }),
);
bot.use((ctx) => {
    ctx.reply('hi');
});
if (isMainThread) {
    bot.startPolling();
}

```
```> ts-node index.js```