import React, { useState, useEffect, useRef } from 'react'
import { Container, Card, Button } from 'react-bootstrap'
import '../styles.css'
import _, { set } from 'lodash';
import { db } from '../firebase'
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from '../contexts/AuthContext'

export default function Simone() {
	const { currentUser } = useAuth();
	const scoresCollectionRef = collection(db, "scores");
	
	const [gameState, setGameState] = useState('start');
	const [sequence, setSequence] = useState([]);
	const [time, setTime] = useState(0);
	const [runningA, setRunningA] = useState(false);
	const [runningB, setRunningB] = useState(false);
	const [userSequence, setUserSequence] = useState([]);
	const [pause, setPause] = useState(false);
	const [turn, setTurn] = useState('simone');
	const [finalScore, setFinalScore] = useState(0);
	
	const blue = useRef(null);
	const red = useRef(null);
	const yellow = useRef(null);
	const green = useRef(null);

	const postScore = async () => {
		await addDoc(scoresCollectionRef, { 
			game: "Simone", 
			score: finalScore, 
			user_id: currentUser.uid, 
			user: currentUser ? currentUser.displayName : "Anonymous", 
		});
		setFinalScore(0);
	}

	const reset = () => {
		// setGameState('start');
		setSequence([]);
		setTime(0);
		setRunningA(false);
		setRunningB(false);
		setUserSequence([])
		// setTurn('simone');
	}

	const hardReset = () => {
		reset();
		setGameState('start')
		setTurn('simone');
	}

	const colors = [
		"blue",
		"red",
		"yellow",
		"green"
	]

	useEffect(() => {
		let interval;
		if (runningA) { 
			interval = setInterval(() => {
				setTime((prevTime) => prevTime + 1);
			}, 500); 
		} else if (!runningA) {
			clearInterval(interval);
		}
		return () => clearInterval(interval);
	}, [runningA]);

	useEffect(() => {
		let interval;
		let i = 0;
		let j = 1;
		if (runningB) { 
			interval = setInterval(() => {
				if (i >= sequence.length) {
					i = 0;
					j = 1;
					setRunningB(false);
					setTurn('user');
					blue.current.blur();
					red.current.blur();
					yellow.current.blur();
					green.current.blur();
				} else if (j % 2 === 0) {
					blue.current.blur();
					red.current.blur();
					yellow.current.blur();
					green.current.blur();
					j++;
				} else if (j % 2 !== 0) {
					if (sequence[i] === "blue") {
						blue.current.focus();
					}
					if (sequence[i] === "red") {
						red.current.focus();
					}
					if (sequence[i] === "yellow") {
						yellow.current.focus();
					}
					if (sequence[i] === "green") {
						green.current.focus();
					}
					i++;
					j++;
				} 
			}, 250); 
		} else if (!runningB) {
			clearInterval(interval);
		}
		return () => clearInterval(interval);
	}, [runningB]);


	const gameStart = () => {
		setFinalScore(0);
		setGameState('running');
		setRunningA(true);
		setTurn('simone');
		let startingColors = [];
		for (let i = 0; i < 3; i++) {
			startingColors = [...startingColors, _.sample(colors)];
		}
		setSequence(startingColors);
	}

	if (time == 1) {
		setTime(0);
		setRunningA(false);
		setRunningB(true);
	}

	const handleClick = (e) => {
		if (!finalScore) {
			blue.current.blur();
			red.current.blur();
			yellow.current.blur();
			green.current.blur();
			setUserSequence([...userSequence, e.target.value]);
			if (JSON.stringify(sequence.slice(0, userSequence.length + 1)) == JSON.stringify([...userSequence, e.target.value])) {
				console.log('winning')
			} else {
				console.log('losing, and game over')
				setGameState('gameOver')
				setFinalScore(sequence.length)
				reset();
			}
			if (sequence.length === userSequence.length + 1) {
				if (JSON.stringify(sequence) == JSON.stringify([...userSequence, e.target.value])) {
					console.log('won, and continue');
					setTurn('simone');
					setUserSequence([]);
					setSequence([...sequence, _.sample(colors)]);
					setRunningB(true);
				} else {
					console.log('lost, and game over');
					setGameState('gameOver');
					setFinalScore(sequence.length)
					reset();
				}
			}
		} 
	}
	
	const resetAndPost = () => {
		console.log('log score');
		postScore();
		setGameState('start');
		setTurn('simone');
	}

	const resetGame = () => {
		console.log('reset');
		setGameState('start');
		setTurn('simone');
	}


	// debugger
	return (
		<Container 
				className="d-flex align-items-center justify-content-center"
				style={{ minHeight: "20vh", marginTop: "1em" }}
		>
			<div className='w-100 text-center'>
				<Card className='d-flex justify-content-center align-items-center'>
					<Card.Body className='text-center'>
						<h1>
							<span className='blue'>S</span>
							<span className='red'>i</span>
							<span className='yellow'>m</span>
							<span className='blue'>o</span>
							<span className='green'>n</span>
							<span className='red'>e</span>
						</h1>
						<Button 
							onClick={ gameState === "start" ? gameStart : hardReset }
							variant={ gameState === "start" ? "primary" : "danger" }
						>
							{ gameState === "start" ? "Start" : "Reset"}
						</Button>
						<div className='d-flex justify-content-center align-items-center' style={{ minHeight: '70vh', maxHeight: '412px' }}>
							<div style={{ transform: 'rotate(-45deg)', maxWidth: '412px' }}>
								<Button 
									onClick={ handleClick }
									ref={ blue }
									value={ 'blue' }
									variant={ gameState === 'gameOver' ? "dark" : "primary" }
									style={{
										height: '200px', 
										width: '200px', 
										margin: '3px',
										cursor: `${ turn == 'simone' ? 'default' : 'pointer'}`,
										pointerEvents: `${ turn == 'simone' ? 'none' : '' }`
									}}
								>
									<h1 style={{ transform: 'rotate(45deg)' }}>
										{ gameState === 'gameOver' ? "Game" : "" }
									</h1>
								</Button>
								<Button 
									onClick={ gameState !== "gameOver" ? handleClick : resetAndPost }
									ref={ red }
									value={ 'red' }
									variant={ gameState === 'gameOver' ? "dark" : "danger" }
									style={{
										height: '200px',
										width: '200px', 
										margin: '3px',
										cursor: `${ turn == 'simone' ? 'default' : 'pointer'}`,
										pointerEvents: `${ turn == 'simone' ? 'none' : '' }`
									}}
								>
									{ gameState === 'gameOver' ?
										<div style={{ transform: 'rotate(45deg)' }}>
											<h2 className='mb-0'>Score: { finalScore }</h2>
											<p className='mb-1'><strong>Click to log score</strong></p>
										</div>
									: "" }
								</Button>
								<Button 
									onClick={ gameState !== "gameOver" ? handleClick : resetGame }
									ref={ yellow }
									value={ 'yellow' }
									variant={ gameState === 'gameOver' ? "dark" : "warning" }
									style={{
										height: '200px',
										width: '200px', 
										margin: '3px',
										cursor: `${ turn == 'simone' ? 'default' : 'pointer'}`,
										pointerEvents: `${ turn == 'simone' ? 'none' : '' }`
									}}
								>
									<h3 style={{ transform: 'rotate(45deg)' }}>
										{ gameState === 'gameOver' ? "Reset" : "" }
									</h3>
								</Button>
								<Button
									onClick={ handleClick }
									ref={ green }
									value={ 'green' }
									variant={ gameState === 'gameOver' ? "dark" : "success" }
									style={{
										height: '200px',
										width: '200px', 
										margin: '3px',
										cursor: `${ turn == 'simone' ? 'default' : 'pointer'}`,
										pointerEvents: `${ turn == 'simone' ? 'none' : '' }`
									}}
								>
									<h1 style={{ transform: 'rotate(45deg)' }}>
										{ gameState === 'gameOver' ? "Over" : "" }
									</h1>
								</Button>
							</div>
						</div>
						</Card.Body>
				</Card>
			</div>
		</Container>
	)
}
