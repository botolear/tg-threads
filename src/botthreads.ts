import { Handler } from '@botol/dipo';
import { BotolTg, Update } from '@botol/tg-bot';
import { ContextTG } from '@botol/tg-dipo';
import { isMainThread } from 'worker_threads';
import { WPoll, WWorker } from 'wpoll';

export interface BotThreadsOptions {
    scriptPath: string;
    workerCount?: number;
    execTimeout?: number;
}

export function BotThreads(
    bot: BotolTg,
    options: BotThreadsOptions,
): Handler<ContextTG> {
    let wpoll: WPoll<Update>;

    if (isMainThread) {
        wpoll = new WPoll(options.scriptPath, {
            WPollNodeCount: options.workerCount,
            execTimeout: options.execTimeout,
            recreateOnTimeout: true,
        });
        wpoll.init();
    } else {
        new WWorker<Update>((update) => {
            return bot.handle(new ContextTG(update, bot['client']));
        });
    }
    return (ctx, next) => {
        if (isMainThread) {
            return wpoll.exec(ctx.update);
        }
        return next();
    };
}
