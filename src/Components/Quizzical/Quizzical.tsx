import React from 'react';
import Question from './Components/Question/Question';
import './css/Quizzical.css';
import { nanoid } from 'nanoid'
import { tpQuestion, tpAnswer } from './types/Quizzical_types'
import { convertTypeAcquisitionFromJson } from 'typescript';


function Quizzical() 
{
    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// STATES
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////    


    const [stGAME_MODE, set_stGAME_MODE] = React.useState('INIT'); // INIT | WAIT | RUNNING | END_GAME
    
    const [stQUESTIONS, set_stQUESTIONS] = React.useState(() => {
        
        let ret: Array<tpQuestion> = [];

        return ret;        
    });

    const [stSCORE, set_stSCORE] = React.useState(0); 

    const [stLOADING_DATA, set_stLOADING_DATA] = React.useState(false); 
    

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// EFFECTS
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    React.useEffect(() => {

        populate_question_data()

        set_stGAME_MODE('WAIT');

        // newGame()

        

    }, []);
    

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// FUNCTIONS - MAIN
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    

    function newGame()
    {
        set_stSCORE(0);
        set_stGAME_MODE('RUNNING');
    }


    function playAgain()
    {
        populate_question_data()
        newGame();
    }


    function handleClickAnswer(questId: string, answerIndex: number)
    {    
        if (stGAME_MODE === 'RUNNING')
        {
            set_stQUESTIONS(prev => {

                let ret: Array<tpQuestion> = prev;
    
                ret = ret.map(quest => {
    
                    if (quest.id === questId)
                    {
                        let newAnswers = quest.answers.map(answer =>  {
    
                            if (answer.index === answerIndex)
                            {
                                return {...answer, selectedAnswer: true};
                            }
                            else
                            {
                                return {...answer, selectedAnswer: false};
                            }                       
                            
                        });
    
                        return {...quest, answers: newAnswers}
                    }
                    else
                    {
                        return quest
                    }
                    
                });
    
                // console.log(prev)
                // console.log(ret)
    
                return ret;
            });
        }
    }


    function checkAnswers()
    {
        if (stLOADING_DATA === false)
        {
            for (let x=0 ; x <= stQUESTIONS.length - 1 ; x++)
            {
                let quest: tpQuestion = stQUESTIONS[x];
                let answers: Array<tpAnswer> = quest.answers;            
                let haveAnswerSelected = false
                
                for (let y=0 ; y <= answers.length - 1 ; y++)
                {
                    if (answers[y].selectedAnswer === true)
                    {
                        haveAnswerSelected = true;
                    }
                    
                    if ((answers[y].correctAnswer === true) && (answers[y].selectedAnswer === true))
                    {                    
                        set_stSCORE(oldScore => {
    
                            let newScore: number = oldScore;
                            newScore++;
    
                            return newScore;
                        });
    
                        break;
                    }                
                }
    
                if (haveAnswerSelected === false)
                {
                    alert('There are questions without answers! Check question ' + quest.index.toString())
                    return
                }            
            }
    
            set_stGAME_MODE('END_GAME');
        }
    }
    

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// FUNCTIONS - SUPPORT
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    function shuffleArrayAnswers(theArray: Array<tpAnswer>)
    {
        let shuffled = theArray
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
            
        return shuffled;
    }


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// FUNCTIONS - DATA
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    async function getQuestionsFromAPI() 
    {
        const res = await fetch("https://opentdb.com/api.php?amount=5&type=multiple&encode=url3986");

        if (!res.ok) {
            const message = 'An error has occured: ' + res.status;
            throw new Error(message);
        }

        const data = await res.json()  ;   
        return data;
    }


    function createDataFromApiRet(apiRet: any)
    {
        let ret = [];
        let res = apiRet.results;

        for (let x=0 ; x < res.length ; x++)
        {  
            let allAnswers: Array<tpAnswer> = [];

            let newAnswer = {
                index: 1,
                answerText: unescape(res[x].correct_answer),
                correctAnswer: true,
                selectedAnswer: false               
            }

            // console.log('Q' + (x+1).toString() + ': resp: ' + unescape(res[x].correct_answer))

            allAnswers.push(newAnswer);

            for (let y=0 ; y < res[x].incorrect_answers.length ; y++)
            {
                let newAnswer = {
                    index: y + 2,
                    answerText: unescape(res[x].incorrect_answers[y]),
                    correctAnswer: false,
                    selectedAnswer: false                  
                }

                allAnswers.push(newAnswer);
            }
        
            let shuffledAllAnswers: Array<tpAnswer> = shuffleArrayAnswers(allAnswers);

            let newQuestion: tpQuestion = {
                id: nanoid(),
                index: x + 1,
                category: unescape(res[x].category).toUpperCase(),
                difficulty: unescape(res[x].difficulty).toUpperCase(),
                questionText: unescape(res[x].question),
                answers: shuffledAllAnswers
            };
            
            ret.push(newQuestion);                
        }

        set_stQUESTIONS(ret);

        set_stLOADING_DATA(false);
    }

    

    function populate_question_data()
    {
        set_stLOADING_DATA(true);

        let useApi = true;

        let ret: Array<tpQuestion> = []; 

        // console.log('populate_question_data')

        if (useApi)
        {
            getQuestionsFromAPI()
                .then(ret => {
                    createDataFromApiRet(ret);
                })                
                .catch(error => {
                    console.log('Error in fetch from api: ' + error.message); 
                });            
        }
        else
        {
            for (let x=1 ; x <= 10 ; x++)
            {  
    
                let newQuestion: tpQuestion = {
                    id: nanoid(),
                    index: x,
                    category: 'Categoryxxx',
                    difficulty: 'difficultyxxx',
                    questionText: 'How would one say goodbye in Spanish in a very long question super ultra long?',
                    answers: [
                        {
                            index: 1,
                            answerText: 'Adios',
                            correctAnswer: false,
                            selectedAnswer: false
                        },
                        {
                            index: 2,
                            answerText: 'Para siempre',
                            correctAnswer: true,
                            selectedAnswer: false
                        },
                        {
                            index: 3,
                            answerText: 'Ola',
                            correctAnswer: false,
                            selectedAnswer: false
                        },
                        {
                            index: 4,
                            answerText: 'Como mas',
                            correctAnswer: false,
                            selectedAnswer: false
                        },                    
                    ]
                };
                
                ret.push(newQuestion);
            }
        }

        set_stQUESTIONS(ret);
    }


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// INIT VARS JSX
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////    


    const questElem = stQUESTIONS.map(question => {
        return (
            <div key={question.id}>
                <Question 
                    questionData={question} 
                    handleClickAnswer={handleClickAnswer}
                    gamemode={stGAME_MODE} 

                />
                <div className="spacer" />
            </div>
        );
    });
    

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// RETURN JSX
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  

    return (
        
        <div className="App">
           <div className="backPanel">            
                <div className="contentArea">

                    { stGAME_MODE === 'WAIT' && (
                        <>
                        <div className="title">Quizzical!</div>
                        <div className="desc">A small trivia generator created in React</div>
                        <button className="btnApp" onClick={newGame}>Start Quiz!</button>
                        </>
                    )}

                    { ((stGAME_MODE === 'RUNNING') || (stGAME_MODE === 'END_GAME')) && (
                        <>

                        <div className='allQuestion-container'>
                            <div className="spacer" />
                            {questElem}                            
                        </div>   

                        {stGAME_MODE === 'RUNNING' && (
                            <button className="btnCheckAnswers" onClick={checkAnswers}>Check Answers</button> 
                        )}

                        {stGAME_MODE === 'END_GAME' && (
                            <>
                            <div className="bottom-bar">
                                <div className="score">You scored {stSCORE}/{stQUESTIONS.length} correct answers!</div>
                                <button className="btnPlayAgain" onClick={playAgain}>Play Again!</button>
                            </div>
                            </>
                        )}
                                                                 
                        </>
                    )}

                </div>
           </div>
        </div>  

    );
} 

export default Quizzical;