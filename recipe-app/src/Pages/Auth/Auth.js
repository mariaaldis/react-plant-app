import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { setCurrentUser } from '../../Store/Actions';

import Button from '../../Common/Button/Button';
import Input from '../../Common/Input/Input';
import './Auth.scss';

const Auth = () => {
    const [formData, setFormData] = useState({
        email: {
            value: null,
            label: 'Email',
            required: true,
            valid: false,
            dirty: false,
            touched: false,
            errorMessage: null
        },
        password: {
            value: null,
            label: 'Password',
            required: true,
            minLength: 6,
            valid: false,
            dirty: false,
            touched: false,
            errorMessage: null
        }
    });

    const [formValid, setFormValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoginPage, setIsLoginPage] = useState(true);

    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        formValidation();
    },[formData]);

    const switchPage = (event) => {
        event.preventDefault();
        setIsLoginPage(!isLoginPage);
    };

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

        if(formData[id].minLength) {
            validate = {
                ...validate,
                valid: value.length >= formData[id].minLength && validate.valid,
                errorMessage: `${formData[id].label} must be at least ${formData[id].minLength} characters`
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

    const handleError = (errorResponse) => {
        let errorMessage = "Error not defined, please try again.";

        if(!errorResponse.data.error || !errorResponse.data.error.error) {
            setErrorMessage(errorMessage);
        }
    
        switch(errorResponse.data.error.message) {
            case "EMAIL_EXISTS":
              errorMessage = "The email address is already in use by another account.";
              break;
            case "OPERATION_NOT_ALLOWED":
              errorMessage = "Password sign-in is disabled for this project.";
              break;
            case "TOO_MANY_ATTEMPTS_TRY_LATER":
              errorMessage = "We have blocked all requests from this device due to unusual activity. Try again later.";
              break;
            case "EMAIL_NOT_FOUND":
                errorMessage = "Invalid email address or password";
                break;
            case "INVALID_PASSWORD":
              errorMessage = "Invalid email address or password";
              break;
            case "USER_DISABLED":
              errorMessage = "The user account has been disabled by an administrator.";
              break;
            case "INVALID_ID_TOKEN":
                errorMessage = "Please sign in.";
                break;
            default: errorMessage = errorMessage;
        }
        setErrorMessage(errorMessage);
    };
    
    const onSubmit = (event) => {
        event.preventDefault();
        
        const newUser = {
            email: formData.email.value,
            password: formData.password.value,
            returnSecureToken: true
        }

        if (isLoginPage) {      
            axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_API_KEY}`, newUser)
                .then((response) => {
                    handleAuthentication(response.data.email, response.data.localId, response.data.idToken, response.data.expiresIn);
                })
                .catch((error) => {
                    handleError(error.response);
                });
        } else {
            axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_API_KEY}`, newUser)
                .then((response) => {
                    handleAuthentication(response.data.email, response.data.localId, response.data.idToken, response.data.expiresIn);
                })
                .catch((error) => {
                    handleError(error.response);
                });
        }
    };

    const handleAuthentication = (email, id, token, expiresIn) => {
        // get the expiation date 
         // 1. get the current date in milliseconds + milliseconds until token expires
         // 2. convert it back to a date via new Date()
        const expirationDate = new Date(new Date().getTime() + Number(expiresIn) * 1000);
        
        if (isLoginPage) {
            const userInfo = {
                "idToken": token,
                "localId": [id],
                "email": [email]
            }

            // get account information from user (displayName + photoUrl)
            axios.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${process.env.REACT_APP_API_KEY}`, userInfo)
                .then(res => {
                    const user = {
                        email: email,
                        id: id,
                        token: token,
                        expirationDate: expirationDate,
                        displayName: res.data.users[0].displayName,
                        photoUrl: res.data.users[0].photoUrl
                    };

                    // dispatch the logged in user as the current user
                    dispatch(setCurrentUser(user));
                    
                    history.push('/');
                })
                .catch(err => {
                    handleError(err.response);
                });
        } else {
            // new user
            const user = {
                email: email,
                id: id,
                token: token,
                expirationDate: expirationDate
            };

            // dispatch the new user as the current user
            dispatch(setCurrentUser(user));

            history.push('/profile-information');
        }
    }

    return (
        <div>
            <h1>Flavor<span class="black">ous</span></h1>
            {isLoginPage ? <h2>Log in to your account</h2> : <h2>Create an account</h2>}

            <form>
                <Input elementType="INPUT_TEXT" 
                        label="Email" 
                        id="email" 
                        placeholder="Enter email address"
                        dirty={formData.email.dirty}
                        valid={formData.email.valid}
                        touched={formData.email.touched}
                        change={(event) => onChangeHandler(event, 'email')}
                        blur={() => onBlurHandler('email')} />
                        {!formData.email.valid && formData.email.dirty && formData.email.touched? <p className="error">{formData.email.errorMessage}</p> : null}

                <Input elementType="INPUT_PASSWORD" 
                        label="Password"
                        id="password"
                        placeholder="Enter password" 
                        dirty={formData.password.dirty}
                        valid={formData.password.valid}
                        touched={formData.password.touched}
                        change={(event) => onChangeHandler(event, 'password')}
                        blur={() => onBlurHandler('password')} />
                    {!formData.password.valid && formData.password.dirty && formData.password.touched? <p className="error">{formData.password.errorMessage}</p> : null}

                {errorMessage ? <p className="error">{errorMessage}</p> : null}

                <Button disabledBtn={!formValid}
                        click={(event) => onSubmit(event)}>
                    {isLoginPage ? 'Log in' : 'Sign Up'}
                </Button>

                <Button click={(event) => switchPage(event)}>
                    {isLoginPage ? 'Create an account' : 'I already have an account' }
                </Button>
            </form>
        </div>
    );
};

export default Auth;