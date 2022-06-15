import React, { useEffect, useState } from 'react';
import './App.scss';
import Quiz from './components/Quiz/Quiz';
import ConfigDrawer from './components/Drawer/Drawer';

function App() {

  // reference for quizzes
  let quiz1Ref = React.useRef(null);
  let quiz2Ref = React.useRef(null);

  // used for maintaining configurations
  const [config, setConfig] = useState({
    cumulativeScore: 0,
    quizzesAttempted: 0,

    quiz1Title: '',
    quiz1NumOfQuestions: 0,
    quiz1Timeout: 0,
    quiz1Point: 0,
    quiz1Negative: 0,
    quiz1Operators: ['+', '-', '*', '/'],

    quiz2Title: '',
    quiz2NumOfQuestions: 0,
    quiz2Timeout: 0,
    quiz2Point: 0,
    quiz2Negative: 0,
    quiz2Operators: ['+', '-', '*', '/'],
  });

  // current configurations
  const [currConfig, setCurrConfig] = useState({...config});

  // updates the default configuration
  const defaultConfig = (currentConfig) => {
    currentConfig.quiz1Title ||= "Arithmetic Quiz 1"
    currentConfig.quiz1NumOfQuestions ||= 20;
    currentConfig.quiz1Timeout ||= 20;
    currentConfig.quiz1Point ||= 2;
    currentConfig.quiz1Negative ||= -1;
    currentConfig.quiz1Operators ||= ['+', '-', '*', '/', '%', '^'];

    currentConfig.quiz2Title ||= "Arithmetic Quiz 2"
    currentConfig.quiz2NumOfQuestions ||= 5;
    currentConfig.quiz2Timeout ||= 10;
    currentConfig.quiz2Point ||= 2;
    currentConfig.quiz2Negative ||= 0;
    currentConfig.quiz2Operators ||= ['+', '-', '*', '/', '%', '^'];

    return currentConfig;
  };

  // load configurations when application loads
  useEffect(() => {
    let configStr = localStorage.getItem('config');
    if (configStr) {
      try {
        let currentConfig = JSON.parse(configStr);
        setConfig(currentConfig);
      } catch (error){  }
    }
    setConfig(config => {
      let newConfig = {...config};
      newConfig = defaultConfig(newConfig);
      return newConfig;
    })
  }, []);

  // updates the configurations
  useEffect(() => {
    setCurrConfig(config);
  }, [config]);

  // handles the change in config
  const onChangeConfigAttribute = (event) => {
    let target = event.target;
    setCurrConfig(config => {
      let newConfig = {...config};
      let attr = target.getAttribute('name');      
      newConfig[target.getAttribute('name')] = target.value;
      if (attr.indexOf('Operators') !== -1) {
        newConfig[attr] = target.value.split(',').map(op => op.trim());
      }
      return newConfig;
    })
  };

  // updates the configurations
  const onSaveConfig = () => {
    let newConfig = {...config, ...currConfig};
    newConfig.cumulativeScore = config.cumulativeScore;
    newConfig.quizzesAttempted = config.quizzesAttempted;
    setConfig(newConfig);
    setCurrConfig(newConfig);
    localStorage.setItem('config', JSON.stringify(newConfig));
  };

  // when a quiz is completed
  const onEndQuiz = (userScore) => {
    setConfig(config => {
      let newConfig = {
        ...config,
        cumulativeScore: config.cumulativeScore + userScore,
        quizzesAttempted: config.quizzesAttempted + 1        
      };
      localStorage.setItem('config', JSON.stringify(newConfig));
      return newConfig;
    })
  };

  // clears the cache
  const onCleanCache = () => {    
    let confirmClean = window.confirm("Are you sure you want to clean cache?");
    if (!confirmClean)  return;
    window.onbeforeunload = () => {};
    localStorage.removeItem('quiz_1');
    localStorage.removeItem('quiz_2');
    localStorage.removeItem('config');
    window.location.reload();
    setConfig(config => defaultConfig(config));
  };

  // saves the state of quiz to localStorage
  useEffect(() => {
    window.onbeforeunload = () => {
      if (quiz1Ref.current) quiz1Ref.current.click();
      if (quiz2Ref.current) quiz2Ref.current.click();  
    }
  }, [quiz1Ref, quiz2Ref]);

  return (
    <div className="App">
      <ConfigDrawer {...currConfig} 
        onChangeConfigAttribute={onChangeConfigAttribute}
        onSaveConfig={onSaveConfig}
        onCleanCache={onCleanCache}
      />
      <h1 className='header'>Arithmetic Quiz</h1>
      <div className='stats'>
        <p>Quizzes Attempted: {config.quizzesAttempted}</p>
        <p>Cumulative Score: {config.cumulativeScore}</p>
      </div>
      <div className='quizzes-container'>
        <Quiz quizId={1} title={config.quiz1Title} timeOut={config.quiz1Timeout}
          numOfQuestionsInQuiz={config.quiz1NumOfQuestions} 
          point={config.quiz1Point} negative={config.quiz1Negative} 
          operators={config.quiz1Operators}
          onEndQuiz={onEndQuiz} ref={quiz1Ref}/>
        <Quiz quizId={2} title={config.quiz2Title} timeOut={config.quiz2Timeout}
          numOfQuestionsInQuiz={config.quiz2NumOfQuestions} 
          point={config.quiz2Point} negative={config.quiz2Negative} 
          operators={config.quiz2Operators}
          onEndQuiz={onEndQuiz} ref={quiz2Ref}/>
      </div>
    </div>
  );
}

export default App;
