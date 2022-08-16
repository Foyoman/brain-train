import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/NewWordCss/NewWord.css';
import { Container, Card, Button } from 'react-bootstrap'
import { set } from 'lodash';


const NewWord = () => {
    const randomWords = require('random-words'); // Npm package that generates random word
     
    const [start, setStart] = useState('Start')
    const [wordAlreadyEntered, setRepeatedWord] = useState('')
    const [allWords, setAllWordsTyped] = useState('')
    const [phText, setPlaceHolderText] = useState('')
    const [isDisabled, setDisabled] = useState(false)
    const [level, setLevelUp] = useState(0);
    const [word, setWord] = useState('');
    const [time, setTime] = useState(10);
    const [running, setTimeLeft] = useState(false);
    const [collectionOfWordsTyped, setCollectionOfWords] = useState(['easter','egg','| ']);
    const [errorMessage, setErrorMessage] = useState('');
    const [GameOver, setGameOver] = useState('')
   
    //=================================================================================
    
    const _handleStart = (e) => {
        e.preventDefault();
        setDisabled(false);
        setGameOver('');
        setErrorMessage('')
        setPlaceHolderText('')
        setRepeatedWord('')
        setAllWordsTyped('')
        setTime(10)
        fetchWord()
        // TEST: console.log(e.target.value)
    }

    //=========================================================================================================

    const gameOverTextSelect = () => {
        const textOptions = ['Game Over Buddy','Little Bit Too slow','Getting Better','Another day, another dollar']
        let randomIndex = Math.floor(Math.random () * textOptions.length )
        return textOptions[randomIndex]
    }
    
    //=================================================================================

    const fetchWord = () => {
        let newWord = randomWords(1) // This actually store the word in a variable
        axios(`https://api.dictionaryapi.dev/api/v2/entries/en/${newWord}`).then((response) => { 
            setWord(response.data[0].word)
        })
    }

    //==================================================================================

    const _handleEnter = async (e) => {
        let enteredWord = e.target.value
        //let collectionOfWordsTyped = []
        if(e.key === "Enter"){
            setWord(enteredWord)
            axios(`https://api.dictionaryapi.dev/api/v2/entries/en/${enteredWord}`).then((response) => { // This part is actually just checking if the word exists in the database
                if( response.data[0].word ){ // If a word is returned 
                    setCollectionOfWords(current => [...current, enteredWord + ' | '] )
                    resetTimeLeft();
                    // fetchWord(); // This orders a new word every time you press enter, we dont want that, but im keeping incase someone does
                    // TEST: console.log(collectionOfWordsTyped)
                    increaseLevel(collectionOfWordsTyped)
                    addLevel()
                    wordRepeated(enteredWord)
                    e.target.value = ''
                } else if (!response.data[0].word ){
                    console.log(`This Word is not included in the api dictionary, sorry`)
                }
            }).catch(error => {
                setWord('')
                setErrorMessage(`${enteredWord} is not a real word`)
            })
        }
    }

    //=========================================================================================================================

    const wordRepeated = (theNewWordEntered) => {
        for(let i = 0; i < collectionOfWordsTyped.length; i++){
            if(theNewWordEntered === collectionOfWordsTyped[i]){
                removeLevel()
                //console.log(level)
                return setRepeatedWord('You already Entered this word, You lose a level for that!')
            } else {
                addLevel()
            }
        }
    }

    //==========================================================================================================================

    const increaseLevel = (numberOfWords) => {
        let levelOne = numberOfWords.length >= 5 && numberOfWords.length < 8
        let levelTwo = numberOfWords.length >= 8 && numberOfWords.length < 10
        let levelThree = numberOfWords.length >= 10 && numberOfWords.length < 15
        let levelFour = numberOfWords.length >= 15 && numberOfWords.length < 20
        let levelFive = numberOfWords.length > 20
        if(levelOne){
            return setTime(7)
        } else if (levelTwo){
            return setTime(5)
        } else if (levelThree){
            return setTime(3)
        } else if (levelFour){
            return setTime(2)
        } else if (levelFive) {
            setTimeLeft(false);
            setDisabled(true)
            setStart('Restart')
            setGameOver('You Win You Naughty Dingo, You can have my Baby!')
        } else {
            setTime(10);
        }
    }

    //==========================================================================================================================
    
    const resetTimeLeft = () => {
        setTime(10)
    }

    const removeLevel = () => {
        return setLevelUp(level-1)
    }

    const addLevel = () => {
        return setLevelUp(level+1)
    }

    const checkForText = (inputFieldValue) => {
        if(inputFieldValue && _handleStart === false ){
            return setTimeLeft(false)
        }
    }
    //=================================================================================
    
    const _showWords = (e) => {
        e.preventDefault()
        return setAllWordsTyped(collectionOfWordsTyped)
    }

    //=================================================================================

    let firstLetter = word.split('').slice(-1);

    const _handleChange = (e) => {
        let currentWordLastLetter = word.slice(-1)
        //const wordSplitLastLetter = e.target.value.split('').slice(0, 1)
        if(e.target.value[0] === currentWordLastLetter && e.target.value.length >= 1){
            setTimeLeft(true);
            setWord(word)
            setStart('Reset')
            setRepeatedWord('')
            checkForText(e.target.value)
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

    if (time <= 0) {
        setGameOver(gameOverTextSelect)
        resetTimeLeft()
        setTimeLeft(false)
        setDisabled(true)
        setStart('Restart')
        setLevelUp(0);
        setCollectionOfWords([' '])
    }

    //=========================================================================================================

    const Word = () => {
        return (
            <Container >
                <p> {time}: seconds</p>
                <p>Your Word is..</p>
                    <h1 className="wordDisplay">{word}</h1>
                <p>The Next word must start with <span class="color-letter-gold">{firstLetter}</span></p>
                <p>{wordAlreadyEntered}</p>
                <p className="error-message"> {errorMessage} </p>
                <Container>
                    <h1 class="color-green">{GameOver}</h1>
                </Container>
            </Container>
        )
    }

    return (
        <Container id="container" class="justify-content-center">
            <Card >   
                <Container id="inner-container">
                    <Word />
                    <input type="Text" autoFocus onChange={ _handleChange } onKeyPress={ _handleEnter } placeholder={phText} disabled={isDisabled} ></input>
                        <form onSubmit={ _handleStart }  >
                        <button class='btn btn-danger'>{start}</button>
                    </form>
                </Container>
                <div>
                    <form onChange={ _showWords }>
                        <button class='btn btn-lg'>{collectionOfWordsTyped.length - 2}</button>
                        <p>{collectionOfWordsTyped}</p>
                    </form>
                </div>
            </Card>
        </Container>
    )
}

export default NewWord 