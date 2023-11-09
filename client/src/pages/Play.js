import React from "react"
import loadingGif from "../images/loading.gif";

function StabilityRequest(props) {
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

export default function Play(){
    return(
        <>
            <h1>Play</h1>
            <StabilityRequest message="Dog playing with bone"/>
        </>
    )
};