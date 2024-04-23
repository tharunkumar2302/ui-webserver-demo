import React, { createContext, useEffect, useReducer, useMemo, useState } from 'react'
import jwtDecode from 'jwt-decode'
import requestClient from '../apiManager/interceptors'
import { MatxLoading } from 'app/components'
import { Alert, Snackbar } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import API from 'app/apiManager/endpoints';
import { forgotPasswordRoute, localStorageAccessToken, localStorageRefreshToken, registerRoute, logInRoute, value100Per } from 'app/utils/constant';
import {
    passwordReset,
    candidteRegister,
    registerSuccess,
    passwordChanged
} from 'app/utils/constantForms';

const initialState = {
    isAuthenticated: false,
    isInitialised: false,
    user: null,
}

const isValidToken = (accessToken) => {
    if (!accessToken) {
        return false
    }

    const decodedToken = jwtDecode(accessToken)
    const currentTime = Date.now() / 1000
    return decodedToken.exp > currentTime
}

const setSession = (accessToken, refreshToken) => {
    if (accessToken && refreshToken) {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        requestClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    } else {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        requestClient.defaults.headers.common.Authorization = ``;
    }
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'INIT': {
            const { isAuthenticated, user } = action.payload

            return {
                ...state,
                isAuthenticated,
                isInitialised: true,
                user,
            }
        }
        case 'LOGIN': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        case 'LOGOUT': {
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            }
        }
        case 'REGISTER': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        case 'FORGOTPASSWORD': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        case 'CONFIRMPASSWORD': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        case 'CANDIDATEREGISTER': {
            const { data } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                data,
            }
        }
        default: {
            return { ...state }
        }
    }
}

const AuthContext = createContext({
    ...initialState,
    method: 'JWT',
    login: () => Promise.resolve(),
    logout: () => { },
    register: () => Promise.resolve(),
    candidateRegister: () => Promise.resolve(),
    forgotPassword: () => Promise.resolve(),
    changePassword: () => Promise.resolve(),
    confirmPassword: () => Promise.resolve(),
    getCurrentProfileData: () => Promise.resolve()
})

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    let [resetToken, setResetToken] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertMsg, setAlertMsg] = useState("")
    const [severity, setSeverity] = useState("")
    const navigate = useNavigate();
    const alertStyle = {
        top: '-28rem',
        left: 'auto',
        right: '1.3rem',
    }

    useMemo(() => {
        const data = document.location.hash?.split("?")[1];
        const searchParams = new URLSearchParams(data)
        setResetToken(searchParams.get('token'));
        if (!resetToken) return 0;
    }, [resetToken])

    const login = async (email, password) => {
        try {
            const payLoad = { password: password, emailAddress: email };
            const response = await requestClient.post(API.LOGIN_API, payLoad)

            const { tokens, user } = response.data

            setSession(tokens.access.token, tokens.refresh.token)
            localStorage.setItem('userDetails', JSON.stringify(response.data.user));
            localStorage.setItem('userRole', response.data.user.role.name.toString());
            response.data.user?.resume ? localStorage.setItem('userfile', response.data.user.resume.is_cv_uploaded || "") : //do nothing  

                dispatch({
                    type: 'LOGIN',
                    payload: {
                        user,
                    },
                })
                if(user.role.name == "superuser"){
                    navigate('dashboard/profile')
                }else{
                    navigate('/')
                }        
           

        } catch (e) {
            setAlertMsg(e.message);
            setSeverity("error");
            handleClick();
            navigate(logInRoute);
        }
    }

    const register = async (email, password, firstName, lastName, mobileNumber, designation, organizationName , pricingPlan) => {
        try {
            const payLoad = { emailAddress: email, password: password, firstName: firstName, lastName: lastName, mobileNumber: (mobileNumber.toString()), designation: designation, organizationName: organizationName , pricingPlan };
            const response = await requestClient.post(API.REGISTER_API, payLoad)
            if (response.status === 201 || response.status === 400) {
                setAlertMsg(registerSuccess);
                setSeverity("success");
                handleClick();
            }

            const { user } = response.data

            dispatch({
                type: 'REGISTER',
                payload: {
                    user,
                },
            })
            navigate(logInRoute);
        } catch (e) {
            setAlertMsg(e.message);
            setSeverity("error");
            handleClick();
            navigate(registerRoute);
        }
    }

    const candidateRegister = async (email, password, firstName, lastName, mobileNumber, designation, organizationName, role, navigateUrl, tokenInvite) => {
        try {
            const payLoad = { emailAddress: email, password: password, firstName: firstName, lastName: lastName, mobileNumber: (mobileNumber.toString()), designation: designation, organizationName: organizationName, role: role, inviteToken: tokenInvite };
            const response = await requestClient.post(API.REGISTER_API, payLoad)
            if (response.status === 201 || response.status === 400) {
                setAlertMsg(candidteRegister);
                setSeverity("success");
                handleClick();
            }

            const { user } = response.data

            dispatch({
                type: 'REGISTER',
                payload: {
                    user,
                },
            })
            navigate(logInRoute);
        } catch (e) {
            setAlertMsg(e.message);
            setSeverity("error");
            handleClick();
            navigate(navigateUrl);
        }
    }

    const getCurrentProfileData = async (tokenInvite) => {
        try {
            const response = await requestClient.get(`${API.CANDIDATE_DETAILS_API}/details?inviteToken=${tokenInvite}`)
            const { data } = response.data
            return ({
                type: 'CANDIDATEREGISTER',
                payload: {
                    data,
                },
            })
        } catch (e) {
            setAlertMsg(e.message);
            setSeverity("error");
        }
    }

    const logout = async () => {
        try {
            const payLoad = { refreshToken: localStorageRefreshToken() };
            await requestClient.post(API.LOGOUT_API, payLoad)
            setSession(null)
            navigate(logInRoute);
        } catch (e) {
            setAlertMsg(e.message);
            setSeverity("error");
            handleClick();
        }
    }

    const forgotPassword = async (email) => {
        try {
            const payLoad = { email: email, targetUrl: `${API.SESSION_API}/` };
            var res = await requestClient.post(API.FORGOT_PASSWORD_API, payLoad)
            setAlertMsg(res.data.message);
            setSeverity("info");
            handleClick();
            navigate(logInRoute);
        } catch (e) {
            setAlertMsg(e.message);
            setSeverity("error");
            handleClick();
            navigate(forgotPasswordRoute);
        }
    }

    const confirmPassword = async (password) => {
        try {
            const payLoad = { password: password };
            await requestClient.post(`${API.CONFIRM_PASSWORD_API}?token=${resetToken}`, payLoad)
            setAlertMsg(passwordReset);
            setSeverity("info");
        } catch (e) {
            setAlertMsg(e.message);
            setSeverity("error");
        }
        handleClick();
    }

    const changePassword = async (newPassword , oldPassword) => {
        try {
            const payLoad = { newpassword: newPassword , oldpassword: oldPassword };
            await requestClient.post(`${API.CHANGED_PASSWORD_API}`, payLoad)
            setAlertMsg(passwordChanged);
            setSeverity("success");
        } catch (e) {
            setAlertMsg(e.message);
            setSeverity("error");
        }
        handleClick();
    }

    const handleClose=(_, reason)=> {
        if (reason === "clickaway") { return; }
        setAlertOpen(false);
    }

    const handleClick=()=> {
        setAlertOpen(true);
    }
    useEffect(() => {
        ; (async () => {
            try {

                if (localStorageAccessToken() && isValidToken(localStorageAccessToken())) {
                    setSession(localStorageAccessToken(), localStorageRefreshToken())

                    const response = await requestClient.get(API.CURRENTUSER_API)
                    const { user } = response.data

                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: true,
                            user,
                        },
                    })
                } else {
                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: false,
                            user: null,
                        },
                    })
                }
            } catch (err) {
                console.error(err)
                dispatch({
                    type: 'INIT',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                })
            }
        })()
    }, [])

    if (!state.isInitialised) {
        return <MatxLoading />
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'JWT',
                login,
                logout,
                register,
                candidateRegister,
                forgotPassword,
                changePassword,
                confirmPassword,
                getCurrentProfileData
            }}
        >
            {children}
            <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleClose} style={alertStyle}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: value100Per }} variant="filled">
                    {JSON.parse(JSON.stringify(alertMsg))}
                </Alert>
            </Snackbar>
        </AuthContext.Provider>
    )
}

export default AuthContext