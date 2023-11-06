const express = require("express");

const PORT = process.env.PORT || 3000;

const app = express();
const path = require("path");

// Have Node serve the files for our built React app
app.use(express.static(path.resolve('./client/build')));

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
