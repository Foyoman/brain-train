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
			user_id: currentUser ? currentUser.uid : "" ,
			user: currentUser ? currentUser.displayName : "Anonymous", 
		});
		setFinalScore(0);
	}

	const reset = () => {
		setSequence([]);
		setTime(0);
		setRunningA(false);
		setRunningB(false);
		setUserSequence([])
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
			reset();
			if (sequence.length === 3) {
				setFinalScore(0);
			} else {
				setFinalScore(sequence.length - 1)
			}
		}
		if (sequence.length === userSequence.length + 1) {
			if (JSON.stringify(sequence) == JSON.stringify([...userSequence, e.target.value])) {
				console.log('won, and continue');
				setTurn('simone');
				setUserSequence([]);
				setSequence([...sequence, _.sample(colors)]);
				setRunningB(true);
			} 
		}
	}
	
	const resetAndPost = () => {
		console.log('log score');
		postScore();
		setGameState('start');
		setTurn('simone');
		red.current.blur();
	}

	const resetGame = () => {
		console.log('reset');
		setGameState('start');
		setTurn('simone');
		yellow.current.blur();
	}

	const nothing = () => {}


	// debugger
	return (
		<Container 
				className="d-flex align-items-center justify-content-center"
				style={{ minHeight: "20vh", marginTop: "1em", width: '600px' }}
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
						<div className='d-flex justify-content-center align-items-center' style={{ minHeight: '480px' }}>
							<div style={{ transform: 'rotate(-45deg)', maxWidth: '408px', borderRadius: '100%' }}>
								<Button 
									onClick={ gameState === "gameOver" ? nothing : handleClick }
									ref={ blue }
									value={ 'blue' }
									variant={ gameState === 'gameOver' ? "dark" : "primary" }
									style={{
										height: '200px', 
										width: '200px', 
										margin: '2px',
										cursor: `${ turn == 'simone' ? 'default' : 'pointer'}`,
										pointerEvents: `${ turn == 'simone' ? 'none' : '' }`,
										borderTopLeftRadius: '100%'
									}}
								>
									<h2 style={{ transform: 'rotate(45deg)', textAlign: 'right' }}>
										{ gameState === 'gameOver' ? "Game" : "" }
									</h2>
								</Button>
								<Button 
									onClick={ gameState === "gameOver" ? resetAndPost : handleClick }
									ref={ red }
									value={ 'red' }
									variant={ gameState === 'gameOver' ? "dark" : "danger" }
									style={{
										height: '200px',
										width: '200px', 
										margin: '2px',
										cursor: `${ turn == 'simone' ? 'default' : 'pointer'}`,
										pointerEvents: `${ turn == 'simone' ? 'none' : '' }`,
										borderTopRightRadius: '100%'
									}}
								>
									{ gameState === 'gameOver' ?
										<div style={{ transform: 'rotate(45deg)' }}>
											<br />
											<br />
											<h3 className='mb-0'>Score: { finalScore }</h3>
											<p className='mb-1'><strong>Click to log score</strong></p>
										</div>
									: "" }
								</Button>
								<Button 
									onClick={ gameState === "gameOver" ? resetGame : handleClick }
									ref={ yellow }
									value={ 'yellow' }
									variant={ gameState === 'gameOver' ? "dark" : "warning" }
									style={{
										height: '200px',
										width: '200px', 
										margin: '2px',
										cursor: `${ turn == 'simone' ? 'default' : 'pointer'}`,
										pointerEvents: `${ turn == 'simone' ? 'none' : '' }`,
										borderBottomLeftRadius: '100%'
									}}
								>
									<h4 style={{ transform: 'rotate(45deg)', marginRight: '0', paddingRight: '0' }}>
										{ gameState === 'gameOver' ? "Reset" : "" }
									</h4>
								</Button>
								<Button
									onClick={ gameState === "gameOver" ? nothing : handleClick }
									ref={ green }
									value={ 'green' }
									variant={ gameState === 'gameOver' ? "dark" : "success" }
									style={{
										height: '200px',
										width: '200px', 
										margin: '2px',
										cursor: `${ turn == 'simone' ? 'default' : 'pointer'}`,
										pointerEvents: `${ turn == 'simone' ? 'none' : '' }`,
										borderBottomRightRadius: '100%'
									}}
								>
									<h2 style={{ transform: 'rotate(45deg)', textAlign: 'left' }}>
										{ gameState === 'gameOver' ? "Over" : "" }
									</h2>
								</Button>
							</div>
						</div>
						</Card.Body>
				</Card>
			</div>
		</Container>
	)
}
