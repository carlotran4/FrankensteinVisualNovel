import React from 'react';
import {Link}  from "react-router-dom";
import '../css/Home.css';

function Title(){
    return (
      <>
      <h1>Frankenstein: The Eternal Chronicles</h1>
      <h2>It's almost human. But not quite...</h2>
      </>
    )
  }
  
  function Buttons(){
    return(
      <div class="titlePageButtons">
        <Link to="/play">
          <button id="playButton">Play</button>
        </Link>
        <button class="descButton" id="aboutButton">About</button> <button class="descButton" id="sourceCodeButton">Source Code</button> <button class="descButton" id="plagiarismButton">Plagiarism?</button>
      </div>
    )
  }
  
  export default function Home(){
    return(
      <>
        <Title />
        <Buttons />
      </>
    )
  };