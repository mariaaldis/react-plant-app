import React from 'react';
import './DashboardSection.scss';

const DashboardSection = (props) => {
    return (
        <div>
            <div class="section-title-container">
                <h3>{props.mealType}</h3>
                <h5>See More</h5>
            </div>
            <div className="section-recipes">
                {props.children}
            </div>
        </div>
    );
};

export default DashboardSection;