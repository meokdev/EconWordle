const levels = [
    { word: "cargo", title: "Level 1", subtitle: "Clue: Goods transported, often complicated by landlocked status." },
    { word: "trade", title: "Level 2", subtitle: "Clue: What is hampered due to lack of sea access?" },
    { word: "rails", title: "Level 3", subtitle: "Clue: Important for moving goods inland." },
    { word: "nepal", title: "Level 4", subtitle: "Clue: The landlocked country in South Asia." },
    { word: "river", title: "Level 5", subtitle: "Clue: What is crucial for hydro-power in Nepal?" },
    { word: "ports", title: "Level 6", subtitle: "Clue: Needs good relations with these for trade." },
    { word: "roads", title: "Level 7", subtitle: "Clue: Necessary internal network for connectivity." },
    { word: "india", title: "Level 8", subtitle: "Clue: South Asian neighbor important for trade." },
    { word: "china", title: "Level 9", subtitle: "Clue: Northern neighbor with expanding trade routes." },
    { word: "tolls", title: "Level 10", subtitle: "Clue: Charges for transportation can impact trade costs." }
];

let currentLevel = localStorage.getItem('currentLevel') ? parseInt(localStorage.getItem('currentLevel')) : 0;
let { word: secretWord } = levels[currentLevel]; // Start with the first level word
let currentGuess = [];
let currentRow = 0;

document.addEventListener("DOMContentLoaded", () => {
    setLevelInfo();
    createBoard();
    createKeyboard();
    document.addEventListener('keydown', handleTyping);
    if (currentLevel >= levels.length) {
        showVictoryMessage();
    }
});

function setLevelInfo() {
    if (currentLevel >= levels.length) return;
    const { title, subtitle } = levels[currentLevel];
    document.getElementById('level-title').textContent = title;
    document.getElementById('level-subtitle').textContent = subtitle;
    document.getElementById('level-indicator').textContent = `Level ${currentLevel + 1} of ${levels.length}`;
}

function createBoard() {
    const board = document.getElementById('board');
    board.innerHTML = ''; // Ensure the board is cleared before creating new tiles
    for (let i = 0; i < 30; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('id', 'tile-' + i);
        board.appendChild(tile);
    }
}

function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = ''; // Ensure the keyboard is cleared before creating new keys
    const keys = [
        'qwertyuiop',
        'asdfghjkl',
        'zxcvbnm'
    ];

    for (let row of keys) {
        const rowContainer = document.createElement('div');
        rowContainer.classList.add('keyboard-row');
        row.split('').forEach(key => {
            const keyElement = document.createElement('div');
            keyElement.textContent = key;
            keyElement.classList.add('key');
            keyElement.setAttribute('id', 'key-' + key);
            rowContainer.appendChild(keyElement);
        });
        keyboard.appendChild(rowContainer);
    }
}

function handleTyping(event) {
    const key = event.key.toLowerCase();
    if (key === "enter") {
        checkGuess();
    } else if (key === "backspace" || key === "delete") {
        deleteLetter();
    } else if (/^[a-z]$/.test(key)) {
        addLetter(key);
    }
}

function addLetter(letter) {
    if (currentGuess.length < 5) {
        currentGuess.push(letter);
        const tile = document.getElementById('tile-' + (currentRow * 5 + currentGuess.length - 1));
        tile.textContent = letter;
    }
}

function deleteLetter() {
    if (currentGuess.length > 0) {
        const tile = document.getElementById('tile-' + (currentRow * 5 + currentGuess.length - 1));
        tile.textContent = '';
        currentGuess.pop();
    }
}

function checkGuess() {
    if (currentGuess.length !== 5) {
        alert('Guess must be 5 letters!');
        return;
    }

    const guessString = currentGuess.join('');
    const rowIndex = currentRow * 5;
    let correctCount = 0;

    // Reset all key classes for this guess
    currentGuess.forEach(letter => {
        const key = document.getElementById('key-' + letter);
        key.className = 'key';
    });

    for (let i = 0; i < 5; i++) {
        const tile = document.getElementById('tile-' + (rowIndex + i));
        const key = document.getElementById('key-' + currentGuess[i]);

        if (currentGuess[i] === secretWord[i]) {
            tile.classList.add('correct-position');
            key.classList.add('correct-position');
            correctCount++;
        } else if (secretWord.includes(currentGuess[i])) {
            tile.classList.add('correct-letter');
            key.classList.add('correct-letter');
        } else {
            tile.classList.add('incorrect');
            key.classList.add('incorrect');
        }
    }

    if (correctCount === 5) {
        setTimeout(() => {
            document.getElementById('message').textContent = 'Great! You guessed the word!';
            nextLevel();
        }, 100);
        document.removeEventListener('keydown', handleTyping);
        return;
    }

    currentRow++;
    currentGuess = [];

    if (currentRow === 6) {
        setTimeout(() => {
            document.getElementById('message').textContent = 'Game Over! The word was ' + secretWord + ". Reload the page to try again";
        }, 100);
        document.removeEventListener('keydown', handleTyping);
    }
}

function nextLevel() {
    currentLevel++;
    if (currentLevel < levels.length) {
        localStorage.setItem('currentLevel', currentLevel);
        ({ word: secretWord } = levels[currentLevel]);
        setLevelInfo();
        restartGame();
    } else {
        localStorage.setItem('currentLevel', levels.length);
        showVictoryMessage();
    }
}

function showVictoryMessage() {
    document.querySelector('.game-container').style.display = 'none';
    document.getElementById('level-title').style.display = 'none';
    document.getElementById('level-subtitle').style.display = 'none';
    document.getElementById('level-indicator').style.display = 'none';
    document.getElementById('victory-message').style.display = 'block';
}

function restartGame() {
    currentGuess = [];
    currentRow = 0;
    document.querySelector('.game-container').style.display = 'flex';
    document.getElementById('victory-message').style.display = 'none';
    document.getElementById('level-title').style.display = 'block';
    document.getElementById('level-subtitle').style.display = 'block';
    document.getElementById('level-indicator').style.display = 'block';
    createBoard(); // Recreate the board to reset the tiles correctly
    createKeyboard(); // Recreate the keyboard to reset the keys correctly
    document.getElementById('message').textContent = '';
    document.addEventListener('keydown', handleTyping);
}

function resetGame() {
    localStorage.removeItem('currentLevel');
    currentLevel = 0;
    ({ word: secretWord } = levels[currentLevel]);
    setLevelInfo();
    restartGame();
}
