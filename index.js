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
        "content": "- You are outputting text for a visual novel based on the novel Frankenstein by Mary Shelley.\n- The user should play from the perspective of Victor Frankenstein.\n- This visual novel should never end and keep providing new scenarios.\n- Output everything as json. \n- Follow these steps, in order, to create a response:\n1. Provide a scenario. The scenario should be two paragraphs long. Map this to the variable scenario\n2. Provide 2-4 options. Map this to an array called options.\n3. Provide an image prompt that uses many adjectives to describe the scenario. Map this to the variable prompt.\n"
      }
    ],
    playData : []
  }
  fs.writeFileSync('messageData.json',JSON.stringify(json,null,2))
})

app.post("/api/openAiEndpoint",jsonParser, async (req,res) => {
    const data = await completePrompt(req.body.message);

    const jsonResponse = JSON.parse(data);

    var imagePrompt = jsonResponse.prompt;
    if(imagePrompt == null){ 
      console.log("using default prompt")
      imagePrompt = "A scary picture of frankenstein's creature"
    }
    var choiceArray = jsonResponse.options;

    if(choiceArray == null){ 
      console.log("null choices")
      console.log("using default choice")
      choiceArray = [];
      choiceArray.push("There was an error. Click this button.")
    }

    var fullScenario = jsonResponse.scenario;

    var scenarioArray = fullScenario.split(".");    
    if(scenarioArray[-1] == null || scenarioArray[-1].length() == 0) scenarioArray.pop();
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
