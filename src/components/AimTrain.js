import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, Button, Container } from 'react-bootstrap';
import _, { random } from 'lodash';
import '../styles.css';
import { db } from '../firebase'
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from '../contexts/AuthContext'
import target from '../images/target.webp'

export default function AimTrain() {
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
	const [score, setScore] = useState('🏆');
	const [start, setStart] = useState(false);

	const [finalScore, setFinalScore] = useState(0);


	const ref = useRef(null)

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

	const position = {

	}

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
				setClicks(clicks + 1);
				setCorrectClicks(correctClicks + 1);
				setAccuracy(((correctClicks + 1) / (clicks + 1) * 100).toFixed(2))
				if (((correctClicks + 1) / (clicks + 1) * 100).toFixed(2) == 100) {
					setAccuracy('💯')
				}
			}
		}
		// setTopPos(_.random(0, height));
		// setLeftPos(_.random(0, width));
		// setDisplay('hide');
		// setRunningA(true);
		// setRunningB(true);
		// setCount(count + 1);
		// setStart(true);

		// if (count > 1) {
		// 	setClicks(clicks + 1);
		// 	setCorrectClicks(correctClicks + 1);
		// 	setAccuracy(((correctClicks + 1) / (clicks + 1) * 100).toFixed(2))
		// 	if (((correctClicks + 1) / (clicks + 1) * 100).toFixed(2) == 100) {
		// 		setAccuracy('💯')
		// 	}
		// }
	}

	const handleMisclick = () => {
		if (!finalScore) {
			if (count > 1) {
				setClicks(clicks + 1);
				setAccuracy((correctClicks / (clicks + 1) * 100).toFixed(2))
				setScore(Math.round(1000 * (((1000 - average) / 100) + 1) * (accuracy/100)));
			}
		}
		// if (count > 1) {
		// 	setClicks(clicks + 1);
		// 	setAccuracy((correctClicks / (clicks + 1) * 100).toFixed(2))
		// 	setScore(Math.round(1000 * (((1000 - average) / 100) + 1) * (accuracy/100)));
		// }
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
		// setTime(0);
		// setRunningA(false);
		// setStartTime(Date.now());
		// setRunningB(false);
		// if (count > 2) {
		// 	setReactions([...reactions, Number(elapsed)]);
		// 	setAverage(
		// 		Math.round(_.reduce([...reactions, Number(elapsed)], function(memo, num) {
		// 			return memo + num;
		// 		}, 0) / (reactions.length + 1))
		// 	)
		// }
		
		// setDisplay('show');
	}

	if (correctClicks >= 15) { // can replace 15 with an option
		setCorrectClicks(0);
		setFinalScore(Math.round(1000 * (((1000 - average) / 100) + 1) * (accuracy/100)));
	}

	return (
		<Container 
			className="d-flex align-items-center justify-content-center"
			style={{ minHeight: "20vh", marginTop: "1em" }}
		>
			<div className='w-100'>
				<Card>
					<Card.Body className='text-center'>
						<h1>🎯 Aim Train 🚂</h1>
						<div className='d-flex justify-content-between'>
							<p>Accuracy: { accuracy }%</p>
							<p>Count: { count }</p>
							<p>Clicks: { clicks }</p>
							<p>Avg. Reaction Speed (ms): { average }</p>
						</div>
						<Card onMouseDown={ handleMisclick }>
							<Card.Body ref={ ref } style={{ height: '70vh' }}>
								{ finalScore ? 
									<div className='d-flex align-items-center justify-content-center h-100'>
										<div className='text-center btn btn-primary' style={{ padding: '1em' }}>
											<h2>Score: { finalScore }</h2>
											<ul>
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
				
			</div>
			<div className="score-card">
				{/* TODO: show a scorecard when a user finishes a test */}
			</div>
		</Container>
	)
}


// 1000 - 556 =  444
// if average > 1000, don't apply score multiplier
// setScore 1000 * ((1000 - 444) /1000) + 1)
// 1000 * (((1000 - average) / 1000) + 1) * accuracy

// 1000 - average 
// 1000 * (((1000 - average) / 100) + 1) * (accuracy/100)