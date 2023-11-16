import express from 'express';
import path from 'path';
import bodyParser from 'body-parser'
import { textToImage } from "./stability.js"
import { completePrompt } from './openAi.js';

const PORT = process.env.PORT || 3000;

const app = express();


// Have Node serve the files for our built React app
app.use(express.static(path.resolve('./client/build')));

var jsonParser = bodyParser.json()


app.post("/api/stabilityEndpoint",jsonParser, async (req,res) => {
    const imageData = await textToImage(req.body.message);
    res.json({message: imageData})
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

    if(choiceArray == null) console.log("null choices")

    for(var i=0; i<choiceArray.length; i++){
        choiceArray[i] = choiceArray[i].slice(1,-1);
    }

    var fullScenario = data.replace(imageRegex,"");
    fullScenario = fullScenario.replace(choiceRegex,"");
    fullScenario = fullScenario.replace(/\n/g, "");

    var scenarioArray = fullScenario.split(".");
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
