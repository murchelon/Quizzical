import React from 'react';
import './css/Question.css';
import { tpAnswer } from '../../types/Quizzical_types'


function Question(props: any) 
{    

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// RETURN JSX
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  

    var quest = props.questionData;

    let answers = quest.answers.map((answer: tpAnswer) => { 
        
        let styleName = ''

        if (props.gamemode === 'RUNNING')
        {
            if (answer.selectedAnswer)  
            {
                styleName = 'btnAnswer_selected'
            } 
            else 
            {
                styleName = 'btnAnswer_unselected'
            }
        }
        else if (props.gamemode === 'END_GAME')
        {
            if (answer.correctAnswer)  
            {
                if (answer.selectedAnswer)
                {
                    styleName = 'btnAnswer_correct_chosen'
                }
                else
                {
                    styleName = 'btnAnswer_correct_notchosen'
                }
                
            } 
            else 
            {
                if (answer.selectedAnswer)
                {
                    styleName = 'btnAnswer_notcorrect_chosen'
                }
                else
                {
                    styleName = 'btnAnswer_notcorrect_notchosen'
                }
            }
        }

        return <button className={styleName} key={answer.index} onClick={(event) => {props.handleClickAnswer(quest.id, answer.index)}}>{answer.answerText}</button> 
    
    })

    return (
        
        <div className="question-container">
            <div className="category">{quest.category}&nbsp;&nbsp;&nbsp;({quest.difficulty})</div>
            <div className="question">{quest.index}. {quest.questionText}</div>
            <div className="btnAnswer-container">
                {answers}
            </div>                                
        </div>

    );
} 

export default Question;