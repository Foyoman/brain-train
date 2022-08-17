import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, Button, Container } from 'react-bootstrap';
import _ from 'lodash';
import '../styles.css';
import { db } from '../firebase'
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from '../contexts/AuthContext'
import english_1000 from './lib/words_english_1000.json';

const Typer = () => {
	const { currentUser } = useAuth()
	const scoresCollectionRef = collection(db, "scores")

	const inputRef = useRef(null);

	const [quote, setQuote] = useState('');
	const [input, setInput] = useState('');
	const [style, setStyle] = useState('');
	const [time, setTime] = useState(15);
	const [timer, setTimer] = useState(15); // default timer 
	const [chars, setChars] = useState(0); // sets total amount of characters a user has typed
	const [wpm, setWpm] = useState(0); // wpm = (chars / 5) * 60 / time
	const [runningA, setRunningA] = useState(false);
	const [runningB, setRunningB] = useState(false);
	const [pastInput, setPastInput] = useState('')
	const [restOfQuote, setRestOfQuote] = useState('')
	const [restOfCurrentWord, setRestOfCurrentWord] = useState('')
	const [currentWordInput, setCurrentWordInput] = useState('')
	const [caret, setCaret] = useState('transparent')

	const postScore = async () => {
		await addDoc(scoresCollectionRef, {
			game: "Proto-Type", 
			timer: timer, 
			score: wpm, 
			user_id: currentUser ? currentUser.uid : "" ,
			user: currentUser ? currentUser.displayName : "Anonymous", 
		});
	}

	useEffect(() => {
		let interval;
		if (runningA) { // if the runningA state is true, start the timer
			interval = setInterval(() => {
				setTime((prevTime) => prevTime - 1);
			}, 1000); // the time state increments by 1 every second
		} else if (!runningA) {
			clearInterval(interval); // stop the interval if runningA is false
		}
		return () => clearInterval(interval);
	}, [runningA]);

	useEffect(() => {
		let interval;
		let i = 0;
		if (runningB) {
			interval = setInterval(() => {
				if (i % 3 === 0) {
					setCaret('transparent');
					i++;
				} else if (i % 3 !== 0) {
					setCaret('opaque');
					i++;
				}
			}, 400); 
		} else if (!runningB) {
			clearInterval(interval);
		}
		return () => clearInterval(interval);
	}, [runningB]);



	const calculateWPM = () => {
		setWpm(Math.floor((chars / 5) * 60 / (15 - time)) || 0); // words per minute is the total characters typed correctly divided by 5 times 60 divided by the total seconds elapsed
	}

	const fetchQuote = () => {
		// axios("https://api.kanye.rest/").then((response) => { // a quote by kanye west
		// 		setQuote(response.data.quote.toLowerCase());
		// });
		setQuote(_.sampleSize(english_1000, 100).join(' '));
	}

	const _handleSubmit = (e) => {
		e.preventDefault();
		setRunningA(false); // stops the timer 
		setInput(''); // clears input
		fetchQuote();
	}

	if (input === quote && input.length > 0) { // auto submits if the input matches the entire quote
		setRunningA(false);
		setInput('');
		fetchQuote();
	}  

	const _handleInput = (e) => {

		// if (_.last(e.target.value) === " ") {
		// 	console.log('spaceinput')
		// 	setInput('')
		// }
		
		const quoteByChar = quote.split('').slice(0, e.target.value.length).join(''); // slices the quote to the current length of the input
		
		const inputByWord = e.target.value.split(' ')
		const quoteByWord = quote.split(' ');
		const currentWord = quoteByWord[inputByWord.length - 1]
		
		const currentInputWord = _.last(inputByWord)
		setCurrentWordInput(_.last(inputByWord))
		
		setRestOfCurrentWord(currentWord.slice(currentInputWord.length, currentWord.length))

		// const pastInput = inputByWord.slice(0, inputByWord.length - 1).join(' ')
		setPastInput(inputByWord.slice(0, inputByWord.length - 1).join(' '))

		// const restOfQuote = quoteByWord.slice(inputByWord.length, quoteByWord.length).join(' ');
		setRestOfQuote(quoteByWord.slice(inputByWord.length, quoteByWord.length).join(' '))		
		

		if (e.target.value === quoteByChar) { // to be compared with the input
			setChars(chars + 1); // only add to the char count on a correct keystroke
			setStyle('green')
		} else {
			setStyle('red')
		}
		calculateWPM(); 
		setRunningA(true); // starts the timer when a user starts typing
		setInput(e.target.value); // asynchronous
	}


	const focusInput = () => {
		inputRef.current.focus();
		setRunningB(true);
	}


	const reset = () => {
		fetchQuote();
		setInput('');
		setStyle('');
		setTime(8888888888);
		setChars(0);
		setWpm(0);
		setRunningA(false);
	}

	if (time === 0) {
		const finalWpm = Math.floor((chars / 5) * 60 / (15 - time)) || 0
		reset();
		postScore();
	}

	useEffect(fetchQuote, []); // load one quote at page load(en)

	useEffect(() => {
		// axios("https://random-word-api.herokuapp.com/all").then((response) => {
		// 		console.log(_.sample(response.data, 5)); // this should give me an array of 5 random words but it don't
		// });
		setQuote(_.sampleSize(english_1000, 100).join(' '))
	}, []);

	// debugger

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
						
						{pastInput ? "true" : "false"}
						{currentWordInput ? "true" : "false"}
						{restOfCurrentWord ? "true" : "false"}
						{restOfQuote ? "true" : "false"}
						
						<div onClick={ focusInput } className={ `${style} quote` }>
							{/* { miracle ? miracle : quote } */}
							{/* { pastInput + " " + currentDynamicWord + " " + restOfQuote } */}
							{ restOfQuote ?
								<div>
									<h3 className={`${caret} inline`}>{ pastInput + " " + currentWordInput }</h3>
									<h3 className='inline'>{ restOfCurrentWord + " " + restOfQuote }</h3>
								</div>
							: 
								<div>
									<div className={`${caret} inline`}></div>
									<h3>{ quote }</h3>
								</div> 
							}
							
						</div>

						<br />
						<div className="stats">
								<h4>time (seconds): { time }</h4>
								<h4>wpm: { wpm }</h4>
						</div>
						<form onSubmit={ _handleSubmit }>
								<input id='words-input' ref={ inputRef } id="words-input" type="text" autoFocus onChange={ _handleInput } value={ input } autoComplete="off" />
						</form>
						<br />
						<Button onClick={ reset }>reset</Button>
						<Button onClick={ focusInput }>Focus</Button>
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