import dotenv from 'dotenv';
import Telegraf, { Middleware, Context, ContextMessageUpdate } from 'telegraf';
import RedisSession from 'telegraf-session-redis';

dotenv.config();

interface ContextMessageUpdateWithSession extends ContextMessageUpdate {
  session: {
    counter?: 0;
  };
}

const bot: Telegraf<ContextMessageUpdateWithSession> = new Telegraf(
  process.env.BOT_TOKEN,
);

const session = new RedisSession({
  store: {
    host: 'redis',
    port: 6379,
  },
});

bot.use(session.middleware);

bot.on('text', ctx => {
  ctx.session.counter = ctx.session.counter || 0;
  ctx.session.counter++;
  console.log('Session', ctx.session);
  ctx.reply(`${ctx.session.counter}`);
});

bot.help(ctx => ctx.reply('Eu tô aqui!!!'));
console.log('Bot Iniciado');
bot.launch();
