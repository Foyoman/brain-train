import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Container } from 'react-bootstrap';
import _ from 'lodash';
import '../styles.css';
import { db } from '../firebase'
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from '../contexts/AuthContext'

const Typer = () => {
	const { currentUser } = useAuth()
	const scoresCollectionRef = collection(db, "scores")

	const [quote, setQuote] = useState('');
	const [input, setInput] = useState('');
	const [style, setStyle] = useState('');
	const [time, setTime] = useState(15);
	const [timer, setTimer] = useState(15); // default timer 
	const [chars, setChars] = useState(0); // sets total amount of characters a user has typed
	const [wpm, setWpm] = useState(0); // wpm = (chars / 5) * 60 / time
	const [running, setRunning] = useState(false);
	const [highScore, setHighScore] = useState(0);

	const postScore = async () => {
		// game, timer, score, user
		await addDoc(scoresCollectionRef, {
			game: "Proto-Type", 
			timer: timer, 
			score: wpm, 
			user_id: currentUser.uid, 
			user: currentUser ? currentUser.displayName : "Anonymous", 
		});
	}

	useEffect(() => {
		let interval;
		if (running) { // if the running state is true, start the timer
			interval = setInterval(() => {
				setTime((prevTime) => prevTime - 1);
			}, 1000); // the time state increments by 1 every second
		} else if (!running) {
			clearInterval(interval); // stop the interval if running is false
		}
		return () => clearInterval(interval);
	}, [running]);

	const calculateWPM = () => {
		setWpm(Math.floor((chars / 5) * 60 / (15 - time)) || 0); // words per minute is the total characters typed correctly divided by 5 times 60 divided by the total seconds elapsed
	}

	const fetchQuote = () => {
		axios("https://api.kanye.rest/").then((response) => { // a quote by kanye west
				setQuote(response.data.quote.toLowerCase());
		});
	}

	const _handleSubmit = (e) => {
		e.preventDefault();
		setRunning(false); // stops the timer 
		setInput(''); // clears input
		fetchQuote();
	}

	if (input === quote && input.length > 0) { // auto submits if the input matches the entire quote
		setRunning(false);
		setInput('');
		fetchQuote();
	}  

	const _handleInput = (e) => {
		const quoteByChar = quote.split('').slice(0, e.target.value.length).join(''); // slices the quote to the current length of the input
		if (e.target.value === quoteByChar) { // to be compared with the input
			setChars(chars + 1); // only add to the char count on a correct keystroke
			setStyle('green')
		} else {
			setStyle('red')
		}
		calculateWPM(); 
		setRunning(true); // starts the timer when a user starts typing
		setInput(e.target.value); // asynchronous
	}

	const reset = () => {
		fetchQuote();
		setInput('');
		setStyle('');
		setTime(15);
		setChars(0);
		setWpm(0);
		setRunning(false);
	}

	if (time === 0) {
		const finalWpm = Math.floor((chars / 5) * 60 / (15 - time)) || 0
		if (finalWpm > highScore) {
			setHighScore(finalWpm)
		}
		reset();
		postScore();
	}

	useEffect(fetchQuote, []); // load one quote at page load(en)

	useEffect(() => {
		axios("https://random-word-api.herokuapp.com/all").then((response) => {
				console.log(_.sample(response.data, 5)); // this should give me an array of 5 random words but it don't
		});
	}, [])

	return (
		<Container 
				className="d-flex align-items-center justify-content-center"
				style={{ minHeight: "20vh", marginTop: "1em" }}
		>
			<div className='w-100'>
				<Card>
					<Card.Body>
						<h1>⌨️ Proto-Type</h1>
						<br />
						<h3 className={ style }>{ quote }</h3>
						<br />
						<div className="stats">
								<h4>time (seconds): { time }</h4>
								<h4>wpm: { wpm }</h4>
								<h4>high score: { highScore }</h4>
						</div>
						<form onSubmit={ _handleSubmit }>
								<input type="text" autoFocus onChange={ _handleInput } value={ input } />
						</form>
						<br />
						<Button onClick={ reset }>reset</Button>
					</Card.Body>
				</Card>
			</div>
			<div className="score-card">
				{/* TODO: show a scorecard when a user finishes a test */}
			</div>
		</Container>
	);
};

export default Typer;