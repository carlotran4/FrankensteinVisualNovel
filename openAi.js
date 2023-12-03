import OpenAI from "openai";
import fs from "fs"

export const completePrompt = async (prompt) =>{
    const openai = new OpenAI({
        apiKey: process.env.OPEN_AI_KEY,
        timeout: 45000
    });
    const json = JSON.parse(fs.readFileSync("./messageData.json","utf-8"))
    var storedMessages;
    if(!json.playData.length == 0){
        storedMessages = json.playData.slice();
    }
    else storedMessages = json.initialData.slice();

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
        max_tokens: 512,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 1
    }); }
    catch(e){
        console.log(e)
        return '{"scenario":"Error. Please Reload","options":["Please Reload"],"prompt":"TV Static"}'
    }

    storedMessages.push(response.choices[0].message);
    storedMessages = storedMessages.slice(-2);
    storedMessages.unshift({
        "role": "system",
        "content": "- You are outputting text for a visual novel based on the novel Frankenstein by Mary Shelley.\n- The user should play from the perspective of Victor Frankenstein.\n- This visual novel should never end and keep providing new scenarios.\n- Output everything as json. \n- Follow these steps, in order, to create a response:\n1. Provide a scenario. The scenario should be two paragraphs long. Map this to the variable scenario\n2. Provide 2-4 options. Map this to an array called options.\n3. Provide an image prompt that uses many adjectives to describe the scenario. Map this to the variable prompt.\n"
      });

    const jsonToWrite = {
        initialData: {
            "role": "system",
            "content": "- You are outputting text for a visual novel based on the novel Frankenstein by Mary Shelley.\n- The user should play from the perspective of Victor Frankenstein.\n- This visual novel should never end and keep providing new scenarios.\n- Output everything as json. \n- Follow these steps, in order, to create a response:\n1. Provide a scenario. The scenario should be two paragraphs long. Map this to the variable scenario\n2. Provide 2-4 options. Map this to an array called options.\n3. Provide an image prompt that uses many adjectives to describe the scenario. Map this to the variable prompt.\n"
          },
        playData: storedMessages
    }

    fs.writeFileSync('messageData.json',JSON.stringify(jsonToWrite,null,2))

    return response.choices[0].message.content;
}
