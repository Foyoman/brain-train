import React, { Component } from 'react';
import axios from 'axios';
import wordsListPath from 'word-list';

// const fs = require('fs');
// const wordListPath = require('word-list');

// const wordArray = fs.readFileSync(wordsListPath, 'utf-8').split('\n');



const NewWord = () => {
    const randomWords = require('random-words'); // Npm package that generates random word
     
    const [chars, setChars] = useState(0);
    const [word, setWord] = useState('')
    const [time, setTime] = useState(10);
    const [running, setTimeLeft] = useState(false)

    
    
    //=================================================================================
    // Need this for every time a user clicks reset
    const _handleSubmit = (e) => {
        e.preventDefault();
        const wordToType = word;
        fetchWord()
    }
    
    //=================================================================================
    // Generates a randomWord
    const fetchWord = () => {
        let newWord = randomWords(1) // This actually store the word in a variable
        axios(`https://api.dictionaryapi.dev/api/v2/entries/en/${newWord}`).then((response) => { 
            setWord(response.data[0].word)
        })
    }

    //=================================================================================
    
    //console.log(word)

    const firstLetter = word.split('').slice(-1);
    const lastLetter = word.split('').slice(0,1);

    const _handleText = (e) => {
        let currentWordLastLetter = word.slice(-1)
        const wordSplitLastLetter = e.target.value.split('').slice(0, 1)
        if(e.target.value == firstLetter){
             setChars(chars + 1)
             console.log(`TEST: The last letter of the last word and the first letter of your word is...${wordSplitLastLetter}`)
         } else {
             console.log(`Word must begin with a ${currentWordLastLetter}`)
         }
    }

    // const NextWord = () => {
    //     return (
    //         <div>
    //             Next....
    //             {lastLetter} <input type="text"></input>
    //         </div>
    //     )
    // }

    //Start a Count down timer
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

// If the person starts typing and if the firstLetter of the word they typed begins 
// With the last letter of the last word...

    const Word = () => {
        return (
            <div>
                <p> {time}: seconds</p>
                <p>Your Word is..</p>
                    <h1>{word}</h1>
                <p>The Next word must start with a {firstLetter}</p>
            </div>
        )
    }


    return (
        <div>
         <Word />
         <input type="Text" autoFocus onChange={ _handleText } ></input>
            <form onSubmit={ _handleSubmit } >
                <button>Reset</button>
            </form>
        </div>
    )
}

export default NewWord 