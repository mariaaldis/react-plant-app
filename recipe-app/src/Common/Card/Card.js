import React from 'react';
import './Card.scss';

const Card = (props) => {
    return (
        <div className="card-container" key={props.key}>
            <img src={props.imageUrl}/>
            <h3>{props.recipeName}</h3>
        </div>
    );
};

export default Card;