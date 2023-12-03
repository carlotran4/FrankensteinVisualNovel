import React, { useState } from "react" 
import loadingGif from "../images/loading.gif";
import "../css/play.css"

function StabilityRequest(props) {
    console.log(props.message);
    const [data, setData] = React.useState(null);
    React.useEffect(()=>{
        fetch("/api/stabilityEndpoint",{
            method: 'Post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({message : props.message}),
        })
        .then((res) => res.json())
        .then((data) => setData(data.message));
    },[props.message])

    if(!data){
        return (
            <div className="mainPictureDiv">
            <img id="loadingGif" src={loadingGif} alt="loading gif"/>
            </div>
        )
    }
    else{
        return (
            <div className="mainPictureDiv">
                <img id="scenarioPicture" src={`data:image/png;base64, ${data}`} alt="Pertinent to the scenario"/>
            </div>
        )
    }

}

function Scenarios(props){
    const [scenarioIndex, setScenarioIndex] = React.useState(0);
    return(
        <div id="fieldsetDiv">
            <fieldset id="scenarioFieldbox">
                <span className="scenarioText">{props.array[scenarioIndex]}</span>
                <button id="nextButton" onClick={()=>{
                    setScenarioIndex(scenarioIndex+1);
                    if(scenarioIndex>=props.array.length-1) props.setIsScenario(false);
                }}>Next</button>
            </fieldset>
        </div>
    )
}

function Choices(props){

    const choices = props.array.map((choice)=>{
        return(
            <div className="individualButtonDiv">
                <button className="choiceButtons" onClick={()=>{
                    props.setMessage({content: choice});
                    props.setIsScenario(true);
                    props.setJsonData(null);
                    }}>{choice}</button> 
            </div>
        )
    })
    return(
        <div id="choiceButtonDiv">
            {choices}
        </div>
    )
}


function OpenAIRequest(props) {

    const [jsonData, setJsonData] = React.useState();
    const [message, setMessage] = React.useState(props.startMessage);
    const [isScenario, setIsScenario] = React.useState(true);

    React.useEffect(()=>{
        fetch("/api/openAiEndpoint",{
            method: 'Post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({message : message.content}),
        })
        .then((res) => res.json())
        .then((json) => setJsonData(json))
    }, [message])

    if(jsonData && isScenario) return(
        <>
            <StabilityRequest message={jsonData.imagePrompt}/>
            <Scenarios array={jsonData.scenarioArray} setIsScenario={setIsScenario}/>
        </>
    )
    if(jsonData && !isScenario) return(
        <>
            <StabilityRequest message={jsonData.imagePrompt}/>
            <Choices array={jsonData.choiceArray} setIsScenario={setIsScenario} setMessage={setMessage} setJsonData={setJsonData}/>
        </>
    )
    return(
        <>
            <h2>Waiting for ChatGPT (ChatGPT is slow these days)...</h2>
            <h2>Hint: Press f11 to go fullscreen</h2>
        </>
    )
}

export default function Play() {
    const [isDone, setIsDone] = useState(false)

    React.useEffect( () => {
        console.log("Mounted")
        fetch("/api/openAiEndpoint/wipePlayData",{
            method: 'Post',
            headers: {
                'Content-Type':'application/json'
            }
        })
        setIsDone(true);
    },[])


    if(isDone) return(
        <>
            <OpenAIRequest startMessage={{content:"Start the novel"}}/>
        </>
    )
    return(
        <>
            <h1>Wiping Play Data</h1>
        </>
    )
}
