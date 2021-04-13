import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './CreateRecipe.scss';
import Button from '../../Components/Button/Button';
import Input from '../../Components/Input/Input';

const CreateRecipe = () => {

    const [formData, setFormData] = useState({
        recipeName: {
            value: null,
            required: true,
            valid: true
        },
        description: {
            value: null,
            required: true,
            valid: true
        }, 
        imageUrl: {
            value: null,
            required: true,
            valid: true
        },
        mealType: {
            value: null,
            required: true,
            valid: true
        },
        difficulty: {
            value: null,
            required: true,
            valid: true
        },
        servings: {
            value: null,
            required: true,
            valid: true
        },
        preparation: {
            value: null,
            required: true,
            valid: true
        },
        ingredients: [
            {
                id: new Date().getTime(), 
                ingredient: {
                    value: null,
                    required: true,
                    valid: true
                }, 
                amount: {
                    value: null,
                    required: true,
                    valid: true
                }
            }
        ],
        instructions: [
            { 
                id: new Date().getTime(), 
                step: {
                    value: null,
                    required: true,
                    valid: true
                } 
            }
        ]
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
                    ingredient: {
                        ...formData.ingredients.ingredient,
                        value: null,
                        required: true,
                        valid: true
                    },
                    amount: {
                        ...formData.ingredients.amount,
                        value: null,
                        required: true,
                        valid: true
                    }
                }
            ]
        });
    };

    const onRemoveIngredient = (selectedId) => {
        const updatedIngredients = formData.ingredients.filter(ingredient => ingredient.id !== selectedId);
        
        setFormData({
            ...formData, 
            ingredients: [...updatedIngredients]
        });
    };

    const addStep = (event) => {
        event.preventDefault();
        const key = new Date().getTime();

        setFormData({ 
            ...formData, 
            instructions: [
                ...formData.instructions, 
                { 
                    id: key, 
                    step: {
                        ...formData.instructions.step,
                        value: null,
                        required: true,
                        valid: true
                    }
                }
            ]
        });
    };

    const onRemoveStep = (selectedId) => {
        const updatedSteps = formData.instructions.filter(instruction => instruction.id !== selectedId);
        setFormData({ 
            ...formData, 
            instructions: [ ...updatedSteps ] 
        });
    };

    const onInputArrayChange = (event, value, inputChanged, id, index) => {
        let inputValue = event.target.value;
        let isValid = validation(id, inputValue, index, inputChanged);

        switch(inputChanged) {
            case 'step':
                let updatedInstructions = formData.instructions.map(instruction => {
                    return instruction.id === value.id ? { 
                        ...instruction, 
                        step: {
                            ...instruction.step,
                            value: inputValue,
                            valid: isValid
                        }
                    } : instruction;
                });

                setFormData({ 
                    ...formData, 
                    instructions: [ ...updatedInstructions ] 
                });
                break;
            case 'ingredient':
                let updatedIngredient = formData.ingredients.map(ingredientObj => {
                    return ingredientObj.id === value.id ? { 
                        ...ingredientObj, 
                        ingredient: { 
                            ...ingredientObj.ingredient, 
                            value: inputValue, 
                            valid: isValid
                        } 
                    } : ingredientObj;
                });

                setFormData({ 
                    ...formData, 
                    ingredients: [ ...updatedIngredient ] 
                });
                break;
            case 'amount':
                let updatedAmount = formData.ingredients.map(ingredientObj => {
                    return ingredientObj.id === value.id ? { 
                        ...ingredientObj, 
                        amount: {
                            ...ingredientObj.amount,
                            value: inputValue,
                            valid: isValid
                        } 
                    } : ingredientObj;
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
    };

    const onChangeHandler = (event, id) => {
        let isVal = validation(id, event.target.value);
        setFormData({ ...formData, [id]: { ...formData[id], value: event.target.value, valid: isVal } });
    };

    const validation = (id, value, index, inputChanged) => {
        let isValid = true;

        // formArray validation
        if(index !== undefined) {
            // required fields
            if(formData[id][index][inputChanged].required) {
                isValid = value !== '' && isValid;
            }
        } 
        // non-array validation
        else {
            // required fields
            if (formData[id].required) {
                isValid = value !== '' && isValid;
            }
        }
        return isValid;
    }

    const onSubmit = (event, formData) => {
        event.preventDefault();

        axios.post('https://recipe-app-341cf.firebaseio.com/recipes.json', formData)
            .then(response => {
                console.log(response);
            });
    };

    return (
    <div>
        <h1>Create Recipe</h1>

        <form>
            <Input 
                elementType="INPUT_TEXT" 
                id="recipeName" 
                placeholder="Recipe Name" 
                label="Recipe Name"
                change={(event) => { onChangeHandler(event, "recipeName"); }}
                valid={formData.recipeName.valid}/>

            <Input 
                elementType="TEXTAREA" 
                id="description" 
                placeholder="Description" 
                label="Description"
                change={(event) => { onChangeHandler(event, "description"); }}
                valid={formData.description.valid} />
            
            <Input 
                elementType="INPUT_TEXT" 
                id="imageUrl" 
                placeholder="Image URL" 
                label="Image URL"
                change={(event) => { onChangeHandler(event, "imageUrl"); }}
                valid={formData.imageUrl.valid} />

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
                change={(event) => { onChangeHandler(event, "servings"); }}
                valid={formData.servings.valid} />

            <Input 
                elementType="INPUT_TEXT" 
                id="preparation" 
                placeholder="Preparation Time" 
                label="Preparation Time"
                change={(event) => { onChangeHandler(event, "preparation"); }}
                valid={formData.preparation.valid} />

            <p className="input-title">Ingredients</p>
            {formData.ingredients.map((ingredient, index) => {
                return (
                        <div key={ingredient.id} className="add-ingredient-container">
                            <Input
                                elementType="INPUT_TEXT" 
                                id={`ingredient-${index}`} 
                                placeholder="Ingredient"
                                change={(event) => onInputArrayChange(event, ingredient, 'ingredient', 'ingredients', index)}
                                valid={ingredient.ingredient.valid} />
                            <Input 
                                elementType="INPUT_TEXT" 
                                id={`amount-${index}`}
                                placeholder="Amount"
                                change={(event) => onInputArrayChange(event, ingredient, 'amount', 'ingredients', index)}
                                valid={ingredient.amount.valid} />
                            <svg className="remove-svg" onClick={() => onRemoveIngredient(ingredient.id)} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="minus-circle" class="svg-inline--fa fa-minus-circle fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zM124 296c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6 0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H124z"/></svg>
                    </div>
                );
            })}
            <Button 
                btnStyle="button" 
                click={onAddIngredient}>
                Add Ingredient
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
                            change={(event) => onInputArrayChange(event, value, 'step', 'instructions', index)}
                            valid={value.step.valid} />     
                         <svg className="remove-svg" onClick={() => onRemoveStep(value.id)} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="minus-circle" class="svg-inline--fa fa-minus-circle fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zM124 296c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6 0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H124z"/></svg>
                    </div>
                )
            })}
            <Button 
                btnStyle="button" 
                click={(event) => addStep(event)}>
                Add a Step
            </Button>

            <Button type="submit" click={(event) => onSubmit(event, formData)} btnStyle="submit-button button">Create Recipe</Button>
        </form>
    </div>
    );
};

export default CreateRecipe;
