class Result {
    #container;

    constructor(containerId) {
        this.#container = document.getElementById(containerId);
        if (!this.#container) {
            throw new Error('Result container does not exist');
        }
    }

    display(stats, wpm) {
        this.clear();
        const h2 = document.createElement('h2');
        h2.textContent = 'Your typing results:';

        const wpmP = document.createElement('p');
        wpmP.textContent = `WPM: ${wpm}`;

        const accuracyP = document.createElement('p');
        accuracyP.textContent = `Accuracy: ${stats.accuracy}%`;

        const charsP = document.createElement('p');
        charsP.textContent = `Characters: ${stats.correctChars} / ${stats.totalChars}`;

        const wordsP = document.createElement('p');
        wordsP.textContent = `Words: ${stats.correctWords}`;

        this.#container.append(h2, wpmP, accuracyP, charsP, wordsP);
    }
    clear() {
        this.#container.textContent = '';
    }
}

export default Result;