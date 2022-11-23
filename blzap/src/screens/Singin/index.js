import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import auth from '@react-native-firebase/auth'

export default function Singin({ navigation }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [type, setType] = useState(false)


    function handleLogin(){
        if (type){
            if (name === '' || email === '' || password === '') return

            auth().createUserWithEmailAndPassword(email, password)
            .then(({user}) => {
                user.updateProfile({
                    displayName: name
                }).then(() => {
                    navigation.goBack()
                })
                
            })
            
        }else{
            auth().signInWithEmailAndPassword(email, password)
            .then(() => navigation.goBack())
        }
    }

    return (
        <SafeAreaView style={styles.conteiner}>
            <Text style={styles.logo} >BL Zap</Text>
            <Text style={{color: '#000'}} >Ajude, colabore e faça networking!</Text>


            {
                type && <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder='Qual seu nome?'
                placeholderTextColor='#99999b'
            />
            }

            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder='Qual seu email?'
                placeholderTextColor='#99999b'
            />


            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder='*******'
                placeholderTextColor='#99999b'
                secureTextEntry
            />

            <TouchableOpacity 
                style={[styles.btn, {backgroundColor: type ? '#f53757' :  '#121212'}]}
                onPress={handleLogin}    
            >
                <Text style={styles.txtBtn}>{type ? 'Cadastrar' : 'Acessar'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setType(!type)}>
                <Text style={{color: '#000'}}>{type ? 'Já possuo uma conta' : 'Criar nova conta'}</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    conteiner: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    logo: {
        marginTop: 55,
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000'
    },
    input: {
        color: '#121212',
        backgroundColor: '#ebebeb',
        width: '90%',
        borderRadius: 6,
        marginBottom: 10,
        paddingHorizontal: 8,
        height: 50
    },
    btn:{
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