import {addClass, removeClass } from '../utils/ClassUtils.js';
import {GAME_CONFIG} from '../constants/gameConfig.js';

class Display {
    #wordContainer = document.getElementById('words')

    // Function for displaying the list of words that were returned from WordList
    renderWords(words) {
        // Using a DocumentFragment is more performant than innerHTML for a large number of elements
        // as it avoids repeated DOM reflows and repaints.
        const fragment = document.createDocumentFragment();
        this.#wordContainer.innerHTML = ''; // Clear existing words

        for (const word of words) {
            const wordDiv = document.createElement('div');
            wordDiv.className = 'word';

            for (const letter of word) {
                const letterSpan = document.createElement('span');
                letterSpan.className = 'letter';
                letterSpan.textContent = letter;
                wordDiv.appendChild(letterSpan);
            }
            fragment.appendChild(wordDiv);
        }

        this.#wordContainer.appendChild(fragment);

        // Set initial current word/letter
        const firstWord = this.#wordContainer.querySelector('.word');
        if (firstWord) {
            addClass(firstWord, 'current');
            const firstLetter = firstWord.querySelector('.letter');
            if (firstLetter) {
                addClass(firstLetter, 'current');
            }
        }
    }

    movetoNextWord(currentWord, currentLetter) {
        const nextWord = currentWord.nextElementSibling;
        const expected = currentLetter.innerHTML;
        if(currentLetter !== expected) {
            const incorrectLetters = [...document.querySelectorAll('.word.current .letter:not(.correct)')]
            for (const letter of incorrectLetters) {
                addClass(letter, 'incorrect');
            }
        }
        removeClass(currentWord, 'current');
        if(currentLetter) removeClass(currentLetter, 'current');
        if(nextWord) {
            addClass(nextWord, 'current');
            const firstLetter = nextWord.querySelector('.letter');
            if (firstLetter) addClass(firstLetter, 'current');
        }
    }

    updateLetterStatus(letter, isCorrect) {
        addClass(letter, isCorrect ? 'correct' : 'incorrect');
        removeClass(letter, 'current');

        const nextLetter = letter.nextElementSibling;
        if (nextLetter) {
            addClass(nextLetter, 'current'); 
        } else {
            document.querySelector('.letter.current').id = 'last';
            return;
        }
    } 
    updateIncorrectLetters(word) {
        // biome-ignore lint/complexity/noForEach: <explanation>
        word.querySelectorAll('.letter:not(.correct)').forEach(letter => {
            addClass(letter, 'incorrect');
        });
    }
    
    checkScroll() {
        const currentWord = document.querySelector('.word.current');
        if(currentWord?.getBoundingClientRect().top > GAME_CONFIG.WORD_MARGIN_THRESHOLD) {
            this.scroll();
        }
    }
    scroll() {
        const currentMargin = Number.parseInt(this.#wordContainer.style.marginTop || '0');
        this.#wordContainer.style.marginTop = `${currentMargin - GAME_CONFIG.WORD_MARGIN_ADJUSTMENT}px`;
    }
    reset() {
        this.#wordContainer.style.marginTop = '0px';
    }
}

export default Display;
