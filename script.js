let wordList = [];
const wordNum = 200;
window.gameStart = null;
let time = 30;
let timerDiv = document.getElementById('timer');
let countdownStarted = false;
let correctWords = 0;
let countdown;
let totalKeyPresses = 0;
let correctKeyPresses = 0;



function calculateCorrectWords() {
    const words = document.querySelectorAll('.word');
    const currentWord = document.querySelector('.word.current');
    let correctCount = 0;
    let correctChars = 0;
    let totalChars = 0;

    for (let word of words) {
        if (word === currentWord) break;
        
        const letters = word.querySelectorAll('.letter');
        totalChars += letters.length + 1;
        
        const allCorrect = Array.from(letters).every(letter => letter.classList.contains('correct'));
        
        if (allCorrect) {
            correctCount++;
            correctChars += letters.length + 1;
        }
    }

    return { correctCount, correctChars, totalChars };
}

function calculateWPM() {
    const correctWords = calculateCorrectWords().correctCount;
    const elapsedSeconds = window.gameStart ? Math.max(1, Math.round((Date.now() - window.gameStart) / 1000)) : time;
    const timeInMinutes = elapsedSeconds / 60; 
    const wpm = Math.round((correctWords / timeInMinutes) * 10) / 10; 
    return wpm;
}

function calculateAccuracy() {
    return totalKeyPresses > 0 ? Math.round((correctKeyPresses / totalKeyPresses) * 1000) / 10 : 0;
}

function displayResult() {
    const wpm = calculateWPM();
    const accuracy = calculateAccuracy();
    const { correctChars, totalChars } = calculateCorrectWords();
    const resultDiv = document.getElementById('results');
    resultDiv.innerHTML = `
        <h2>Your typing results:</h2>
        <p>WPM: ${wpm}</p>
        <p>Accuracy: ${accuracy}%</p>
        <p>Characters: ${correctChars} / ${totalChars}</p>
    `;
}


function randWords(words) {
    const length = Array.isArray(words) ? words.length : 0;
    if (length === 0) return '';
    const index = Math.floor(Math.random() * length);
    return words[index] || '';
}

function displayWords(words) {
    const element = document.getElementById("words");
    element.innerHTML = '';
    for(let i = 0; i < wordNum; i++) {
        const chosen = randWords(words);
        element.innerHTML += `<div class="word"><span class="letter">${chosen.split('').join('</span><span class="letter">')}</span></div>`;
    }
    const firstWord = document.querySelector(".word");
    const firstLetter = firstWord.querySelector(".letter");
    setClass(firstWord, "current");
    setClass(firstLetter, "current");
    }


function setClass(elName, clName) {
    if (!elName) return;
    elName.classList.add(clName);
}

function removeClass(elName, clName) {
    if (!elName) return;
    elName.classList.remove(clName);
}

const startTimer = () => {
    if (countdownStarted) return; 
    countdownStarted = true;
    if (!window.gameStart) {
        window.gameStart = Date.now();
    }
    if (!timerDiv) timerDiv = document.getElementById('timer');
    let endTime = Date.now() + time * 1000;

    countdown = setInterval(() => {
        let remaining = Math.round((endTime - Date.now()) / 1000);
        if (!timerDiv) timerDiv = document.getElementById('timer');
        if (timerDiv) timerDiv.textContent = remaining > 0 ? remaining : 0;
        if (remaining <= 0) {
            clearInterval(countdown);
            setClass(document.querySelector('#game'), 'over');
            displayResult(); 
        }
    }, 100);
};


fetch('./1000-most-common-words.txt')
.then((res) => res.text()) 
.then((text) => {
    wordList = text.split('\n');
    displayWords(wordList);

})
.catch((e) => console.log(e))



function newGame() {

    clearInterval(countdown);
    countdownStarted = false;
    if (!timerDiv) timerDiv = document.getElementById('timer');
    if (timerDiv) timerDiv.textContent = time;
    window.gameStart = null;


    totalKeyPresses = 0;
    correctKeyPresses = 0;


    const gameArea = document.getElementById("game");
    removeClass(gameArea, 'over');
    

    document.getElementById("results").innerHTML = '';

    displayWords(wordList);


    gameArea.focus();
}


document.getElementById("restart").addEventListener("click", newGame);


document.getElementById("game").addEventListener("keyup", (ev) => {
    const key = ev.key;
    const currentLetter = document.querySelector(".letter.current");
    const currentWord = document.querySelector(".word.current");
    const expected = currentLetter?.innerHTML || ' ';


    if(document.querySelector('#game.over')){ 
        return ;
    }
    if (key.length === 1 && key !== ' ') {
        totalKeyPresses++;
        if (key === expected) {
            correctKeyPresses++;
        }
    }
    if (key !== " " && key.length === 1) {
        startTimer();
        if (currentLetter) {
            setClass(currentLetter, key === expected ? 'correct' : 'incorrect');
            removeClass(currentLetter, 'current');
            if (currentLetter.nextSibling) {
                setClass(currentLetter.nextSibling, 'current');
            } 
            
        }
    } else if (key === ' ') {
            if (expected !== ' ') {
            const incorrectLetters = [...document.querySelectorAll('.word.current .letter:not(.correct)')]
            for (let letter of incorrectLetters) {
                setClass(letter, 'incorrect');
            }

        }
        removeClass(currentWord, 'current');
        const nextWord = currentWord?.nextElementSibling;
        if (nextWord) {
            setClass(nextWord, 'current');
            if (currentLetter) {
                removeClass(currentLetter, 'current');
            }
            setClass(nextWord.firstChild, 'current');
        } else {
            setClass(document.querySelector('#game'), 'over');
            clearInterval(countdown);
            displayResult();
        }
    }
    else if (key === 'Backspace') {

        if (currentLetter && (currentLetter === currentWord.firstChild) && (currentWord !== document.querySelector('.word'))) {
            removeClass(currentWord, "current");
            setClass(currentWord.previousSibling, 'current');
            removeClass(currentLetter, 'current');
            setClass(currentWord.previousSibling.lastChild, 'current');
            removeClass(currentWord.previousSibling.lastChild, 'correct');
            removeClass(currentWord.previousSibling.lastChild, 'incorrect');
        }
        else if (currentLetter && !(currentLetter === currentWord.firstChild)) {
            removeClass(currentLetter, 'current');
            setClass(currentLetter.previousSibling, 'current');
            removeClass(currentLetter.previousSibling, 'correct');
            removeClass(currentLetter.previousSibling, 'incorrect');

        }
        else if (!currentLetter) {
            setClass(currentWord.lastChild, 'current');
            removeClass(currentWord.lastChild, 'incorrect');
            removeClass(currentWord.lastChild, 'correct');
        }
    }

    const activeWord = document.querySelector('.word.current');
    if(activeWord && activeWord.getBoundingClientRect().top > 250) {
        const words = document.getElementById('words');
        const margin = Number.parseInt(words.style.marginTop || '0px');
        words.style.marginTop = `${margin - 35}px`
    }
}
);


