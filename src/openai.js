import {Configuration, OpenAIApi} from "openai";
import config from "config";
import { createReadStream } from "fs";

const configuration = new Configuration({
    apiKey: config.get("OPENAI_TOKEN"),
});

const openai = new OpenAIApi(configuration);

export const chatRequest = async (message) => {
    return await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: message },
        ],
    })
    .then((response) => response.data.choices[0].message.content)
    .catch((error) => error.message)
}

export const sttConverter = async (mp3FilePath) => {
    try {
        const response = await openai.createTranscription(
            createReadStream(mp3FilePath),
            'whisper-1'
        )
        return response.data.text
    } catch (e) {
        console.error(`Error while transcription: ${e.message}`)
    }
}