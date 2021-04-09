import React, { useState } from 'react';

import './CreateRecipe.scss';
import Button from '../../Components/Button/Button';
import Input from '../../Components/Input/Input';

const CreateRecipe = () => {

    const [formData, setFormData] = useState({
        recipeName: null,
        description: null, 
        imageUrl: null,
        mealType: null,
        difficulty: null,
        servings: null,
        preparation: null,
        ingredients: [{ id: new Date().getTime(), ingredient: null, amount: null }],
        instructions: [{ id: new Date().getTime(), step: null }]
    });

    const onAddIngredient =   (event) => {
        event.preventDefault();

        const key = new Date().getTime();

        setFormData({ 
            ...formData, 
            ingredients: [ 
                ...formData.ingredients, 
                { 
                    id: key, 
                    ingredient: null, 
                    amount: null 
                }
            ]
        });
    }

    const onRemoveIngredient = (selectedId) => {
        const updatedIngredients = formData.ingredients.filter(ingredient => ingredient.id !== selectedId);
        
        setFormData({
            ...formData, 
            ingredients: [...updatedIngredients]
        });
    }

    const addStep = (event) => {
        event.preventDefault();
        const key = new Date().getTime();

        setFormData({ 
            ...formData, 
            instructions: [
                ...formData.instructions, 
                { id: key, step: null }
            ]
        });
    }

    const onRemoveStep = (id) => {
        const updatedSteps = formData.instructions.filter(instruction => instruction.id !== id);
        setFormData({ 
            ...formData, 
            instructions: [ ...updatedSteps ] 
        });
    }

    const onInputArrayChange = (event, value, inputChanged) => {
        
        let inputValue = event.target.value;

        switch(inputChanged) {
            case 'INSTRUCTIONS':
                let updatedInstructions = formData.instructions.map(instruction => {
                    return instruction.id === value.id ? { ...instruction, step: inputValue } : instruction;
                });

                setFormData({ 
                    ...formData, 
                    instructions: [ ...updatedInstructions ] 
                });
                break;
            case 'INGREDIENT':
                let updatedIngredient = formData.ingredients.map(ingredientObj => {
                    return ingredientObj.id === value.id ? { ...ingredientObj, ingredient: inputValue } : ingredientObj;
                });

                setFormData({ 
                    ...formData, 
                    ingredients: [ ...updatedIngredient ] 
                });
                break;
            case 'AMOUNT':
                let updatedAmount = formData.ingredients.map(ingredientObj => {
                    return ingredientObj.id === value.id ? { ...ingredientObj, amount: inputValue } : ingredientObj;
                });

                setFormData({ 
                    ...formData, 
                    ingredients: [ ...updatedAmount ] 
                });
                break;
            default:
                console.log('Empty action received.');
                break;
        } 
    }

    return (
    <div>
        <h1>Create Recipe</h1>

        <form>
            <Input 
                elementType="INPUT_TEXT" 
                id="recipeName" 
                placeholder="Recipe Name" 
                label="Recipe Name"
                change={(event) =>setFormData({ ...formData, recipeName: event.target.value})} />

            <Input 
                elementType="TEXTAREA" 
                id="description" 
                placeholder="Description" 
                label="Description"
                change={(event) =>setFormData({ ...formData, description: event.target.value})} />
            
            <Input 
                elementType="INPUT_TEXT" 
                id="imageUrl" 
                placeholder="Image URL" 
                label="Image URL"
                change={(event) =>setFormData({ ...formData, imageUrl: event.target.value})} />

            <label>Meal</label>
            <div className="radio-container">
                <Input elementType="INPUT_RADIO" 
                        id="mainMeal" 
                        value="Main Meal" 
                        change={(event) => setFormData({ ...formData, mealType: event.target.value})}
                        selected={formData.mealType === "Main Meal"}/>

                <Input elementType="INPUT_RADIO" 
                        id="breakfastMeal" 
                        value="Breakfast" 
                        change={(event) => setFormData({ ...formData, mealType: event.target.value})}
                        selected={formData.mealType === "Breakfast"}/>

                <Input elementType="INPUT_RADIO" 
                        id="snackMeal" 
                        value="Snack" 
                        change={(event) => setFormData({ ...formData, mealType: event.target.value})}
                        selected={formData.mealType === "Snack"}/>

                <Input elementType="INPUT_RADIO" 
                        id="dessertMeal" 
                        value="Dessert" 
                        change={(event) => setFormData({ ...formData, mealType: event.target.value})}
                        selected={formData.mealType === "Dessert"}/>
            </div>

            <label className="input-title">Difficulty</label>
            <div class="radio-container">
                <Input elementType="INPUT_RADIO" 
                        id="easyDifficulty" 
                        value="easy" 
                        change={(event) => setFormData({ ...formData, difficulty: event.target.value })}
                        selected={formData.mealType === "easy"}/>

                <Input elementType="INPUT_RADIO" 
                        id="mediumDifficulty" 
                        value="medium" 
                        change={(event) => setFormData({ ...formData, difficulty: event.target.value })}
                        selected={formData.difficulty === "medium"}/>  

                <Input elementType="INPUT_RADIO" 
                        id="hardDifficulty" 
                        value="hard" 
                        change={(event) => setFormData({ ...formData, difficulty: event.target.value })}
                        selected={formData.difficulty === "hard"}/>
            </div>

            <Input 
                elementType="INPUT_TEXT" 
                id="servings" 
                placeholder="Servings" 
                label="Servings"
                change={(event) => setFormData({ ...formData, servings: event.target.value })} />

            <Input 
                elementType="INPUT_TEXT" 
                id="preparation" 
                placeholder="Preparation Time" 
                label="Preparation Time"
                change={(event) => setFormData({ ...formData, preparation: event.target.value })}/>

            <p className="input-title">Ingredients</p>
            {formData.ingredients.map((ingredient, index) => {
                return (
                    <div key={ingredient.id} className="add-ingredient-container">
                        <Input 
                            elementType="INPUT_TEXT" 
                            id={`ingredient-${index}`} 
                            placeholder="Ingredient"
                            change={(event) => onInputArrayChange(event, ingredient, 'INGREDIENT')} />
                        <Input 
                            elementType="INPUT_TEXT" 
                            id="amount" 
                            placeholder="Amount"
                            change={(event) => onInputArrayChange(event, ingredient, 'AMOUNT')} />
                        <svg className="remove-svg" onClick={() => onRemoveIngredient(ingredient.id)} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="minus-circle" class="svg-inline--fa fa-minus-circle fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zM124 296c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6 0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H124z"/></svg>
                    </div>
                );
            })}
            <Button 
                btnStyle="button" 
                click={onAddIngredient}>
                Add an ingredient
            </Button>

            <p className="input-title">Instructions</p>
            {formData.instructions.map((value, index) => {
                return (
                    <div className="instructions-container" key={value.id}>
                         <Input 
                            elementType="TEXTAREA" 
                            id="step" 
                            placeholder="Instructions" 
                            label={`Step ${index + 1}`}
                            change={(event) => onInputArrayChange(event, value, 'INSTRUCTIONS')}  />     
                         <svg className="remove-svg" onClick={() => onRemoveStep(value.id)} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="minus-circle" class="svg-inline--fa fa-minus-circle fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zM124 296c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6 0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H124z"/></svg>
                    </div>
                )
            })}
            <Button 
                btnStyle="button" 
                click={(event) => addStep(event)}>
                Add a Step
            </Button>

            <Button type="submit" click={(event) => {
                event.preventDefault();
                console.log(formData);
                }} btnStyle="submit-button button">Create Recipe</Button>
        </form>
    </div>
    );
};

export default CreateRecipe;
