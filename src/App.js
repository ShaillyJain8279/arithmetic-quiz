import { useEffect, useState } from 'react';
import './App.scss';
import Quiz from './components/Quiz/Quiz';
import ConfigDrawer from './components/Drawer/Drawer';

function App() {

  // used for maintaining configurations
  const [config, setConfig] = useState({
    cumulativeScore: 0,
    quizzesAttempted: 0,

    quiz1Title: '',
    quiz1NumOfQuestions: 0,
    quiz1Timeout: 0,
    quiz1Point: 0,
    quiz1Negative: 0,

    quiz2Title: '',
    quiz2NumOfQuestions: 0,
    quiz2Timeout: 0,
    quiz2Point: 0,
    quiz2Negative: 0,
  });

  // current configurations
  const [currConfig, setCurrConfig] = useState({...config});

  // updates the default configuration
  const defaultConfig = (currentConfig) => {
    currentConfig.quiz1Title ||= "Arithmetic Quiz 1"
    currentConfig.quiz1NumOfQuestions ||= 2;
    currentConfig.quiz1Timeout ||= 10;
    currentConfig.quiz1Point ||= 1;
    currentConfig.quiz1Negative ||= 0;

    currentConfig.quiz2Title ||= "Arithmetic Quiz 2"
    currentConfig.quiz2NumOfQuestions ||= 5;
    currentConfig.quiz2Timeout ||= 20;
    currentConfig.quiz2Point ||= 2;
    currentConfig.quiz2Negative ||= -1;

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
      newConfig[target.getAttribute('name')] = target.value;
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

  return (
    <div className="App">
      <ConfigDrawer {...currConfig} 
        onChangeConfigAttribute={onChangeConfigAttribute}
        onSaveConfig={onSaveConfig}
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
          onEndQuiz={onEndQuiz}/>
        <Quiz quizId={2} title={config.quiz2Title} timeOut={config.quiz2Timeout}
          numOfQuestionsInQuiz={config.quiz2NumOfQuestions} 
          point={config.quiz2Point} negative={config.quiz2Negative} 
          onEndQuiz={onEndQuiz}/>
      </div>
    </div>
  );
}

export default App;
