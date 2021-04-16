import React from 'react';
import './Button.scss';

const Button = (props) => {
    return (
        <button className={props.btnStyle} disabled={props.disabledBtn} onClick={props.click}>
            {props.children}
        </button>
    );
};

export default Button;