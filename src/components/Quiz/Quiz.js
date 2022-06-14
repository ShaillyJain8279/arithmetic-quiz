import React, { useEffect, useRef, useState } from 'react';
import './Quiz.scss';

export default function Quiz(props) {

    // configurable properties
    const numOfQuestionsInQuiz = props.numOfQuestionsInQuiz || 20;
    const minNumber = props.minNumber || 0;
    const maxNumber = props.maxNumber || 10;
    const operators = props.operators || ['+', '-', '*', '/'];
    const timeOut = props.timeOut || 20 * 1000;
    const positive = props.point || 1;
    const negative = props.negative || 0;

    const [quizState, setQuizState] = useState('NOT_STARTED');
    const [questions, setQuestions] = useState([]);
    const [userAnswer, setUserAnswer] = useState('');
    const [userScore, setUserScore] = useState(0);

    // for count down
    const ref = useRef(null);
    const [timer, setTimer] = useState(-1);

    // used for report generation
    const [idx, setIdx] = useState(0);

    // generates a random number in given range
    const generateRandomNumber = (min = minNumber, max = maxNumber) => (Math.floor(Math.random() * max) + min);

    // evaluates the operators
    const evaluate = ({ num1, num2, op }) => {
        switch (op) {
            case '+': return num1 + num2;
            case '-': return num1 - num2;
            case '*': return num1 * num2;
            case '/': return num1 / num2;
            case '%': return num1 % num2;
            default: return 0.0;
        }
    }

    // parse the time
    const parseTime = (seconds) => {
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        let hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        return (
            (hours > 9 ? hours : `0${hours}`) + "h:" +
            (minutes > 9 ? minutes : `0${minutes}`) + "m:" +
            (seconds > 9 ? seconds : `0${seconds}`) + "s"
        );
    };

    // generates problem statement
    const problemStatement = (question) => `Evaluate ${question.num1} ${question.op} ${question.num2}`;

    const resetTimer = (startTime = timeOut) => {
        setTimer(startTime);
        if (ref.current) clearInterval(ref.current);
        ref.current = setInterval(() => {
            setTimer(timer => timer - 1);
        }, 1000);
    };

    // starts the quiz
    const restartQuiz = (fromState) => {
        // clear up all inputs and timers
        if (ref.current) clearInterval(ref.current);
        setIdx(0);
        setQuizState(fromState);
        setQuestions([]);
        setUserAnswer(0);
        setUserScore(0);
    };

    // ends the quiz
    const endQuiz = () => {
        setQuizState('ENDED');
        if (props.onEndQuiz) props.onEndQuiz(userScore);
    };

    const addQuestion = () => {
        // stop the ongoing timer
        if (ref.current) clearInterval(ref.current);
        // check if we have reached to end of quiz
        if (questions.length === numOfQuestionsInQuiz) {
            endQuiz();
            return;
        }
        // generate two random numbers
        let num1 = generateRandomNumber();
        let num2 = generateRandomNumber();
        // pick a random operator
        let idx = generateRandomNumber(1, operators.length) - 1;
        console.log(idx);
        let op = operators[idx];
        let oldQuestions = [...questions];
        oldQuestions.push({ num1, num2, op, userAnswer });
        setQuestions(oldQuestions);
        resetTimer();
        setUserAnswer('');
    };

    // check if answer is correct
    const isCorrectAnswer = (question) => {
        let expectedAnswer = evaluate(question);
        let actualAnswer = null;
        try {
            actualAnswer = parseFloat(question.userAnswer);
        } catch (error) { }
        return (actualAnswer === expectedAnswer);
    };

    const nextQuestion = () => {
        let currentQuestion = questions[questions.length - 1];
        if (currentQuestion) {
            currentQuestion.userAnswer = userAnswer;
            if (isCorrectAnswer(question)) setUserScore(userScore => userScore + positive);
            else setUserScore(userScore => userScore + negative);
        }
        addQuestion();
    };

    useEffect(() => {
        if (timer === 0) nextQuestion();
    }, [timer]);

    // save items to localStorage
    useEffect(() => {
        window.onbeforeunload = () => {
            localStorage.setItem(`quiz_${props.quizId}`, JSON.stringify({
                quizState,
                questions,
                userAnswer,
                userScore,
                timer,
                idx,
            }))
        };
    }, [quizState, questions, userAnswer, userScore, timer, idx, props.quizId]);

    // loads the quiz state from localStorage
    useEffect(() => {
        let quiz = null;
        try {
            quiz = JSON.parse(localStorage.getItem(`quiz_${props.quizId}`));
        } catch (error) { }
        if (!quiz)  return;
        setQuestions(quiz.questions);
        setUserAnswer(quiz.userAnswer);
        setUserScore(quiz.userScore);
        setIdx(quiz.idx);
        setQuizState(quiz.quizState);
        resetTimer()
    }, [props.quizId, timeOut]);



    // render the UI
    let question = null;
    let problem = null;
    if (questions.length > 0) {
        question = questions[questions.length - 1];
        problem = problemStatement(question);
    }

    let reportQuestion = questions[idx];
    let colorClass = 'success';
    if (reportQuestion && !isCorrectAnswer(reportQuestion)) colorClass = 'danger';

    return (
        <div className='quiz'>
            <h1 className='header'>{props.title || "Arithmetic Quiz"}</h1>

            {quizState === 'NOT_STARTED' &&
                <div className='start-quiz-container'>
                    <h3>Please read the instructions carefully before starting the quiz</h3>
                    <ul>
                        <li>The quiz contains a total of {numOfQuestionsInQuiz} question(s).</li>
                        <li>For each question you will get {timeOut}s to answer.</li>
                        <li>You cannot come back to a question once moved forward.</li>
                        <li>Each question carries {positive} mark(s) for correct answer.</li>
                        {negative === 0 &&
                            <li>There is no negative marking for incorrect answers.</li>}
                        {negative !== 0 &&
                            <li>For each incorrect answer you suffer {negative} mark(s).</li>}
                    </ul>
                    <p>Please click on the "Start Quiz" button to start the quiz.</p>
                    <button
                        onClick={event => {
                            setQuizState('ONGOING');
                            addQuestion();
                        }}
                    ><span>Start Quiz</span></button>
                </div>}


            {quizState === 'ONGOING' &&
                <div className='quiz-container'>
                    <div className='question-header'>
                        <p>Question: {`${questions.length}/${numOfQuestionsInQuiz}`}</p>
                        <p>Score: {`${userScore}/${positive * numOfQuestionsInQuiz}`}</p>
                    </div>
                    <div className='question-container'>
                        <div className='question-content'>
                            <h1>{problem}</h1>
                        </div>
                        <input type="text" value={userAnswer} onChange={event => setUserAnswer(event.target.value)}
                            onKeyDown={(event) => {
                                if (String(event.key).toLowerCase() === 'enter') {
                                    nextQuestion();
                                }
                            }}
                        />
                        <p className={timer <= 5 ? 'time-danger' : 'time-normal'}>Time: {parseTime(timer)}</p>
                        <button onClick={nextQuestion}>{questions.length === numOfQuestionsInQuiz ? "Finish" : "Next"}</button>
                    </div>
                </div>}



            {quizState === 'ENDED' &&
                <div className='quiz-report-container'>
                    <p>
                        Here is the summary of your quiz.
                        You secured {userScore}/{positive * numOfQuestionsInQuiz} mark(s).
                        You can navigate accross questions to see the expected and actual answers
                        and places where you lost points(if any)
                    </p>
                    <div className={['question-container', colorClass].join(' ')}>
                        <h1>{problemStatement(reportQuestion)}</h1>
                        <p>
                            Expected Answer: {evaluate(reportQuestion)} <br />
                            Your Answer: {reportQuestion.userAnswer}<br />
                        </p>
                        {isCorrectAnswer(reportQuestion) &&
                            <p>
                                Your answer is correct.<br />
                                You gained {positive} mark(s).
                            </p>}
                        {!isCorrectAnswer(reportQuestion) &&
                            <p>
                                Your answer is incorrect.<br />
                                You lost {negative} mark(s).
                            </p>}
                    </div>
                    <div className='navigator'>
                        <button onClick={event => {
                            if (idx > 0) setIdx(idx - 1);
                        }} disabled={idx === 0}><i className="fa-solid fa-chevron-left"></i></button>
                        <span>{idx + 1}/{numOfQuestionsInQuiz}</span>
                        <button onClick={event => {
                            if (idx < numOfQuestionsInQuiz - 1) setIdx(idx + 1);
                        }} disabled={idx === numOfQuestionsInQuiz - 1}><i className="fa-solid fa-chevron-right"></i></button>
                    </div>
                    <button onClick={event => restartQuiz('NOT_STARTED')}>Restart</button>
                </div>}
        </div>
    )
};
