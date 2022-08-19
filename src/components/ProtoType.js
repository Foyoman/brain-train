import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, Button, Container, ButtonGroup } from 'react-bootstrap';
import _ from 'lodash';
import '../styles.css';
import { db } from '../firebase'
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from '../contexts/AuthContext'
import english_1000 from './lib/words_english_1000.json';

const ProtoType = () => {
	const { currentUser } = useAuth()
	const scoresCollectionRef = collection(db, "scores")

	const inputRef = useRef(null);

	const [quote, setQuote] = useState('');
	const [input, setInput] = useState('');
	const [time, setTime] = useState(0);
	const [chars, setChars] = useState(0); 
	const [wpm, setWpm] = useState(0); 
	const [runningA, setRunningA] = useState(false);
	const [runningB, setRunningB] = useState(true);
	const [runningC, setRunningC] = useState(false);
	const [startTime, setStartTime] = useState(0);
	const [elapsed, setElapsed] = useState(0);
	const [pastInput, setPastInput] = useState('');
	const [restOfQuote, setRestOfQuote] = useState('');
	const [restOfCurrentWord, setRestOfCurrentWord] = useState('');
	const [currentWordInput, setCurrentWordInput] = useState('');
	const [caret, setCaret] = useState('transparent');
	const [currentWordQuoteIndex, setCurrentWordQuoteIndex] = useState(0);
	const [rawInput, setRawInput] = useState('');
	const [words, setWords] = useState(25);
	const [accuracy, setAccuracy] = useState(0);
	const [strokes, setStrokes] = useState(0);
	const [gameState, setGameState] = useState('start');

	const postScore = async () => {
		await addDoc(scoresCollectionRef, {
			game: "Proto-Type",
			score: wpm,
			accuracy: accuracy,
			time: elapsed,
			words: words,
			user_id: currentUser ? currentUser.uid : "",
			user: currentUser ? currentUser.displayName : "Anonymous",
		});
	}

	useEffect(() => {
		let interval;
		if (runningA) {
			interval = setInterval(() => {
				setTime((prevTime) => prevTime + 1);
			}, 1000); 
		} else if (!runningA) {
			clearInterval(interval); // 
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

	useEffect(() => {
		let interval;
		if (runningC) {
			interval = setInterval(function() {
				let elapsedTime = Date.now() - startTime;
				setElapsed((elapsedTime / 1000).toFixed(1));
			}, 10);
		} else if (!runningC) {
			clearInterval(interval)
		}
		return () => clearInterval(interval);
	}, [runningC])



	const calculateWPM = () => {
		setWpm(Math.floor((chars / 5) * 60 / time) || 0); 
	}

	const fetchQuote = () => {
		// axios("https://api.kanye.rest/").then((response) => { // a quote by kanye west
		// 		setQuote(response.data.quote.toLowerCase());
		// });
		const sample = _.sampleSize(english_1000, words).join(' ')
		setQuote(sample);
		setRestOfQuote(sample);
	}

	const _handleSubmit = (e) => {
		e.preventDefault();
		setRunningA(false);  
		setInput(''); 
		fetchQuote();
	}

	const _handleInput = (e) => {
		const quoteByWord = quote.split(' ');
		const currentWord = quoteByWord[currentWordQuoteIndex]
		const currentLetter = currentWord[e.target.value.length - 1]
		const currentInputWord = e.target.value
		const ultimateWordInput = e.target.value;
		const ultimateWordQuote = quoteByWord[currentWordQuoteIndex]

		if (!input) {
			setStartTime(Date.now());
			setRunningC(true);
		}
		
		if (gameState === 'start') {
			setCurrentWordInput(currentWord.slice(0, currentInputWord.length) + currentInputWord.slice(currentWord.length));

			if (e.target.value) {
				setRestOfCurrentWord(currentWord.slice(currentInputWord.length, currentWord.length))
				setRestOfQuote(quoteByWord.slice(currentWordQuoteIndex + 1, quoteByWord.length).join(' '))
			}

			if (e.target.value.length <= 0) {
				setRestOfCurrentWord(quoteByWord[currentWordQuoteIndex])
				setRestOfQuote(quoteByWord.slice(currentWordQuoteIndex + 1, quoteByWord.length).join(' '))
			}
			
			if (e.target.value === " ") {
				setInput('');
				e.target.value = "";
				setCurrentWordInput('');
				setRestOfCurrentWord(ultimateWordQuote);
			}

			if (_.last(e.target.value) === " " && e.target.value.length > 0) {
				const trimmed = e.target.value.trim()
				setRawInput(`${rawInput} ${trimmed}`)
				e.target.value = ""
				setCurrentWordInput("")
				setRestOfCurrentWord(quoteByWord[currentWordQuoteIndex + 1])
				setCurrentWordQuoteIndex(currentWordQuoteIndex + 1)
				setRestOfQuote(quoteByWord.slice(currentWordQuoteIndex + 2, quoteByWord.length).join(' '))
				if (ultimateWordInput.length === ultimateWordQuote.length) {
					setPastInput(`${pastInput} ${ultimateWordQuote}`);
				} else if (ultimateWordInput.length < ultimateWordQuote.length) {
					setPastInput(`${pastInput} ${ultimateWordQuote}`);
				} else {
					const inputWithTypos = ultimateWordQuote.slice(0, ultimateWordInput.length) + ultimateWordInput.slice(ultimateWordQuote.length);
					setPastInput(`${pastInput} ${inputWithTypos}`);
				}

				if (words === rawInput.split(' ').length) {
					setGameState('results');
					setAccuracy((chars / strokes * 100).toFixed(2))
				}
			}

			if (_.last(e.target.value) === currentLetter) { 
				setChars(chars + 1); 
				setStrokes(strokes + 1);
			} else {
				setStrokes(strokes + 1);
			}

			calculateWPM();
			setRunningA(true); 
			setInput(e.target.value);
		} 
	}

	if (quote.split(' ')[words - 1] === input) {
		setInput('');
		setGameState('results');
		setAccuracy((chars / strokes * 100).toFixed(2));
		setRunningC(false);
	}

	const focusInput = (e) => {
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		inputRef.current.focus();
		setRunningB(true);
	}

	const blurInput = () => {
		inputRef.current.blur();
		setRunningB(false);
		setCaret('transparent')
	}

	const reset = () => {
		setGameState('start');
		fetchQuote();
		setInput('');
		setTime(0);
		setChars(0);
		setWpm(0);
		setRunningA(false);
		setPastInput('');
		setRestOfCurrentWord('');
		setCurrentWordInput('');
		setCurrentWordQuoteIndex(0);
		setRawInput('');
		setStrokes(0);
		setChars(0);
		setRunningC(false);
		setElapsed(0);
	}

	const resetAndFocus = (e) => {
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		reset();
		inputRef.current.focus();
		setRunningB(true);
	}

	const setWordCount = (e) => {
		setWords(Number(e.target.value));
		reset();
		setRunningB(true);
		const sample = _.sampleSize(english_1000, e.target.value).join(' ')
		setQuote(sample);
		setRestOfQuote(sample);
		inputRef.current.focus();
	}

	const resultButton = () => {
		reset();
		postScore();
		inputRef.current.focus();
		setRunningB(true);
	} 

	useEffect(() => {
		const sample = _.sampleSize(english_1000, words).join(' ')
		setQuote(sample);
		setRestOfQuote(sample);
	}, []);

	return (
		<div
			style={{
				minHeight: '110vh',
				marginTop: '-20vh',
				paddingTop: '20vh'
			}}
			onClick={blurInput}	
		>
			<Container
				className="d-flex mt-5 align-items-center justify-content-center text-center"
				style={{ minHeight: "20vh", marginTop: "1em" }}
			>
				<div className='w-100'>
					<Card>
						<Card.Body>
							<h1>⌨️ Proto-Type</h1>
							<br />

							<div className='d-flex justify-content-between'>
								<h3>{ elapsed }</h3>
								<ButtonGroup className='mb-3'>
									<Button onClick={ setWordCount } value='25' variant={ words === 25 ? 'secondary' : 'outline-secondary' } style={{ borderRight: '1px' }}>25</Button>
									<Button onClick={ setWordCount } value='50' variant={ words === 50 ? 'secondary' : 'outline-secondary' }>50</Button>
									<Button onClick={ setWordCount } value='100' variant={ words === 100 ? 'secondary' : 'outline-secondary' } style={{ borderLeft: '1px' }}>100</Button>
								</ButtonGroup>
							</div>

							<form onSubmit={_handleSubmit}>
								<input id='words-input' ref={inputRef} type="text" autoFocus onChange={_handleInput} value={input} autoComplete="off" />
							</form>

							{ gameState !== 'results' ?
								<div onClick={focusInput} className='quote mt-2'>
									<div>
										<h3 className={`inline`}>
											{ pastInput.split(' ').filter(e => String(e).trim()).map((word, i) => { 
												return (
													<span key={i}>
														{ word.split('').map((letter, j) => {
															return (
																<span 
																	key={j} 
																	className={ rawInput.trim().split(' ')[i][j] !== quote.split(' ')[i][j] ? 'red' : j > quote.split(' ')[i].length ? "red" : 'green' }
																>
																	{ letter }
																</span>
															)
														}) }{" "}
													</span>
												)
											}) }
										</h3> 

										<h3 className='inline'>	
											{ currentWordInput.split('').map((letter, i) => {
												return (
													<span 
														key={i} 
														className={ input[i] !== letter ? 'red' : i >= quote.split(' ')[currentWordQuoteIndex].length ? 'red' : 'green' }
													>
														{ letter }
													</span>
												)
											}) }
										</h3>
										
										<h3 className={`${caret} inline restOfWordQuote`}>
											{restOfCurrentWord + " " + restOfQuote}
										</h3>
									</div>
								</div>
							:  
								<div className='d-flex align-items-center justify-content-center h-100'>
									<Button
										onClick={ resultButton }
										className='text-center btn btn-primary'
										style={{ padding: '1em' }}
									>
										<h2 className='mb-0'>WPM: { wpm }</h2>
										<p className='mb-1' style={{ fontSize: '20px' }}><strong>Press to log score</strong></p>
										Accuracy: { accuracy }%
									</Button>
								</div>
							}
							<br />
							<ButtonGroup>
								<Button onClick={resetAndFocus}>Reset</Button>
								<Button onClick={focusInput}>Focus</Button>
							</ButtonGroup>
						</Card.Body>
					</Card>
				</div>
			</Container>
			{ input === 'sei54' ? 
				<h2 className='text-center' style={{padding: '2em'}}>Thank you Joel 💕 Thank you Loden 😍 And thanks to the rest of the class for being so cool 😎</h2>
			: "" }
		</div>
	);
};

export default ProtoType;