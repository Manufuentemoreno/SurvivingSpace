import './App.css';
import styled from "styled-components";

import { React, useState, useEffect } from 'react';
import StartGame from './components/StartGame';

import spaceshipImg from "./assets/images/RickAndMortyShip.png";
import space from "./assets/images/spaceBack.jpg";

const SPACESHIP_HEIGHT = 60;
const SPACESHIP_WIDTH = 70;
const GB_Height = 500;
const GB_Width = 500;
const GRAVITY = 6 ;
const powerUp_HEIGHT = 100;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP = 200;


function App() {

  const [ gameHasStarted, setGameHasStarted ] = useState(false);
  const [ gamePaused, setGamePaused ] = useState(false);
  const [ spaceshipPosition, setSpaceshipPosition ] = useState(GB_Height/2);
  const [ obstacleHeight, setObstacleHeight] = useState(150);
  const [ obstacleLeft, setObstacleLeft ] = useState(GB_Width-OBSTACLE_WIDTH);
  const [ score, setScore ] = useState(0);
  const [ lastScore, setLastScore ] = useState(0);
  const [ space, setSpace ] = useState(0)

  const bottomObstacleHeight = GB_Height - obstacleHeight - OBSTACLE_GAP;

  const newObstacle = ()=>{
    setObstacleLeft(GB_Width - OBSTACLE_WIDTH);
    setObstacleHeight(
          Math.floor(Math.random()*(GB_Height-OBSTACLE_GAP))
        );
  }

  // Start Game
  const startGame = ()=>{
    setGameHasStarted(true);
    setGamePaused(false);
    setSpaceshipPosition(GB_Height/2);
    newObstacle();
    setScore(0);
  };

  // Spaceship FALL
  useEffect(()=>{
    let timeId;
    if ( gameHasStarted && !gamePaused && spaceshipPosition < GB_Height - SPACESHIP_HEIGHT){
      timeId = setInterval(()=>{
        setSpaceshipPosition((spaceshipPosition) =>
          spaceshipPosition + GRAVITY
        );
      }, 24);
    }

    return ()=>{
      clearInterval(timeId);
    }
  }, [spaceshipPosition, gameHasStarted, gamePaused]);

  // Spaceship Rotation
  useEffect(()=>{
  
  },)

  // Power up
  const powerUp = ()=>{
    if( gameHasStarted ){
      let newSpaceshipPosition = spaceshipPosition - powerUp_HEIGHT;
      if(newSpaceshipPosition <  0){
        return setSpaceshipPosition(0)
      }
      setSpaceshipPosition(newSpaceshipPosition);
    }
  }

  // BACKGROUND SCROLL
  useEffect(()=>{
    let spaceId;
    if( gameHasStarted && !gamePaused ){
      spaceId = setInterval(()=>{
        setSpace( space => space - 1)
      }, 40);

      return()=>{
        clearInterval(spaceId)
      }
    }
    else if( gamePaused ){
      setSpace(space)
    }

    else{
      setSpace(0);
    }
  }, [gameHasStarted, gamePaused])

  // OBSTACLE SCROLL
  useEffect(()=>{
    let obstacleId;
    if( gameHasStarted && !gamePaused && obstacleLeft >= -OBSTACLE_WIDTH ){
      obstacleId = setInterval(()=>{
        setObstacleLeft( (obstacleLeft) => obstacleLeft -5)
      }, 24); // refresh interval it´s the level difficult
    
      return()=>{
        clearInterval(obstacleId);
      }
    }

    else if(gamePaused){
      setObstacleLeft(obstacleLeft);
    }

    // when it´s out of the screen create a new obstacle
    else{
      setObstacleLeft(GB_Width - OBSTACLE_WIDTH);
      setObstacleHeight(
        Math.floor(Math.random()*(GB_Height-OBSTACLE_GAP))
      );
    
    gameHasStarted ? setScore(score=>score+1) : setScore(score=>0);
    }
  }, [gameHasStarted, obstacleLeft, gamePaused]);

  // Has crashed?
  useEffect(()=>{
    const hasColidedWithTopObstacle = spaceshipPosition >= 0 && spaceshipPosition+5 < obstacleHeight;
    const hasColidedWithBottomObstacle = spaceshipPosition <= GB_Height && spaceshipPosition+SPACESHIP_HEIGHT-3 >= GB_Height-bottomObstacleHeight;
    
    if(
      obstacleLeft >= -20 && //  if < -20 spaceship had passed Ok
      obstacleLeft < 90 && // tiene que ser < 90 -- obwid = 40
      (hasColidedWithBottomObstacle || hasColidedWithTopObstacle)
    ){
      setGamePaused(true);
      setGameHasStarted(false);
      setLastScore(score);
    }
  }, [spaceshipPosition, obstacleHeight, bottomObstacleHeight, obstacleLeft, score ]);

  // Has touched the floor?
  useEffect(()=>{
    const touchedFloor = spaceshipPosition >= 442;

    if(touchedFloor){
      setGamePaused(true);
      setGameHasStarted(false);
      setLastScore(score);
    }

  }, [spaceshipPosition]);

  return (
    <Div >
    { !gameHasStarted && 
      <StartGame start={startGame} points={lastScore}/>
    }
      <GameBox height={GB_Height} width={GB_Width} onClick={powerUp} movingBackground={space}>
        <Obstacle 
          top={0}
          height={obstacleHeight}
          width={OBSTACLE_WIDTH}
          left={obstacleLeft}
        />
        <Obstacle 
          top={GB_Height - (obstacleHeight + bottomObstacleHeight)}
          height={bottomObstacleHeight}
          width={OBSTACLE_WIDTH}
          left={obstacleLeft}
        />
        <Spaceship src={spaceshipImg} top={spaceshipPosition} height={SPACESHIP_HEIGHT} width={SPACESHIP_WIDTH}/>
      </GameBox>
      <span className='score'>{score}</span>
    </Div>
  );
}

export default App;

const Spaceship = styled.img.attrs( props => ({
  style:{
    top: props.top,
    height: props.height,
    width: props.width,
  }
}))`
  position: absolute;
  left: 20px;
  filter: brightness(130%);
  `;

const Div = styled.div`
  margin-top: 50px;
  position: relative;
  display: flex;
  width: 100%;
  justify-content: center;
  & span{
    font-size: 60px;
    color: white;
    font-weight: 600;
    position: absolute;
  }
`;

const GameBox = styled.div.attrs( props => ({
  style:{
    height: props.height,
    width: props.width,
    backgroundPosition: props.movingBackground
  }
}))`
  background-image: url(${space});
  background-size: cover;
  border: solid 3px black;
  overflow: hidden;
  position: relative;
  box-shadow: -1px 4px 18px 0px rgba(0,0,0,0.51);
  -webkit-box-shadow: -1px 4px 18px 0px rgba(0,0,0,0.51);
  -moz-box-shadow: -1px 4px 18px 0px rgba(0,0,0,0.51);
`;

const Obstacle = styled.div.attrs( props => ({
  style:{
    height: props.height,
    width: props.width,
    top: props.top,
    left: props.left
  }
}))`
  position: relative;
  background-color: #44e944;
`;