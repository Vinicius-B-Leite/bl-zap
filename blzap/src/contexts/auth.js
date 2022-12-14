import React, { createContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'



export const AuthContext = createContext()

export default function AuthProvider({ children }) {
    const [error, setError] = useState({})
    const [userInfo, setUserInfo] = useState(auth()?.currentUser?.toJSON())
    const [isUserLogged, setIsUserLogged] = useState(!!userInfo)

    useEffect(() => {
        setUserInfo(auth()?.currentUser?.toJSON())
        setIsUserLogged(!!auth()?.currentUser)
    }, [isUserLogged])

    function handleLogout(goSingIn) {
        auth().signOut().then(() => {
            goSingIn()
            setIsUserLogged(false)
        })
    }
    async function addUserOnFirestore(name, email, uid) {
        await firestore()
            .collection('users')
            .doc(uid)
            .set({
                nome: name,
                email: email,
                foto: 'https://img.favpng.com/7/5/8/computer-icons-font-awesome-user-font-png-favpng-YMnbqNubA7zBmfa13MK8WdWs8.jpg'
            })
    }
    async function addUser(name, email, password, runErrorToastAnimation, goBack) {
        if (name === '' || email === '' || password === '') return

        else if (name.length <= 2) {
            setError({ name: 'Nome muito curto' })
            runErrorToastAnimation()
            return
        }

        else {
            await auth().createUserWithEmailAndPassword(email, password)
                .then(({ user }) => {
                    user.updateProfile({
                        displayName: name,
                        photoURL: 'https://img.favpng.com/7/5/8/computer-icons-font-awesome-user-font-png-favpng-YMnbqNubA7zBmfa13MK8WdWs8.jpg'
                    }).then(() => {
                        goBack()
                        setIsUserLogged(true)
                        addUserOnFirestore(name, email, user.uid)
                    })
                })
                .catch((errorResponse) => {
                    if (errorResponse.code == 'auth/weak-password') {
                        setError({ password: 'A senha ?? muito fraca' })
                        runErrorToastAnimation()
                    }
                    else if (errorResponse.code.includes('auth/invalid-password')) {
                        setError({ password: 'Senha com m??nimo 6 digitos' })
                        runErrorToastAnimation()
                    }
                    else if (errorResponse.code.includes('auth/email-already-in-use')) {
                        setError({ email: 'Este e-mail j?? em uso' })
                        runErrorToastAnimation()
                    }
                    else if (errorResponse.code.includes('auth/invalid-email')) {
                        setError({ email: 'Email inv??lido' })
                        runErrorToastAnimation()
                    }
                    else if (errorResponse.code.includes('auth/network-request-failed')) {
                        setError({ internet: 'Falha com a internet' })
                        runErrorToastAnimation()
                    }
                })
        }
    }
    async function handleLogin(name, email, password, type, runErrorToastAnimation, goBack) {
        if (type) {
            if (name === '' || email === '' || password === '') return
            addUser(name, email, password, runErrorToastAnimation, goBack)

        } else {
            if (email !== '' && password !== '') {
                auth().signInWithEmailAndPassword(email, password)
                    .then(() => {
                        goBack()
                        setIsUserLogged(true)
                    })
                    .catch((errorResponse) => {
                        if (errorResponse.code === 'auth/invalid-email') {
                            setError({ email: 'Por favor, informe um e-mail v??lido.' })
                            runErrorToastAnimation()
                        }
                        else if (errorResponse.code === 'auth/wrong-password') {
                            setError({ password: 'Senha incorreta' })
                            runErrorToastAnimation()
                        }
                        else if (errorResponse.code === 'auth/network-request-failed') {
                            setError({ internet: 'Falha com a internet' })
                            runErrorToastAnimation()
                        }

                    })
            }
        }
    }
    

    return (
        <AuthContext.Provider value={{ isUserLogged, handleLogout, handleLogin, error, setError, userInfo }}>
            {children}
        </AuthContext.Provider>
    );
}