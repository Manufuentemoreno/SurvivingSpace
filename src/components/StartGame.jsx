import React from "react";
import portal from "../assets/images/rymPortal.png"

const StartGame = (props)=>{
    
    return(
        <article className="start-game">
            <h1>Surviving Space</h1>
            {props.points > 0 && <p>You’ve Scored {props.points} points!</p> }
            <button type="button" onClick={props.start}>Play</button>
            <img src={portal} className="portal-back" />
        </article>
    )
}

export default StartGame;