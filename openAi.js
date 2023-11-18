import OpenAI from "openai";
import fs from "fs"

export const completePrompt = async (prompt) =>{
    const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
    });
    const json = JSON.parse(fs.readFileSync("./messageData.json","utf-8"))
    var storedMessages;
    if(!json.playData.length == 0){
        storedMessages = json.playData;
        storedMessages.unshift(json.initialData[0]);
    }
    else storedMessages = json.initialData;

    console.log("Beginning text generation")
    storedMessages.push({
        "role": "user",
        "content": prompt
      })

    var response;
    try { response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: storedMessages,
        temperature: 1,
        max_tokens: 300,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 1,
    }); }
    catch(e){
        console.log(e)
        return "Sorry, there was an error. Please reload. %1.Sorry, there was an error. Please reload.% %2.Sorry, there was an error. Please reload.% {please reload}"
    }

    storedMessages.push(response.choices[0].message);
    storedMessages = storedMessages.slice(-2);
    storedMessages.unshift(json.initialData[0]);

    const jsonToWrite = {
        initialData: json.initialData,
        playData: storedMessages
    }

    fs.writeFileSync('messageData.json',JSON.stringify(jsonToWrite,null,2))

    return response.choices[0].message.content;
}
