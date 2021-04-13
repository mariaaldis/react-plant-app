import React from 'react';
import './Input.scss';


const Input = (props) => {
    
    let inputElement = null;

    switch(props.elementType) {
        case 'INPUT_TEXT':
                inputElement = <input type="text" 
                                    className="inputText" 
                                    placeholder={props.placeholder}
                                    label={props.label}
                                    id={props.id}
                                    onChange={props.change}
                                    />
            break;
        case 'INPUT_RADIO':
                inputElement = <input type="radio" 
                                    value={props.value} 
                                    id={props.id} 
                                    onChange={props.change}
                                    checked={props.selected}/>
            break;
        case 'TEXTAREA':
                inputElement = <textarea className="inputText" 
                                    placeholder={props.placeholder} 
                                    id={props.id}
                                    onChange={props.change}>
                                </textarea>
        break;
     }

    return (
        <React.Fragment>
            {props.elementType === "INPUT_RADIO" ? 
            <div className="radio-row">
                {inputElement}
                <label htmlFor={props.id}>{props.value}</label>
            </div> :
            <React.Fragment>
                {props.label ? <label htmlFor={props.id}>{props.label}</label> : null}
                {inputElement}
                {!props.valid? <p>ERROR</p> : null}
            </React.Fragment>
        }
            
        </React.Fragment>
      
       
    );
};

export default Input;