import config from 'config';
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

import { START_TEXT, LOADER_CAPTION, LOADER_PATH } from "./constants.js";
import {chatRequest, sttConverter} from "./openai.js";
import {removeFile} from './utils.js'
import {ogg} from "./ogg.js";

const bot = new Telegraf(config.get("TELEGRAM_TOKEN"));

bot.start((ctx) => ctx.reply(START_TEXT));

bot.on(message("voice"), async (ctx) => {
    try {
        const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
        const userId = String(ctx.message.from.id)

        const oggPath = await ogg.create(link.href, userId)
        const mp3Path = await ogg.toMp3(oggPath, userId)
        await removeFile(oggPath)
        const text = await sttConverter(mp3Path)
        await removeFile(mp3Path)
        const loader = await ctx.replyWithAnimation({
            source: LOADER_PATH
        }, { caption: `Запрос: ${text}\n${LOADER_CAPTION}` });
        const getText = await chatRequest(text);
        await ctx.deleteMessage(loader.message_id);
        await ctx.reply(getText);
    } catch (e) {
        console.error(`Error while proccessing voice message`, e.message)
    }
});

bot.on(message("text"),  async (ctx) => {
    try {

        const loader = await ctx.replyWithAnimation({
            source: LOADER_PATH
        }, { caption: LOADER_CAPTION });
        const getText = await chatRequest(ctx.message.text);
        await ctx.deleteMessage(loader.message_id);
        await ctx.reply(getText);
    } catch (error) {
        console.log('Error in openAI request', error.message)
    }
})

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
