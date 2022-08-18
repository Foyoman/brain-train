import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/NewWordCss/NewWord.css';
import { Container, Card, Button } from 'react-bootstrap';
import { db } from '../firebase' // Fetch the database
import { collection, addDoc } from 'firebase/firestore' // Fetch 'collections' from the db, 'addDoc' allows you to add to the collections object
import { useAuth } from '../contexts/AuthContext' // Get the User - CurrentUser
import { indexOf, set } from 'lodash';


const NewWord = () => {
    const { currentUser } = useAuth(); // Set the current user 
    const scoresCollectionRef = collection(db, "scores"); // Gets the scores db
    const randomWords = require('random-words'); // Npm package that generates random word

    const [finalScore, setFinalScore ] = useState(0);
    const [start, setStart] = useState('Start');
    const [wordAlreadyEntered, setRepeatedWord] = useState('');
    const [phText, setPlaceHolderText] = useState('');
    const [isDisabled, setDisabled] = useState(false);
    const [level, setLevelUp] = useState(0);
    const [word, setWord] = useState('');
    const [time, setTime] = useState(10);
    const [running, setTimeLeft] = useState(false);
    const [collectionOfWordsTyped, setCollectionOfWords] = useState(['']);
    const [errorMessage, setErrorMessage] = useState('');
    const [GameOver, setGameOver] = useState('');


    //==========================================================================================================

    const postScore = async() => {
        await addDoc(scoresCollectionRef, {
            game: "New Word",
            score: finalScore, // Number of Words Entered
            user_id: currentUser ? currentUser.uid : "" ,
            user: currentUser ? currentUser.displayName : "Anonymous", 
        });
    };


    //=============================================================================================================
    
    const _handleStart = (e) => {
        e.preventDefault();
        restart(e);
        // console.log('TEST'e.target.value)
    }

    const restart = () => {
        setDisabled(false);
        setGameOver('');
        setErrorMessage('');
        setPlaceHolderText('');
        setRepeatedWord('');
        setFinalScore();
        setTime(10);
        setTimeLeft(false);
        fetchWord();
    }

    //=========================================================================================================

    const gameOverTextSelect = () => {
        const textOptions = ['Game Over Buddy','Little Bit Too slow','Getting Better','Another day, another dollar'];
        let randomIndex = Math.floor(Math.random () * textOptions.length );
        return textOptions[randomIndex];
    }
    
    //=================================================================================

    const fetchWord = () => {
        let newWord = randomWords(1); // This actually store the word in a variable
        axios(`https://api.dictionaryapi.dev/api/v2/entries/en/${newWord}`).then((response) => { 
            setWord(response.data[0].word);
        })
    }

    //==================================================================================
    
    const _handleEnter = async (e) => {
        let enteredWord = e.target.value;
        if(e.key === "Enter"){
            checkForText(enteredWord);
            axios(`https://api.dictionaryapi.dev/api/v2/entries/en/${enteredWord}`).then((response) => { // This part is actually just checking if the word exists in the database
                if( response.data[0].word && !collectionOfWordsTyped.includes(enteredWord) ){ // If a word is returned 
                    // fetchWord(); // This orders a new word every time you press enter, we dont want that, but im keeping incase someone does
                    //  console.log('TEST:'collectionOfWordsTyped)
                    addLevel()
                    setWord(enteredWord);
                    setCollectionOfWords([...collectionOfWordsTyped, enteredWord] );
                    resetTimeLeft();
                    increaseLevel(collectionOfWordsTyped);
                    e.target.value = '' ;
                } else if ( !response.data[0].word ){
                   console.log('Sorry Good sir this word is not in the dictionary of the api i am using');
                }
            }).catch(error => {
                setWord(word);
                setErrorMessage(`' ${enteredWord}' is not a word`);
                e.target.value = '' ;
                _handleChange(e.target.value);
            })
        }
    }

    //=========================================================================================================================

    
    //==========================================================================================================================

    const increaseLevel = (numberOfWords) => {
        let levelOne = numberOfWords.length >= 5 && numberOfWords.length < 8;
        let levelTwo = numberOfWords.length >= 8 && numberOfWords.length < 10;
        let levelThree = numberOfWords.length >= 10 && numberOfWords.length < 15;
        let levelFour = numberOfWords.length >= 15 && numberOfWords.length < 20;
        let levelFive = numberOfWords.length > 20;
        if(levelOne){
            return setTime(7);
        } else if (levelTwo){
            return setTime(5);
        } else if (levelThree){
            return setTime(3);
        } else if (levelFour){
            return setTime(2);
        } else if (levelFive) {
            setTimeLeft(false);
            setDisabled(true);
            setStart('Restart');
            setGameOver('You Win You Naughty Dingo, You can have my Baby!');
        } else {
            setTime(10);
        }
    }

    //==========================================================================================================================
    
    const resetTimeLeft = () => {
        setTime(10);
    }

    const addLevel = () => {
        return setLevelUp(level+1);
    }

    const checkForText = (inputFieldValue) => {
        if(inputFieldValue && _handleStart === false ){
            return setTimeLeft(false);
        }
    }

    const evaluateResult = () => {
        postScore();
    }
    //=================================================================================
    
    const _showWords = (e) => {
        e.preventDefault();
    }

    //=================================================================================

    let firstLetter = word.split('').slice(-1);

    const _handleChange = (e) => {
        let currentWordLastLetter = word.slice(-1);
        //const wordSplitLastLetter = e.target.value.split('').slice(0, 1)
        if(e.target.value[0] === currentWordLastLetter && e.target.value.length >= 1){
            setTimeLeft(true);
            setWord(word);
            setStart('Retry');
            setRepeatedWord('');
            setErrorMessage('');
         } else {
            console.log(`SECOND: ERROR TEST: Word must begin with a ${currentWordLastLetter}`);
            setTimeLeft(true);
         }
        } 
    
    //===========================================================================================

    // When a user types a letter in, start a Count down timer
    useEffect(() => {
        let timeLeft;
        if(running) { // If they have clicked reset and the word has appeared start a time
            timeLeft = setInterval(() => {
                setTime((currentTime) => currentTime - 1)
            }, 1000); // The time state decreases by 1
        } else if (!running) {
            clearInterval(timeLeft);
        }
        return() => clearInterval(timeLeft);
    }, [running]);

    //=========================================================================================================


    //========================================================================================================
    if (time <= 0) {
        setGameOver(gameOverTextSelect);
        setFinalScore(level);
        resetTimeLeft();
        setTimeLeft(false);
        setDisabled(true);
        setStart('Restart');
        setLevelUp(0);
        setCollectionOfWords(['']);
        
    }
    //console.log('TEST:'finalScore);

    //=========================================================================================================

    const Word = () => {
        return (
            <Container >
                <p> {time}: seconds</p>
                <p>Your Word is..</p>
                    <h1 className="wordDisplay">{word}</h1>
                <p>The Next word must start with <span className="color-letter-gold">{firstLetter}</span></p>
                <p>{wordAlreadyEntered}</p>
                <p className="error-message"> {errorMessage} </p>
                <Container>
                    <h1 className="color-green">{GameOver}</h1>
                </Container>
            </Container>
        )
    }

    return (
        <Container id="container " className="justify-content-center">
            <Card >   
                <Container id="inner-container">
                <h1 className="TwoEm">New Word</h1>
                    <Word />
                    <input type="Text" autoFocus onChange={ _handleChange } onKeyPress={ _handleEnter } placeholder={phText} disabled={isDisabled} ></input>
                    <form onSubmit={ _handleStart }  >
                        <button className='btn btn-danger'>{start}</button>
                    </form>
                </Container>
                <div className="moveBtnDisplayUp">
                    <form onSubmit={ _showWords }>
                        <button className='btn '>{collectionOfWordsTyped.length - 1}</button>
                        <p>{collectionOfWordsTyped + ''}</p>
                    </form>
                    { finalScore ? <button className="btn btn-warning OneFiveEm " onClick={ evaluateResult }> Log Score <p>{finalScore}</p></button>  : '' }
                </div>
                
            </Card>
        </Container>
    )
}

export default NewWord 