import React, { useState, useEffect } from 'react';
import axios from 'axios';



// const fs = require('fs');
// const wordListPath = require('word-list');

// const wordArray = fs.readFileSync(wordsListPath, 'utf-8').split('\n');

const NewWord = () => {
    const randomWords = require('random-words'); // Npm package that generates random word
     
    //const [updatedWord, setUpdatedWord] = useState('')
    const [chars, setSpeed] = useState(0);
    const [isDisabled, setDisabled] = useState(false)
    const [level, setLevelUp] = useState(0);
    const [word, setWord] = useState('');
    const [time, setTime] = useState(10);
    const [running, setTimeLeft] = useState(false);
    const [collectionOfWordsTyped, setCollectionOfWords] = useState(['easter','egg']);
    const [errorMessage, setErrorMessage] = useState('');
    const [GameOver, setGameOver] = useState('')
   
    //=================================================================================
    // Need this for every time a user clicks reset
    const _handleStart = (e) => {
        e.preventDefault();
        setDisabled(false);
        setGameOver('');
        setErrorMessage('')
        const wordToType = word;
        //console.log(e.target.value)
        fetchWord()
    }

    const gameOverTextSelect = () => {
        const textOptions = ['Game Over Buddy','Little Bit Too slow','Getting Better','Another day, another dollar']
        let randomIndex = Math.floor(Math.random () * textOptions.length )
        return textOptions[randomIndex]
    }
    
    //=================================================================================
    // Generate a randomWord
    const fetchWord = () => {
        let newWord = randomWords(1) // This actually store the word in a variable
        axios(`https://api.dictionaryapi.dev/api/v2/entries/en/${newWord}`).then((response) => { 
            setWord(response.data[0].word)
        })
    }

    //==================================================================================

    //let typedWordLastLetter = collectionOfWordsTyped.split('').slice(-1)

    const _handleEnter = async (e) => {
        let enteredWord = e.target.value
        //let collectionOfWordsTyped = []
        if(e.key === "Enter"){
            setWord(e.target.value)
            axios(`https://api.dictionaryapi.dev/api/v2/entries/en/${enteredWord}`).then((response) => { // This part is actually just checking if the word exists in the database
                if( response.data[0].word ){ // If a word is returned 
                    setCollectionOfWords(current => [...current, enteredWord] )
                    resetTimeLeft();
                    // fetchWord(); // This orders a new word every time you press enter, we dont want that
                    // collectionOfWordsTyped.push(enteredWord)
                    console.log(collectionOfWordsTyped)
                    //firstLetter = firstLetter
                    e.target.value = ''
                    addLevel()
                } else if (!response.data[0].word ){
                    console.log(`Time is up bitch`)
                }
            }).catch(error => {
                setWord('')
                setErrorMessage(`${enteredWord} is not a real word`)
            })
            console.log()
        }
    }
    
    const resetTimeLeft = () => {
        setTime(10)
    }

    const addLevel = () => {
        return setLevelUp(level+1)
    }

    //=================================================================================

    let firstLetter = word.split('').slice(-1);
    const lastLetter = word.split('').slice(0,1);


    const _handleChange = (e) => {
        let currentWordLastLetter = word.slice(-1)
        //const wordSplitLastLetter = e.target.value.split('').slice(0, 1)
        if(e.target.value[0] === currentWordLastLetter && e.target.value.length >= 1){
            setTimeLeft(true);
            setWord(word)
         } else {
            console.log(`SECOND: ERROR TEST: Word must begin with a ${currentWordLastLetter}`);
            setTimeLeft(true);
            //setTimeout(() => setErrorMessage(`Word must begin with a ${currentWordLastLetter}`),1000)
            //setTimeout(() => setTimeLeft(false, 500))
         }
        } 
    
    // When a user types a letter it, starts a Count down timer,
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


    if (time <= 0) {
        setGameOver(gameOverTextSelect)
        resetTimeLeft()
        setTimeLeft(false)
        setDisabled(true)
        setLevelUp(0);
        setCollectionOfWords([''])
    }


// If the person starts typing and if the firstLetter of the word they typed begins 
// With the last letter of the last word...

    const Word = () => {
        return (
            <div>
                <p> {time}: seconds</p>
                <p>Your Word is..</p>
                    <h1 className="wordAndErrorDisplay">{word}</h1>
                <p>The Next word must start with {firstLetter}</p>
                <p className="error-message"> {errorMessage} </p>
                <div>
                    <h1>{GameOver}</h1>
                </div>
            </div>
        )
    }

    return (
        <div>
         <Word />
         <input type="Text" autoFocus onChange={ _handleChange } onKeyPress={ _handleEnter } disabled={isDisabled} ></input>
            <form onSubmit={ _handleStart }  >
                <button>Start</button>
            </form>
        </div>
    )
}

export default NewWord 