import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Recipe.scss';

const Recipe = () => {

    const [recipe, setRecipe] = useState({ recipeData: null, loading: true });

    useEffect(() => {
        const urlPath = window.location.pathname.split('/');
        const recipeId = urlPath[2];

        axios.get(`https://recipe-app-341cf.firebaseio.com/recipes/${recipeId}.json`)
            .then(response => {
                const recipeCopy = {...recipe};
                recipeCopy.recipeData = response.data;
                recipeCopy.loading = false;
                setRecipe(recipeCopy);
            })
            .catch(err => console.log(err));
        },[]);

    return (
        <div>
            {!recipe.loading ? (
                <React.Fragment>
                    <div className="recipe-image-container">
                        <img 
                        className="recipe-image" 
                        src={recipe.recipeData.imageUrl} /> 
                    </div>
                    <div>
                        <h1 className="recipe-title">{recipe.recipeData.recipeName}</h1>
                        <p className="recipe-description">{recipe.recipeData.description}</p>

                        <div className="recipe-label-container">
                            <div className="recipe-label">   
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="utensils" class="svg-inline--fa fa-utensils fa-w-13" role="img" viewBox="0 0 416 512"><path fill="currentColor" d="M207.9 15.2c.8 4.7 16.1 94.5 16.1 128.8 0 52.3-27.8 89.6-68.9 104.6L168 486.7c.7 13.7-10.2 25.3-24 25.3H80c-13.7 0-24.7-11.5-24-25.3l12.9-238.1C27.7 233.6 0 196.2 0 144 0 109.6 15.3 19.9 16.1 15.2 19.3-5.1 61.4-5.4 64 16.3v141.2c1.3 3.4 15.1 3.2 16 0 1.4-25.3 7.9-139.2 8-141.8 3.3-20.8 44.7-20.8 47.9 0 .2 2.7 6.6 116.5 8 141.8.9 3.2 14.8 3.4 16 0V16.3c2.6-21.6 44.8-21.4 48-1.1zm119.2 285.7l-15 185.1c-1.2 14 9.9 26 23.9 26h56c13.3 0 24-10.7 24-24V24c0-13.2-10.7-24-24-24-82.5 0-221.4 178.5-64.9 300.9z"/></svg>
                                <p>serves {recipe.recipeData.servings}</p>
                            </div>

                            <div className="recipe-label">   
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="clock" class="svg-inline--fa fa-clock fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M256,8C119,8,8,119,8,256S119,504,256,504,504,393,504,256,393,8,256,8Zm92.49,313h0l-20,25a16,16,0,0,1-22.49,2.5h0l-67-49.72a40,40,0,0,1-15-31.23V112a16,16,0,0,1,16-16h32a16,16,0,0,1,16,16V256l58,42.5A16,16,0,0,1,348.49,321Z"/></svg>
                                <p>{recipe.recipeData.preparation}</p>
                            </div>

                            <div className="recipe-label">   
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chart-area" className="svg-inline--fa fa-chart-area fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M500 384c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v308h436zM372.7 159.5L288 216l-85.3-113.7c-5.1-6.8-15.5-6.3-19.9 1L96 248v104h384l-89.9-187.8c-3.2-6.5-11.4-8.7-17.4-4.7z"/></svg>
                                <p>{recipe.recipeData.difficulty}</p>
                            </div>
                        </div>

                        <h3>Ingredients</h3>
                        <ul className="recipe-ul">
                            {recipe.recipeData.ingredients.map((ingredient) => {
                                return <li>{ingredient.amount} {ingredient.ingredient}</li>
                            })}
                        </ul>

                        <h3>Instructions</h3>
                        <ol className="recipe-ol">
                            {recipe.recipeData.instructions.map((instruction) => {
                                return <li>{instruction.step}</li>
                            })}
                        </ol>
                    </div>
                </React.Fragment>
                ) : 
                null
            }
        </div>
    );
};

export default Recipe;