import React, { useState, useEffect } from 'react';
import '../styles.css';
import { Card, Container, Form, Button, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import '../styles.css'
import _ from 'lodash';
import { db } from '../firebase'
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from '../contexts/AuthContext'

export default function Reaction() {
	const { currentUser } = useAuth();
	const scoresCollectionRef = collection(db, "scores");

	const [time, setTime] = useState(0);
	const [runningA, setRunningA] = useState(false);
	const [runningB, setRunningB] = useState(false);
	const [gameState, setGameState] = useState('start');
	const [startTime, setStartTime] = useState(0);
	const [elapsed, setElapsed] = useState(0);
	const [goTime, setGoTime] = useState(_.random(3, 10));
	const [scores, setScores] = useState([]);
	const [count, setCount] = useState(1);
	const [finalScore, setFinalScore] = useState(0);

	const postScore = async () => {
		// game, timer, score, user
		await addDoc(scoresCollectionRef, { 
			game: "Reaction.js", 
			score: finalScore, 
			user_id: currentUser.uid, 
			user: currentUser ? currentUser.displayName : "Anonymous", 
		});
	}
	
	useEffect(() => {
		let interval;
		if (runningA) { // if the runningA state is true, start the timer
			interval = setInterval(() => {
				setTime((prevTime) => prevTime + 1);
			}, 1000); // the time state increments by 1 every second
		} else if (!runningA) {
			clearInterval(interval); // stop the interval if runningA is false
		}
		return () => clearInterval(interval);
	}, [runningA]);

	useEffect(() => {
		let interval;
		if (runningB) {
			interval = setInterval(function() {
				let elapsedTime = Date.now() - startTime;
				setElapsed(elapsedTime);
			}, 10);
		} else if (!runningB) {
			clearInterval(interval)
		}
		return () => clearInterval(interval);
	}, [runningB])

	const reset = () => {
		setTime(0);
		setRunningA(false);
		setRunningB(false);
		setGameState('start');
		setStartTime(0);
		setElapsed(0);
		setGoTime(_.random(3, 10));
		setScores([]);
		setCount(1);
		setFinalScore(0);
	}

	const handleClick = () => {
		if (gameState === 'start') {
			setGameState('wait');
			setRunningA(true);
		}
		if (gameState === 'wait') {
			setTime(0);
			setRunningA(false);
			setGameState('tooSoon');
			setStartTime(0);
			setElapsed(0);
			setGoTime(_.random(3, 10))
		}
		if (gameState === 'tooSoon') {
			setGameState('start');
		}
		if (gameState === 'click') {
			setGameState('result');
			setRunningB(false);
			setScores([...scores, Number(elapsed)]);
		}
		if (gameState === 'result') {
			setGameState('start');
			setElapsed(0);
			setGoTime(_.random(3, 10));
			setCount(count + 1)
		}
		if (gameState === 'click' && count >= 3) {
			setGameState('finalResult');
			setFinalScore(
				Math.round(_.reduce([...scores, Number(elapsed)], function(memo, num) {
        	return memo + num;
    		}, 0) / 3)
			)
		}
		if (gameState === 'finalResult') {
			setGameState('start');
			setCount(1);
			postScore();
		}
	}

	if (time === goTime) {
		setTime(0);
		setStartTime(Date.now());
		setGameState('click');
		setRunningA(false);
		setRunningB(true);
	}

	return (
		<Container 
				className="d-flex align-items-center justify-content-center"
				style={{ minHeight: "20vh", marginTop: "1em" }}
		>
			<div className='w-100 text-center' style={{ maxWidth: '550px' }}>
				<Card className='d-flex justify-content-center align-items-center'>
					<Card.Body className='text-center'>
						<h2 className="mb-4">⚛️ Reaction.js</h2>
						<h3>{ count }/3</h3>
						<Button
							className={`
								btn-lg mt-1 mb-1
								${gameState === "start" ? "btn-primary" : ""} 
								${gameState === "wait" ? "btn-dark" : ""}
								${gameState === "tooSoon" ? "btn-warning" : ""} 
								${gameState === "click" ? "btn-success" : ""}
								${gameState === "result" || gameState === "finalResult" ? "btn-info" : ""}
							`}
							style={{ 
								aspectRatio: 1/1,
								color: 'white', 
								height: '500px',
								maxHeight: '500px', 
								margin: '0 auto', 
								fontSize: '36px', 
								transition: 'none'
							}}	
							onMouseDown={ handleClick }
						>
							{ gameState === "start" ? "Start" : "" }
							{ gameState === "wait" ? "wait..." : "" }
							{ gameState === "tooSoon" ? "Too soon!" : "" }
							{ gameState === "click" ? "Click!" : "" }
							{ gameState === "result" ? <div><p>{elapsed}ms</p><p>Click to continue</p></div> : "" }
							{ gameState === "finalResult" ? <div><p>Your average: { finalScore }ms</p><p style={{ fontSize: '24px' }}>Click to log score</p></div> : "" }
						</Button>
					</Card.Body>
				</Card>
				<Button onClick={ reset } className="mt-2 btn btn-danger" style={{ margin: '0 auto' }}>Reset</Button>
			</div>
		</Container>
	)
}

// cycling through maybe 5 different buttons, users are prompted to click as soon as they see a certain symbol, let's call it 'react'
// click to start. setStart('true')
// cycle through the different buttons at random 2 seconds at a time
// maybe an easy mode that's just like human benchmark

// ${gameState === "click" ? "btn-success" : ""}

