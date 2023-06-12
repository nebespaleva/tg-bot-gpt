import path from "path";
import {fileURLToPath} from "url";

export const _dirname = path.dirname(fileURLToPath(import.meta.url));
export const LOADER_PATH = path.join(_dirname, '..', 'assets', 'loader.gif');

export const VOICES_PATH = path.join(_dirname, '..', 'voices');
export const LOADER_CAPTION = 'Ушел за ответом, скоро вернусь!'
export const START_TEXT = "Этот бот работает на базе популярного ChatGPT. Запрос можно отправить как в текстовом виде так и в формате голосового сообщения. Приятного пользования!"
