const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();
const api = require('covid19-api');
const bot = new Telegraf(process.env.BOT_TOKEN);
const COUNTRIES_LIST = require('./constants');

bot.start((ctx) => ctx.reply(`
Привет ${ctx.message.from.first_name}
Тут ты можешь узнать статистку по корона вирусу
Просто введи название страны на англиском
Весь список стран можно посмотреть командой /help
`,      Markup.keyboard([
            ['Russia', 'US'],
            ['United-arab-emirates', 'Monaco']
        ])
        .resize()
    )
);

bot.help((ctx) => ctx.reply(COUNTRIES_LIST))

bot.on('text', async (ctx) => {
    let data = {};

    try {
    data = await api.getReportsByCountries(ctx.message.text);
    let formatData = `
${data[0][0].flag}
Страна: ${data[0][0].country}
Случаи: ${data[0][0].cases}
Смертей: ${data[0][0].deaths}
Вылечелись: ${data[0][0].recovered}
    `
    ctx.reply(formatData);  
    } catch {
        console.log('Ошибка');
        ctx.reply('👾Ошибка! Такой страны несуществует');
    }
});

bot.launch();