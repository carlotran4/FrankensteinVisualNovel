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
        <Link to="/about">
          <button class="descButton" id="aboutButton">About</button>
        </Link> 
        <Link  target='_blank' to="https://github.com/carlotran4/frankensteinGame">
          <button class="descButton" id="sourceCodeButton">Source Code</button> 
        </Link>
        <Link to="/plagiarism">
          <button class="descButton" id="plagiarismButton">Plagiarism?</button>
        </Link>
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