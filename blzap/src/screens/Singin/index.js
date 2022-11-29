import React, { useRef, useState } from 'react';
import { Animated, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'



export default function Singin({ navigation }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [type, setType] = useState(false)
    const heightErrorView = useRef(new Animated.Value(0)).current
    const emailInputRef = useRef()
    const passwordInputRef = useRef()
    const nameInputRef = useRef()



    async function addUser() {
        if (name === '' || email === '' || password === '') return

        if (name.length <= 2) {
            setError({ name: 'Nome muito curto' })
            runErrorToastAnimation()
            nameInputRef?.current?.focus()
        }

        await auth().createUserWithEmailAndPassword(email, password)
            .then(({ user }) => {
                user.updateProfile({
                    displayName: name,
                    photoURL: 'https://img.favpng.com/7/5/8/computer-icons-font-awesome-user-font-png-favpng-YMnbqNubA7zBmfa13MK8WdWs8.jpg'
                }).then(() => {
                    navigation.goBack()
                })
            })
            .catch((errorResponse) => {
                if (errorResponse.code == 'auth/weak-password') {
                    setError({ password: 'A senha é muito fraca' })
                    runErrorToastAnimation()
                    passwordInputRef?.current?.focus()
                }
                else if (errorResponse.code.includes('auth/invalid-password')) {
                    setError({ password: 'Senha com mínimo 6 digitos' })
                    runErrorToastAnimation()
                    passwordInputRef?.current?.focus()
                }
                else if (errorResponse.code.includes('auth/email-already-in-use')) {
                    setError({ email: 'Este e-mail já em uso' })
                    runErrorToastAnimation()
                    emailInputRef?.current?.focus()
                }
                else if (errorResponse.code.includes('auth/invalid-email')) {
                    setError({ email: 'Email inválido' })
                    runErrorToastAnimation()
                    emailInputRef?.current?.focus()
                }
                else if (errorResponse.code.includes('auth/network-request-failed')) {
                    setError({ internet: 'Falha com a internet' })
                    runErrorToastAnimation()
                }
            })
    }

    async function addUserOnFirestore() {
        await firestore()
            .collection('users')
            .doc(auth()?.currentUser?.toJSON()?.uid)
            .set({
                nome: name,
                email: email,
                foto: 'https://img.favpng.com/7/5/8/computer-icons-font-awesome-user-font-png-favpng-YMnbqNubA7zBmfa13MK8WdWs8.jpg'
            })
    }

    async function handleLogin() {
        if (type) {
            if (name === '' || email === '' || password === '') return
            addUser().then(() => {
                addUserOnFirestore()
            })

        } else {
            if (email !== '' && password !== '') {
                auth().signInWithEmailAndPassword(email, password)
                    .then(() => navigation.goBack())
                    .catch((errorResponse) => {
                        if (errorResponse.code === 'auth/invalid-email') {
                            setError({ email: 'Por favor, informe um e-mail válido.' })
                            runErrorToastAnimation()
                            emailInputRef?.current?.focus()
                        }
                        else if (errorResponse.code === 'auth/wrong-password') {
                            setError({ password: 'Senha incorreta' })
                            runErrorToastAnimation()
                            passwordInputRef?.current?.focus()
                        }
                        else if (errorResponse.code === 'auth/network-request-failed') {
                            setError({ internet: 'Falha com a internet' })
                            runErrorToastAnimation()
                        }



                    })
            }
        }
    }

    function runErrorToastAnimation() {
        Animated.sequence([
            Animated.timing(heightErrorView, {
                toValue: 50,
                duration: 0.5 * 1000,
                useNativeDriver: false,
            }),
            Animated.timing(heightErrorView, {
                toValue: 0,
                duration: 1500,
                useNativeDriver: false,
                delay: 3.5 * 1000
            })
        ]).start()
    }
    return (
        <SafeAreaView style={styles.conteiner}>
            {
                error && (
                    <Animated.View style={[
                        styles.errorToast,
                        { height: heightErrorView }
                    ]}>
                        <Text style={styles.errorToastText}>{
                            error?.email ||
                            error?.password ||
                            error?.internet ||
                            error?.name || 'Sei la poha se vira ai'}</Text>
                    </Animated.View>
                )
            }
            <Text style={styles.logo} >BL Zap</Text>
            <Text style={{ color: '#fff', lineHeight: 40, marginBottom: 20 }} >Ajude, colabore e faça networking!</Text>


            {
                type && <TextInput
                    style={[styles.input, { borderWidth: 1, borderColor: error?.name ? '#ff0000' : 'transparent' }]}
                    value={name}
                    onChangeText={setName}
                    placeholder='Qual seu nome?'
                    placeholderTextColor='#99999b'
                    ref={nameInputRef}
                />
            }

            <TextInput
                style={[styles.input, { borderWidth: 1, borderColor: error?.email ? '#ff0000' : 'transparent' }]}
                value={email}
                onChangeText={setEmail}
                placeholder='Qual seu email?'
                ref={emailInputRef}
                placeholderTextColor='#99999b'
                keyboardType='email-address'
                autoCapitalize={false}
                autoComplete='email'
                autoCorrect={false}
            />
            


            <TextInput
                style={[styles.input, { borderWidth: 1, borderColor: error?.password ? '#ff0000' : 'transparent' }]}
                value={password}
                onChangeText={setPassword}
                placeholder='*******'
                placeholderTextColor='#99999b'
                secureTextEntry
                ref={passwordInputRef}
                autoCapitalize={false}
                autoComplete='password'
                autoCorrect={false}
            />
            

            <TouchableOpacity
                style={[styles.btn, { backgroundColor: type ? '#000' : '#080808' }]}
                onPress={handleLogin}
            >
                <Text style={styles.txtBtn}>{type ? 'Cadastrar' : 'Acessar'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setType(!type)}>
                <Text style={{ color: '#fff' }}>{type ? 'Já possuo uma conta' : 'Criar nova conta'}</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    errorToast: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff0000',
        position: 'absolute',
        top: 0,
        left: 0
    },
    errorToastText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold'
    },
    conteiner: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#121212'
    },
    logo: {
        marginTop: 80,
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff'
    },
    input: {
        color: '#121212',
        backgroundColor: '#080808',
        width: '90%',
        borderRadius: 6,
        marginBottom: 10,
        paddingHorizontal: 8,
        height: 50,
        color: '#fff'
    },
    btn: {
        width: '90%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        borderRadius: 6
    },
    txtBtn: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 17
    }

})