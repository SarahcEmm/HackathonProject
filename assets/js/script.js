const apiUrl = 'https://opentdb.com/api.php?amount=10&category=27&difficulty=easy&type=boolean';
let currentQuestionIndex = 0;
let score = 0;
let questions = [];

//audio
const audio = new Audio("assets/audio/nature-birds-ambiance-morning-kisses-214774.mp3"); 
let isPlaying = false; 

//Audio button 
document.getElementById('audio-button').addEventListener('click', () => {
    if (isPlaying) {
        audio.pause(); 
        audio.currentTime = 0; 
        isPlaying = false;
        document.getElementById('audio-button').textContent = "Resume"; 
    } else {
        audio.play(); 
        isPlaying = true;
        document.getElementById('audio-button').textContent = "Stop"; 
    }
});

// Get from API
async function fetchQuestions() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    questions = data.results;
    displayQuestion();
}

// Display question
function displayQuestion() {
    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        document.getElementById('question').innerHTML = decodeHtml(currentQuestion.question);

        // Shuffle answers
        const answers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
        shuffleArray(answers);

        const answersDiv = document.getElementById('answers');
        answersDiv.innerHTML = '';
        answers.forEach(answer => {
            const answerButton = document.createElement('button');
            answerButton.innerHTML = decodeHtml(answer);
            answerButton.className = 'answer';
            answerButton.onclick = () => checkAnswer(answer);
            answersDiv.appendChild(answerButton);
        });

        // Put answer in speech bubble
        document.getElementById('next').style.display = 'none';
        document.getElementById('feedback').style.display = 'none';
    } else {
        showScore();
    }
}

// Check if the selected answer is correct and provide feedback with shake
function checkAnswer(selectedAnswer) {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correct_answer;

    if (selectedAnswer === correctAnswer) {
        score++;
        showFeedback("Well Done!", true);
        document.querySelector('.answer').classList.add('correct-answer');
    } else {
        showFeedback("Bad Luck!", + correctAnswer, false);
        document.querySelector('.answer').classList.add('incorrect-answer');
    }

    disableAnswerButtons();
    document.getElementById('next').style.display = 'block';
}

// Close answer buttons
function disableAnswerButtons() {
    const answerButtons = document.querySelectorAll('.answer');
    answerButtons.forEach(button => {
        button.onclick = null;
    });
}

// Show feedback
function showFeedback(message, isCorrect) {
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.textContent = message;
    feedbackElement.className = isCorrect ? 'speech-bubble correct' : 'speech-bubble incorrect';
    feedbackElement.style.display = 'block';
}

// Show score
function showScore() {
    document.getElementById('question').innerText = `Quiz Over! Your score is ${score} out of ${questions.length}.`;
    document.getElementById('answers').innerHTML = '';
    document.getElementById('next').style.display = 'none';
    document.getElementById('feedback').style.display = 'none';
}

// Next question
document.getElementById('next').onclick = () => {
    currentQuestionIndex++;
    displayQuestion();
};

// Shuffle array 
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Decode HTML because it was jumbled. 
function decodeHtml(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

fetchQuestions();