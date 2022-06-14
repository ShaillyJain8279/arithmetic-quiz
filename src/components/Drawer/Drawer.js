import React, { useState } from 'react';
import './Drawer.scss';

export default function ConfigDrawer(props) {

    const [drawerClass, setDrawerClass] = useState('');
    const { onChangeConfigAttribute } = props;

    return (
        <div className="config-drawer">
            <button onClick={event => setDrawerClass('open')} className='icon'><i className="fa-solid fa-bars"></i></button>
            <div className={['container', drawerClass].join(' ')}>
                <div className='flex'>
                    <h2>Configurations</h2>
                    <button onClick={event => setDrawerClass('close')} className='icon'><i className='fa-solid fa-xmark'></i></button>
                </div>
                <hr />
                <div className='quiz-config'>
                    <h4>Quiz-1</h4>
                    <div className='input-group'>
                        <label htmlFor='quiz2title'>Title</label>
                        <input type="text" id='quiz1title' name="quiz1Title" value={props.quiz1Title} onChange={onChangeConfigAttribute} />
                    </div>
                    <div className='flex'>
                        <div className='input-group'>
                            <label htmlFor='quiz1numOfQuestions'>Questions</label>
                            <input type="number" id='quiz1numOfQuestions' name="quiz1NumOfQuestions" value={props.quiz1NumOfQuestions} onChange={onChangeConfigAttribute} />
                        </div>
                        <div className='input-group'>
                            <label htmlFor='quiz1timeout'>Timeout (in sec)</label>
                            <input type="number" id='quiz1timeout' name="quiz1Timeout" value={props.quiz1Timeout} onChange={onChangeConfigAttribute} />
                        </div>
                    </div>
                    <div className='flex'>
                        <div className='input-group'>
                            <label htmlFor='quiz1point'>Point</label>
                            <input type="number" id='quiz1point' name="quiz1Point" value={props.quiz1Point} onChange={onChangeConfigAttribute} />
                        </div>
                        <div className='input-group'>
                            <label htmlFor='quiz1negative'>Negative</label>
                            <input type="number" id='quiz1negative' name="quiz1Negative" value={props.quiz1Negative} onChange={onChangeConfigAttribute} />
                        </div>
                    </div>
                    <div className='input-group'>
                        <label htmlFor='quiz1operators'>Operators</label>
                        <input type="text" id='quiz1operators' name="quiz1Operators"
                        placeholder='+,-,*,/,%,^'
                        value={props.quiz1Operators} onChange={onChangeConfigAttribute} />
                    </div>
                </div>
                <div className='hr' />
                <div className='quiz-config'>
                    <h4>Quiz-2</h4>
                    <div className='input-group'>
                        <label htmlFor='quiz2title'>Title</label>
                        <input type="text" id='quiz2title' name="quiz2Title" value={props.quiz2Title} onChange={onChangeConfigAttribute} />
                    </div>
                    <div className='flex'>
                        <div className='input-group'>
                            <label htmlFor='quiz2numOfQuestions'>Questions</label>
                            <input type="number" id='quiz2numOfQuestions' name="quiz2NumOfQuestions" value={props.quiz2NumOfQuestions} onChange={onChangeConfigAttribute} />
                        </div>
                        <div className='input-group'>
                            <label htmlFor='quiz2timeout'>Timeout (in sec)</label>
                            <input type="number" id='quiz2timeout' name="quiz2Timeout" value={props.quiz2Timeout} onChange={onChangeConfigAttribute} />
                        </div>
                    </div>
                    <div className='flex'>
                        <div className='input-group'>
                            <label htmlFor='quiz2point'>Point</label>
                            <input type="number" id='quiz2point' name="quiz2Point" value={props.quiz2Point} onChange={onChangeConfigAttribute} />
                        </div>
                        <div className='input-group'>
                            <label htmlFor='quiz2negative'>Negative</label>
                            <input type="number" id='quiz2negative' name="quiz2Negative" value={props.quiz2Negative} onChange={onChangeConfigAttribute} />
                        </div>
                    </div>
                    <div className='input-group'>
                        <label htmlFor='quiz2operators'>Operators</label>
                        <input type="text" id='quiz2operators' 
                        placeholder='+,-,*,/,%,^'
                        name="quiz2Operators" value={props.quiz2Operators} onChange={onChangeConfigAttribute} />
                    </div>
                </div>
                <button onClick={event => {
                    setDrawerClass('close');
                    props.onSaveConfig();
                }} className='button'>Save Changes</button>
                <button style={{backgroundColor: "#dc3545"}} onClick={props.onCleanCache} className='button'>Clean Cache</button>
            </div>
        </div>
    );
};