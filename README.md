# Frankenstein: The Eternal Chronicles
## Overview
Frankenstein: The Eternal Chronicles is an AI-based visual novel on the novel Frankenstein, by Mary Shelley. It is build using ReactJS and NodeJS, and uses GPT 3.5 and Stable Diffusion XL 2.1 for text and image generation. I use Github workflows for CI/CD to a Microsoft Azure Web App. This project is hosted at https://frankenstein-game.azurewebsites.net/

## Premise
My visual novel consists of a Node backend and a React frontend. The backend parses api responses from the OpenAI API, which is prompted to be returned as a json string. The json string contains a scenario, an array of choices to make based on the scenario, and an image prompt based on the scenario. The parsed scenario and choices are sent to the front end, and the image prompt is used to generate an image using the Stable Diffusion API, which is also sent to the front end. When the user selects a choice, that choice is used as the next GPT prompt. 


## Prompting
To view the prompting I use, go to `messageData.json`. Essentially, the only prompting I create is to set the system guidelines. After that, output from GPT is only based on the user's choices. 

## Contributing
Feel free to open a pull or feature request! Alternatively, shoot me an email at carlotran4@gmail.com.