import OpenAI from "openai";
import fs from "fs"

export const completePrompt = async (prompt) =>{
    const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
    });
    const storedMessages = JSON.parse(fs.readFileSync("./messageData.json","utf-8"))
    console.log("Beginning text generation")
    storedMessages.push({
        "role": "user",
        "content": prompt
      })

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: storedMessages,
        temperature: 1,
        max_tokens: 300,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 1,
    });

    storedMessages.push(response.choices[0].message);
    fs.writeFileSync('messageData.json',JSON.stringify(storedMessages,null,2))

    return response.choices[0].message.content;
}
