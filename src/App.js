import React,{ useEffect, useState} from 'react';
import './App.css';
import Result from './img/winer.svg';
function App() {
  const [finish, setFinish] = useState(false);
  const [numberQuestion, setNumberQuestion] = useState(0);
  const [disabledButton, setDisabledButton] = useState(false);
  const [disableNext, setDisableNext] = useState(true);
  const [score, setScore] = useState(0);
  const [searchApi, setSearchApi] = useState(true);
  const [question, setQuestion] = useState([]);
  //get accesS to the api
  useEffect(() => {
    const obtenerBusqueda = async () => {
      const urlApi = `https://opentdb.com/api.php?amount=10&category=22&difficulty=easy&type=multiple`;
      let respesta = await fetch(urlApi);
      let data = await respesta.json();
      //we send the data to our state
      setQuestion(data.results);
    }
    obtenerBusqueda();
  },[searchApi])
  //if there are no question not render
  
  if(question.length === 0){
    return null;
  }
  // we access to the response of the api data and join de correct answer and the wrong answers
  let correctAnswer = [question[numberQuestion].correct_answer];
  let incorrectAnswers = [question[numberQuestion].incorrect_answers];
  let totalAnswer = correctAnswer.concat(incorrectAnswers[0]);
  //when click de answer
  const isCorrect = e => {
    e.preventDefault();
    //we access to the value that we are clicking and compared if is equal or not
    if(correctAnswer[0] === e.target.childNodes[1].nodeValue){
      setDisabledButton(true);
      setDisableNext(false);
      e.target.classList.add("correct-answer");
      setScore(score + 1);
    } else {
      setDisabledButton(true);
      setDisableNext(false);
      e.target.classList.add("incorect-answer");
      let whichOneIsCorrect = e.target.parentElement.children;
        //when de users click incorrect answer we show what is true
         for (let i = 0; i < whichOneIsCorrect.length; i++) {
           let element = whichOneIsCorrect[i];
           let allAnswers = element.childNodes[1].nodeValue;
             if(correctAnswer[0] === allAnswers){
               element.classList.add("correct-answer");
             }
           };  
    }
    //if we finish we show the results in the front
    if((numberQuestion + 1) === question.length){
      setFinish(true);
    }
  }
  //next question
  const nextQuestion = (e) =>{
    setNumberQuestion(numberQuestion + 1);
    setDisabledButton(false);
    //on click "NEXT" we delet the class of the buttons "corrects and incorrect"
    let buttons = e.target.parentElement.previousSibling.children;
    for (let i = 0; i < buttons.length; i++) {
      const element2 = buttons[i];
      element2.classList.remove("correct-answer");
      element2.classList.remove("incorect-answer");
    }
    setDisableNext(true);
  }
  //we tray again the game
  const tryAgain = () => {
    setFinish(false);
    setSearchApi(false);
    setDisabledButton(false);
    setDisableNext(true);
    setNumberQuestion(0);
  }
  return (
    <div className="app">
      <div className="box-container">
        <h2>Contry Quiz</h2>
        <div className="box-question">
          { finish ? 
              <div className="result">
                <div className="img">
                  <img src={Result} alt="" />
                </div>
                <h1>Results</h1>
                <p className="score">you got <span className="score-num">{score}</span> correct answers</p>
                <div className="try-again">
                  <p
                  onClick={tryAgain} 
                  className="btn-try-again">Try again</p>
                </div>
              </div>
            :
              <div>
                <h3>{question[numberQuestion].question}</h3>
                <div className="box-answer">
                    <button  disabled={disabledButton} onClick={isCorrect}><span>A</span>{totalAnswer[0]}</button >
                    <button  disabled={disabledButton} onClick={isCorrect}><span>B</span>{totalAnswer[1]}</button >
                    <button  disabled={disabledButton} onClick={isCorrect}><span>C</span>{totalAnswer[2]}</button >
                    <button  disabled={disabledButton} onClick={isCorrect}><span>D</span>{totalAnswer[3]}</button >
                </div>
                <div className="box-btn">
                  <button disabled={disableNext} className="btn" onClick={nextQuestion} id="btn">Next</button>
                </div>
              </div>
          }
        </div>
      </div>
    </div>
  );
}
export default App;
