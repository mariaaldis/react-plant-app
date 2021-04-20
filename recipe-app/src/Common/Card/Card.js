import React from 'react';
import { Link } from 'react-router-dom';
import './Card.scss';

const Card = (props) => {
    return (
       
            <div className="card-container"> 
                <Link to={`recipe/${props.id}`}>
                    <img src={props.imageUrl}/>
                    <h3>{props.recipeName}</h3>
                </Link> 
            </div>
        
    );
};

export default Card;