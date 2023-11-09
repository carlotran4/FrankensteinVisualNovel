import express from 'express';
import path from 'path';
import bodyParser from 'body-parser'
import { textToImage } from "./stability.js"

const PORT = process.env.PORT || 3000;

const app = express();


// Have Node serve the files for our built React app
app.use(express.static(path.resolve('./client/build')));

var jsonParser = bodyParser.json()


app.post("/api/stabilityEndpoint",jsonParser, async (req,res) => {
    const imageData = await textToImage(req.body.message);
    res.json({message: imageData})
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
