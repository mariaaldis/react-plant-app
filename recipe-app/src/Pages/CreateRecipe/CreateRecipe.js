import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './CreateRecipe.scss';
import Button from '../../Common/Button/Button';
import Input from '../../Common/Input/Input';

const CreateRecipe = () => {

    const [formData, setFormData] = useState({
        recipeName: {
            value: null,
            label: 'Recipe Name',
            required: true,
            valid: false,
            touched: false,
            errorMessage: null
        },
        description: {
            value: null,
            label: 'Description',
            required: true,
            valid: false,
            touched: false,
            errorMessage: null
        }, 
        imageUrl: {
            value: null,
            label: 'Image URL',
            required: true,
            valid: false,
            touched: false,
            errorMessage: null
        },
        mealType: {
            value: null,
            label: 'Meal Type',
            required: true,
            valid: false,
            touched: false,
            errorMessage: null
        },
        difficulty: {
            value: null,
            label: 'Difficulty',
            required: true,
            valid: false,
            touched: false,
            errorMessage: null
        },
        servings: {
            value: null,
            label: 'Servings',
            required: true,
            valid: false,
            touched: false,
            errorMessage: null
        },
        preparation: {
            value: null,
            label: 'Preparation',
            required: true,
            valid: false,
            touched: false,
            errorMessage: null
        },
        ingredients: [
            {
                id: new Date().getTime(), 
                ingredient: {
                    value: null,
                    label: 'Ingredient',
                    required: true,
                    valid: false,
                    touched: false,
                    errorMessage: null
                }, 
                amount: {
                    value: null,
                    label: 'Amount',
                    required: true,
                    valid: false,
                    touched: false,
                    errorMessage: null
                },
                valid: false
            }
        ],
        instructions: [
            { 
                id: new Date().getTime(), 
                step: {
                    value: null,
                    label: 'Step',
                    required: true,
                    valid: false,
                    touched: false,
                    errorMessage: null
                },
                valid: false
            }
        ]
    });

    const [formValid, setFormValid] = useState(false);

    const onAddIngredient =   (event) => {
        event.preventDefault();
        const key = new Date().getTime();

        setFormData({ 
            ...formData, 
            ingredients: [ 
                ...formData.ingredients, 
                { 
                    id: key, 
                    valid: false,
                    ingredient: {
                        ...formData.ingredients.ingredient,
                        value: null,
                        label: 'Ingredient',
                        required: true,
                        valid: false,
                        touched: false
                    },
                    amount: {
                        ...formData.ingredients.amount,
                        value: null,
                        label: 'Amount',
                        required: true,
                        valid: false,
                        touched: false
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
                        valid: true,
                        errorMessage: null,
                        touched: false,
                        label: 'Step'
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

    useEffect(() => {
        let formArrayValid = true;
        let formInputValid = true;

        let isFormValid = true;

        // validate overall form validity
        for(let input in formData) {
            // loop though the formData inputs (if they are not input arrays) and check if they are valid
            if(!Array.isArray(formData[input])) {
                formInputValid = formData[input].valid && formInputValid;

                isFormValid = formInputValid && formArrayValid;
            } else {
                formData[input].forEach((item) => {
                    formArrayValid = item.valid && formArrayValid;
                    isFormValid = formArrayValid && formInputValid;
                  });
            }
        }
        setFormValid(isFormValid);
    }, [formData])

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
                            valid: isValid.valid,
                            touched: true,
                            errorMessage: isValid.errorMessage
                        },
                        valid: isValid.valid
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
                            valid: isValid.valid,
                            errorMessage: isValid.errorMessage,
                            touched: true
                        },
                        valid: isValid.valid && ingredientObj.amount.valid
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
                            valid: isValid.valid,
                            errorMessage: isValid.errorMessage,
                            touched: true
                        },
                        valid: isValid.valid && ingredientObj.ingredient.valid
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

        setFormData({ 
            ...formData, 
            [id]: { 
                ...formData[id], 
                value: event.target.value, 
                valid: isVal.valid, 
                touched: true,
                errorMessage: isVal.errorMessage
            } 
        });
    };

    const validation = (id, value, index, inputChanged) => {
        let isValid = {
            valid: true,
            errorMessage: null
        };

        // formArray validation
        if(index !== undefined) {
            // required fields
            if(formData[id][index][inputChanged].required) {
                isValid = {
                    ...isValid,
                    valid: value !== '' && isValid.valid,
                    errorMessage: `${formData[id][index][inputChanged].label} is required`
                }
            }
        }
        // non-array validation
        else {
            // required fields
            if (formData[id].required) {
                isValid = {
                    ...isValid,
                    valid: value !== '' && isValid.valid,
                    errorMessage: `${formData[id].label} is required`
                };
            }
        };
        return isValid;
    };

    const onSubmit = (event, formData) => {
        event.preventDefault();

        let ingredients = formData.ingredients.map((ingredient) => {
            return { 
                id: ingredient.id, 
                ingredient: ingredient.ingredient.value, 
                amount: ingredient.amount.value 
            }
        });

        let instructions = formData.instructions.map((instruction) => {
            return {
                id: instruction.id,
                step: instruction.step.value
            }
        });

        let recipe = {
            recipeName: formData.recipeName.value,
            description: formData.description.value,
            imageUrl: formData.imageUrl.value,
            mealType: formData.mealType.value,
            difficulty: formData.difficulty.value,
            servings: formData.servings.value,
            preparation: formData.preparation.value,
            ingredients: ingredients,
            instructions: instructions
        };

        axios.post('https://recipe-app-341cf.firebaseio.com/recipes.json', recipe)
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
                valid={formData.recipeName.valid}
                touched={formData.recipeName.touched} />
                {!formData.recipeName.valid && formData.recipeName.touched? <p className="error">{formData.recipeName.errorMessage}</p> : null}

            <Input 
                elementType="TEXTAREA" 
                id="description" 
                placeholder="Description" 
                label="Description"
                change={(event) => { onChangeHandler(event, "description"); }}
                valid={formData.description.valid}
                touched={formData.description.touched}  />
                {!formData.description.valid? <p className="error">{formData.description.errorMessage}</p> : null}
            
            <Input 
                elementType="INPUT_TEXT" 
                id="imageUrl" 
                placeholder="Image URL" 
                label="Image URL"
                change={(event) => { onChangeHandler(event, "imageUrl"); }}
                valid={formData.imageUrl.valid}
                touched={formData.imageUrl.touched} />
                {!formData.imageUrl.valid? <p className="error">{formData.imageUrl.errorMessage}</p> : null}

            <label>Meal</label>
            <div className="radio-container">
                <Input elementType="INPUT_RADIO" 
                        id="mainMeal" 
                        value="Main Meal" 
                        change={(event) => setFormData({ 
                            ...formData, 
                            mealType: {
                                ...formData.mealType, 
                                touched: true, 
                                valid: true,
                                value: event.target.value
                            }
                        }) }
                        selected={formData.mealType.value === "Main Meal"}/>

                <Input elementType="INPUT_RADIO" 
                        id="breakfastMeal" 
                        value="Breakfast" 
                        change={(event) => setFormData({ 
                            ...formData,
                            mealType: {
                                ...formData.mealType, 
                                touched: true, 
                                valid: true,
                                value: event.target.value
                            }
                        }) }
                        selected={formData.mealType.value === "Breakfast"}/>

                <Input elementType="INPUT_RADIO" 
                        id="snackMeal" 
                        value="Snack" 
                        change={(event) => setFormData({ 
                            ...formData, 
                            mealType: {
                                ...formData.mealType, 
                                touched: true, 
                                valid: true,
                                value: event.target.value
                            }
                        }) }
                        selected={formData.mealType.value === "Snack"}/>

                <Input elementType="INPUT_RADIO" 
                        id="dessertMeal" 
                        value="Dessert" 
                        change={(event) => setFormData({ 
                            ...formData, 
                            mealType: {
                                ...formData.mealType,
                                touched: true, 
                                valid: true,
                                value: event.target.value
                            }
                        }) }
                        selected={formData.mealType.value === "Dessert"}/>
            </div>

            <label className="input-title">Difficulty</label>
            <div class="radio-container">
                <Input elementType="INPUT_RADIO" 
                        id="easyDifficulty" 
                        value="easy" 
                        change={(event) => setFormData({ 
                            ...formData,
                            difficulty: {
                                ...formData.difficulty, 
                                touched: true, 
                                valid: true,
                                value: event.target.value 
                            }
                        }) }
                        selected={formData.difficulty.value === "easy"}/>

                <Input elementType="INPUT_RADIO" 
                        id="mediumDifficulty" 
                        value="medium" 
                        change={(event) => setFormData({ 
                            ...formData,
                            difficulty: {
                                ...formData.difficulty, 
                                touched: true, 
                                valid: true,
                                value: event.target.value 
                            }
                        }) }
                        selected={formData.difficulty.value === "medium"}/>  

                <Input elementType="INPUT_RADIO" 
                        id="hardDifficulty" 
                        value="hard" 
                        change={(event) => setFormData({ 
                            ...formData,
                            difficulty: {
                                ...formData.difficulty, 
                                touched: true, 
                                valid: true,
                                value: event.target.value 
                            }
                        }) }
                        selected={formData.difficulty.value === "hard"}/>
            </div>

            <Input 
                elementType="INPUT_TEXT" 
                id="servings" 
                placeholder="Servings" 
                label="Servings"
                change={(event) => { onChangeHandler(event, "servings"); }}
                valid={formData.servings.valid}
                touched={formData.servings.touched} />
                {!formData.servings.valid & formData.servings.touched? <p className="error">{formData.servings.errorMessage}</p> : null}

            <Input 
                elementType="INPUT_TEXT"
                id="preparation" 
                placeholder="Preparation Time" 
                label="Preparation Time"
                change={(event) => { onChangeHandler(event, "preparation"); }}
                valid={formData.preparation.valid}
                touched={formData.preparation.touched} />
                {!formData.preparation.valid && formData.preparation.touched? <p className="error">{formData.preparation.errorMessage}</p> : null}

            <p className="input-title">Ingredients</p>
            {formData.ingredients.map((ingredient, index) => {
                return (
                    <React.Fragment key={ingredient.id}>
                        <div className="add-ingredient-container">
                            <Input
                                elementType="INPUT_TEXT" 
                                id={`ingredient-${index}`} 
                                placeholder="Ingredient"
                                change={(event) => onInputArrayChange(event, ingredient, 'ingredient', 'ingredients', index)}
                                valid={ingredient.ingredient.valid}
                                touched={ingredient.ingredient.touched} />
                            <Input 
                                elementType="INPUT_TEXT" 
                                id={`amount-${index}`}
                                placeholder="Amount"
                                change={(event) => onInputArrayChange(event, ingredient, 'amount', 'ingredients', index)}
                                valid={ingredient.amount.valid}
                                touched={ingredient.amount.touched} />
                            <svg className="remove-svg" onClick={() => onRemoveIngredient(ingredient.id)} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="minus-circle" class="svg-inline--fa fa-minus-circle fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zM124 296c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6 0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H124z"/></svg>
                        </div>
                        {!ingredient.ingredient.valid && ingredient.ingredient.touched ? <p className="error">{ingredient.ingredient.errorMessage}</p> : null}
                        {!ingredient.amount.valid && ingredient.amount.touched ? <p className="error">{ingredient.amount.errorMessage}</p> : null}
                    </React.Fragment>
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
                    <React.Fragment key={value.id}>
                        <div className="instructions-container">
                            <Input 
                                elementType="TEXTAREA" 
                                id="step" 
                                placeholder="Instructions" 
                                label={`Step ${index + 1}`}
                                touched={value.step.touched}
                                change={(event) => onInputArrayChange(event, value, 'step', 'instructions', index)}
                                valid={value.step.valid} />     
                            <svg onClick={() => onRemoveStep(value.id)} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="minus-circle" className="remove-svg svg-inline--fa fa-minus-circle fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zM124 296c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6 0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H124z"/></svg>
                        </div>
                        {!value.step.valid && value.step.touched ? <p className="error">{value.step.errorMessage}</p> : null}
                    </React.Fragment>
                )
            })}
            <Button 
                btnStyle="button" 
                click={(event) => addStep(event)}>
                Add a Step
            </Button>

            <Button 
                type="button"
                disabledBtn={!formValid}
                click={(event) => onSubmit(event, formData)} 
                btnStyle="submit-button button">
                Create Recipe
            </Button>
        </form>
    </div>
    );
};

export default CreateRecipe;
