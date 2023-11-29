import express from 'express';
import path from 'path';
import bodyParser from 'body-parser'
import { textToImage } from "./stability.js"
import { completePrompt } from './openAi.js';
import fs from 'fs'

const PORT = process.env.PORT || 3000;

const app = express();


// Have Node serve the files for our built React app
app.use(express.static(path.resolve('./client/build')));

var jsonParser = bodyParser.json()


app.post("/api/stabilityEndpoint",jsonParser, async (req,res) => {
    const imageData = await textToImage(req.body.message);
    res.json({message: imageData})
})

app.post("/api/openAiEndpoint/wipePlayData", (req,res) =>{
  console.log("cleaning playData...")
  const json = {
    initialData : [
      {
        "role": "system",
        "content": "Please abide by the following bullet points at all times:\n- You are outputting text for a visual novel, which is based on the novel Frankenstein, by Mary Shelley.\n- The user should play from the perspective of Victor Frankenstein.\n- For this visual novel, provide a new scenario based on the previous choice made by the user.\n- You should provide interactive, text-based scenes. Do not create images.\n- First, provide a scenario, then provide 2-4 options, and then provide a prompt to create an image for the scenario. This prompt should be surrounded by curly braces. \n- Surround each option with percentage signs.\n- Each scenario should not exceed 50 tokens in length.\n- This visual novel should never end, and should keep providing new scenarios.\n"
      },
      {
        "role": "user",
        "content": "start the novel"
      },
      {
        "role": "assistant",
        "content": "You are Victor Frankenstein, a young scientist obsessed with unlocking the secrets of life itself. After years of tireless experimentation, you have finally created a living being from lifeless body parts. You stand before your creation, unsure of what to do next.\n\nWhat do you do?\n\n%1. Embrace and accept your creation as your own, taking responsibility for its well-being.%\n\n%2. Reject and abandon your creation, overwhelmed with fear and disgust.%\n\n%3. Analyze and study your creation, trying to understand its capabilities and limitations.%\n\n{Create an image of Victor Frankenstein standing before his creation.}"
      },
      {
        "role": "user",
        "content": "3"
      },
      {
        "role": "assistant",
        "content": "You approach your creation with a sense of curiosity and excitement. Your scientific mind compels you to unravel the mysteries that lie within this extraordinary being. You meticulously examine the physical construction of your creation, noting the intricate details of each body part you brought to life.\n\nAs you delve deeper into your analysis, you start to understand the immense potential and power this creature possesses. It becomes clear to you that you have created something beyond your wildest imagination. A mix of fear and fascination takes hold of your heart. \n\nWhat do you do next?\n\n%1. Conduct experiments to test the limits of your creation's strength and endurance.%\n\n%2. Engage in dialogue with your creation, attempting to understand its thoughts and feelings.%\n\n%3. Document your findings and research, hoping to share your amazing discovery with the world.%\n\n%4. Retreat from your laboratory and take a moment to reflect on the implications of your creation.%\n\n{Create an image of Victor Frankenstein examining his creation with awe and curiosity.}"
      }
    ],
    playData : []
  }
  fs.writeFileSync('messageData.json',JSON.stringify(json,null,2))
})

app.post("/api/openAiEndpoint",jsonParser, async (req,res) => {
    const data = await completePrompt(req.body.message);
    var imageRegex = /{([^}]*)}/gm;
    var choiceRegex = /%.*%/gm;

    var imagePrompt = data.match(imageRegex);
    if(imagePrompt) imagePrompt = imagePrompt[0];
    else{ 
      console.log("using default prompt")
      imagePrompt = "A scary picture of frankenstein's creature"
    }
    var choiceArray = data.match(choiceRegex);

    if(choiceArray == null){ 
      console.log("null choices")
      console.log("using default choice")
      choiceArray = [];
      choiceArray.push("There was an error. Click this button.")
    }

    for(var i=0; i<choiceArray.length; i++){
        choiceArray[i] = choiceArray[i].slice(1,-1);
    }

    var fullScenario = data.replace(imageRegex,"");
    fullScenario = fullScenario.replace(choiceRegex,"");
    fullScenario = fullScenario.replace(/\n/g, "");

    var scenarioArray = fullScenario.split(".");
    for(let i=0; i<scenarioArray.length;i++){
      scenarioArray[i] = scenarioArray[i] + ".";
    }
    var jsonMessage = {
        scenarioArray: scenarioArray,
        choiceArray: choiceArray,
        imagePrompt: imagePrompt
    }
    res.json(jsonMessage)
})

// Handle GET requests to /api route
app.get("/api", (req, res) => {
  res.json({ message: "Hello Beautiful World!" });
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve('./client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
