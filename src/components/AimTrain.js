import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, Button, Container } from 'react-bootstrap';
import _, { random, set } from 'lodash';
import '../styles.css';
import { db } from '../firebase'
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from '../contexts/AuthContext'
import target from '../images/target.webp'

export default function AimTrain() {
	const { currentUser } = useAuth();
	const scoresCollectionRef = collection(db, "scores");
	
	const [height, setHeight] = useState(0);
	const [width, setWidth] = useState(0);
	const [time, setTime] = useState(0);
	const [runningA, setRunningA] = useState(false);
	const [runningB, setRunningB] = useState(false);
	const [startTime, setStartTime] = useState(0);
	const [elapsed, setElapsed] = useState(0);
	const [display, setDisplay] = useState('show');
	const [reactions, setReactions] = useState([]);
	const [count, setCount] = useState(1);
	const [average, setAverage] = useState('😏');
	const [clicks, setClicks] = useState(0);
	const [correctClicks, setCorrectClicks] = useState(0);
	const [topPos, setTopPos] = useState(0);
	const [leftPos, setLeftPos] = useState(0);
	const [accuracy, setAccuracy] = useState('💯');
	const [start, setStart] = useState(false);
	const [finalScore, setFinalScore] = useState(0);
	const [targets, setTargets] = useState(0);
	const [multiplier, setMultiplier] = useState(0);


	const ref = useRef(null)

	const postScore = async () => {
		// game, timer, score, user
		await addDoc(scoresCollectionRef, { 
			game: "Aim Train", 
			score: finalScore, 
			average: average,
			accuracy: Number(accuracy),
			user_id: currentUser.uid, 
			user: currentUser ? currentUser.displayName : "Anonymous", 
		});
	}

	useEffect(() => {
		let interval;
		if (runningA) { 
			interval = setInterval(() => {
				setTime((prevTime) => prevTime + 1);
			}, 10); 
		} else if (!runningA) {
			clearInterval(interval); 
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

	useEffect(() => {
		setHeight(ref.current.clientHeight - 130);
		setWidth(ref.current.clientWidth - 130);
	}) // bug: position won't change if a user resizes their browser

	const randomPosition = {
		position: 'relative',
		top: topPos,
		left: leftPos,
	}

	const handleClick = (e) => {
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		if (!finalScore) {
			setTopPos(_.random(0, height));
			setLeftPos(_.random(0, width));
			setDisplay('hide');
			setRunningA(true);
			setRunningB(true);
			setCount(count + 1);
			setStart(true);

			if (count > 1) {
				setTargets(targets + 1)
				setClicks(clicks + 1);
				setCorrectClicks(correctClicks + 1);
				setAccuracy(((correctClicks + 1) / (clicks + 1) * 100).toFixed(2))
				if (((correctClicks + 1) / (clicks + 1) * 100).toFixed(2) == 100) {
					setAccuracy(100)
				}
			}
		}
	}

	const handleMisclick = () => {
		if (!finalScore) {
			if (count > 1) {
				setClicks(clicks + 1);
				setAccuracy((correctClicks / (clicks + 1) * 100).toFixed(2))
			}
		}
	}

	if (time === 1) {
		if (!finalScore) {
			setTime(0);
			setRunningA(false);
			setStartTime(Date.now());
			setRunningB(false);
			if (count > 2) {
				setReactions([...reactions, Number(elapsed)]);
				setAverage(
					Math.round(_.reduce([...reactions, Number(elapsed)], function(memo, num) {
						return memo + num;
					}, 0) / (reactions.length + 1))
				)
			}
			
			setDisplay('show');
		}
	}



	if (targets >= 15) { // can replace 15 with an option
		setTargets(0);
		let multiplyer = 0;
		let accuraci = 0;
		if (average >= 1000) {
			multiplyer = 1;
		} else {
			multiplyer = (((1000 - average) / 100) + 1);
		}
		if (Number(accuracy) == 100) {
			accuraci = 1;
		} else {
			accuraci = accuracy/100;
		}

		setFinalScore(Math.round(1000 * multiplyer * accuraci));
	}

	const reset = () => {
		setTime(0);
		setRunningA(false);
		setRunningB(false);
		setStartTime(0);
		setElapsed(0);
		setDisplay('show');
		setReactions([]);
		setCount(1);
		setAverage('😏')
		setClicks(0);
		setCorrectClicks(0);
		setTopPos(0);
		setLeftPos(0);
		setAccuracy('💯');
		setStart(false);
		setFinalScore(0);
		setTargets(0);
	}

	const resultButton = () => {
		reset();
		postScore();
	}

	return (
		<Container 
			className="d-flex align-items-center justify-content-center"
			style={{ minHeight: "20vh", marginTop: "1em" }}
		>
			<div className='w-100 text-center'>
				<Card>
					<Card.Body className='text-center'>
						<h1>🎯 Aim Train 🚂</h1>
						<div className='d-flex justify-content-between'>
							<p>Accuracy: { accuracy === 100 ? "💯" : accuracy }%</p>
							<p>Avg. Reaction Speed (ms): { average }</p>
						</div>
						<Card onMouseDown={ handleMisclick }>
							<Card.Body ref={ ref } style={{ height: '70vh' }}>
								{ finalScore ? 
									<div className='d-flex align-items-center justify-content-center h-100'>
										<div 
											onClick={ resultButton }
											className='text-center btn btn-primary' 
											style={{ padding: '1em' }}
										>
											<h2 className='mb-0'>Score: { finalScore }</h2>
											<p className='mb-1' style={{fontSize: '20px'}}><strong>Click to log score</strong></p>
											<ul className='mb-1'>
												<li>Avg. reaction speed: { average }ms</li>
												<li>Accuracy: { accuracy }%</li>
											</ul>
										</div>
									</div> 
									:
									<div 
										onMouseDown={ handleClick } 
										className={`target ${display} d-flex justify-content-center align-items-center`} 
										style={ randomPosition }
									>
										<strong className='red'>
											{ count > 1 ? "O" : "START" }
										</strong>
									</div>
								}
							</Card.Body>
						</Card>
						
					</Card.Body>
					
				</Card>
				<Button onClick={ reset } className="text-center mb-5 mt-2 btn btn-danger" style={{ margin: '0 auto' }}>Reset</Button>
			</div>
		</Container>
	)
}