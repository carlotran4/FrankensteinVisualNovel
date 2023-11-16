import React from "react" 
import loadingGif from "../images/loading.gif";
import "../css/Play.css"

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
            <>
            <img src={loadingGif} alt="loading gif"/>
            </>
        )
    }
    else{
        return (
            <>
                <img src={`data:image/png;base64, ${data}`} alt="Pertinent to the scenario"/>
            </>
        )
    }

}

function Scenarios(props){
    const [scenarioIndex, setScenarioIndex] = React.useState(0);
    return(
        <>
            <fieldset id="ScenarioFieldbox">
                <span className="scenarioText">{props.array[scenarioIndex]}</span>
                <button id="nextButton" onClick={()=>{
                    setScenarioIndex(scenarioIndex+1);
                    if(scenarioIndex>=props.array.length-1) props.setIsScenario(false);
                }}>Next</button>
            </fieldset>
        </>
    )
}

function Choices(props){

    const choices = props.array.map((choice)=>{
        return(
            <div>
                <button onClick={()=>{
                    props.setMessage(choice.substring(0,2));
                    props.setIsScenario(true);
                    props.setJsonData(null);
                    }}>{choice}</button>
            </div>
        )
    })
    return(
        <>
            {choices}
        </>
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
            body: JSON.stringify({message : message}),
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
            <p>Loading...</p>
        </>
    )
}

export default function Play() {
    //Send starting message using componentDidMount()
    //Creates Option boxes for choices
    //Creates all text boxes
    //Holds index value that goes +=1 on next click
    //update visible box based on index
    //When choice is clicked-
        //messageJson = openAIRequest(1 or 2 or 3 or 4)
        //re-render image with messageJson.Prompt
    
    return(
        <>
            <OpenAIRequest startMessage="Restart the novel with a different scenario"/>
        </>
    )
}
