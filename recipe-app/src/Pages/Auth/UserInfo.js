import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser } from '../../Store/Actions';
import Button from '../../Common/Button/Button';
import Input from '../../Common/Input/Input';
import './Auth.scss';


const UserInfo = () => {
    const [formData, setFormData] = useState({
        displayName: {
            value: null,
            label: 'Name',
            required: true,
            valid: false,
            dirty: false,
            touched: false,
            errorMessage: null
        },
        photoUrl: {
            value: null,
            label: 'Profile Photo',
            required: true,
            valid: false,
            dirty: false,
            touched: false,
            errorMessage: null
        }
    });
    const [formValid, setFormValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const user = useSelector(state => state.currentUser);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        formValidation();
    },[formData]);

    const onChangeHandler = (event, id) => {
        let isValid = validation(event.target.value, id);
        
        setFormData({
            ...formData, 
            [id]: {
                ...formData[id],
                value: event.target.value,
                valid: isValid.valid,
                touched: true,
                errorMessage: isValid.errorMessage
            }
        });
    };

    const onBlurHandler = (id) => {
        setFormData({
            ...formData, 
            [id]: {
                ...formData[id], 
                dirty: true
            }
        });
    };

    const validation = (value, id) => {
        let validate = {
            valid: true,
            errorMessage: null
        };

        if(formData[id].required) {
            validate = {
                ...validate,
                valid: value !== '' && validate.valid,
                errorMessage: `${formData[id].label} is required`
            };
        };
        return validate;
    };

    const formValidation = () => {
        let formIsValid = true;

        for(let input in formData) {
            formIsValid = formData[input].valid && formIsValid;
        }
        setFormValid(formIsValid);
    };

    const onSubmit = (event) => {
        event.preventDefault();

        if (user !== null) {
            const userInfo = {
                idToken: user.token,
                displayName: formData.displayName.value,
                photoUrl: formData.photoUrl.value,
                returnSecureToken: false
            }
    
            // update the user info -> store displayName and photoUrl
            axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.REACT_APP_API_KEY}`, userInfo)
            .then(res => {
                const updatedUser = {
                    ...user,
                    displayName: res.data.displayName,
                    photoUrl: res.data.photoUrl
                };

                dispatch(setCurrentUser(updatedUser));
                history.push('/');
            })
            .catch((err) => {
                handleError(err.response);
            });
        } else {
            setErrorMessage("Please create an account or sign in");
        }

        
    };

    const handleError = (errorResponse) => {
        let errorMessage;

        if(!errorResponse.data.error || !errorResponse.data.error.error) {
            setErrorMessage(errorMessage);
        }
    
        switch(errorResponse.data.error.message) {
            case "INVALID_ID_TOKEN":
                errorMessage = "Please sign in or create an account";
              break;
            default: errorMessage = "Error not defined, please try again.";
        }

        setErrorMessage(errorMessage);
    };

    return (
        <div>
            <h1>Flavor<span class="black">ous</span></h1>
            <h2>Profile Information</h2>

            <form>
                <Input elementType="INPUT_TEXT" 
                        label="Name" 
                        id="displayName" 
                        placeholder="Enter your name"
                        dirty={formData.displayName.dirty}
                        valid={formData.displayName.valid}
                        touched={formData.displayName.touched}
                        change={(event) => onChangeHandler(event, 'displayName')}
                        blur={() => onBlurHandler('displayName')} />
                        {!formData.displayName.valid && formData.displayName.dirty && formData.displayName.touched? <p className="error">{formData.displayName.errorMessage}</p> : null}

                <Input elementType="INPUT_TEXT" 
                        label="Profile Photo URL"
                        id="photoUrl"
                        placeholder="Enter photo URL" 
                        dirty={formData.photoUrl.dirty}
                        valid={formData.photoUrl.valid}
                        touched={formData.photoUrl.touched}
                        change={(event) => onChangeHandler(event, 'photoUrl')}
                        blur={() => onBlurHandler('photoUrl')} />
                    {!formData.photoUrl.valid && formData.photoUrl.dirty && formData.photoUrl.touched? <p className="error">{formData.photoUrl.errorMessage}</p> : null}

                <Button disabledBtn={!formValid} click={(event) => onSubmit(event)}>
                    Submit
                </Button>

                {errorMessage ? <p className="error">{errorMessage}</p> : null}
            </form>
        </div>
    );
};

export default UserInfo;