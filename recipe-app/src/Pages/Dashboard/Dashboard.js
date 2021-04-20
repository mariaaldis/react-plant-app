import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../../Common/Card/Card';
import DashboardSection from './DashboardSection/DashboardSection';
import './Dashboard.scss';

const Dashboard = () => {

    const [meals, setMeals] = useState([
        { meal: null, loading: true, mealType: 'Main Meal' }, 
        { meal: null, loading: true, mealType: 'Dessert' },
        { meal: null, loading: true, mealType: 'Snack' },
        { meal: null, loading: true, mealType: 'Breakfast' }
    ]);

    useEffect(() => {
        axios.get('https://recipe-app-341cf.firebaseio.com/recipes.json?orderBy="mealType"&equalTo="Main Meal"&limitToLast=4')
            .then(response => {
                let recipes = response.data;
                let newArray = [...meals];
                newArray[0].meal = recipes;
                newArray[0].loading = false;
                setMeals(newArray);
            })
            .catch(err => console.log(err));

        axios.get('https://recipe-app-341cf.firebaseio.com/recipes.json?orderBy="mealType"&equalTo="Dessert"&limitToLast=4')
            .then(response => {
                let recipes = response.data;
                let newArray = [...meals];
                newArray[1].meal = recipes;
                newArray[1].loading = false;
                setMeals(newArray);
            })
            .catch(err => console.log(err));

        axios.get('https://recipe-app-341cf.firebaseio.com/recipes.json?orderBy="mealType"&equalTo="Snack"&limitToLast=4')
            .then(response => {
                let recipes = response.data;
                let newArray = [...meals];
                newArray[2].meal = recipes;
                newArray[2].loading = false;
                setMeals(newArray);
            })
            .catch(err => console.log(err));

        axios.get('https://recipe-app-341cf.firebaseio.com/recipes.json?orderBy="mealType"&equalTo="Breakfast"&limitToLast=4')
            .then(response => {
                let recipes = response.data;
                let newArray = [...meals];
                newArray[3].meal = recipes;
                newArray[3].loading = false;
                setMeals(newArray);
            })
            .catch(err => console.log(err));
    },[]);

    return (
        <div>
            <h1>Dashboard</h1>
            {meals.map(meal => {
               return !meal.loading ? (
                    <DashboardSection key={meal.mealType} mealType={meal.mealType}>
                        {Object.keys(meal.meal).map(key => {
                            return <Card key={key}
                                        id={key}
                                        imageUrl={meal.meal[key].imageUrl} 
                                        recipeName={meal.meal[key].recipeName} />
                        }) }
                    </DashboardSection> )
                : null;
            }) }
        </div>
    );
};

export default Dashboard;