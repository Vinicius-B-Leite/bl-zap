import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';


import auth, { firebase } from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'


export default function Chat({ route }) {
    const navigation = useNavigation()
    const [msgs, setMsgs] = useState([])
    const [newMsg, setNewMsg] = useState('')


    useEffect(() => {

        let listner = firestore()
            .collection('chats')
            .doc(route.params.id)
            .collection('mensagens')
            .orderBy('hora', 'desc')
            .onSnapshot((snapshotQuery) => {
                setMsgs([])

                snapshotQuery.docs.forEach(doc => {
                    setMsgs(oldD => [...oldD, doc.data()])
                })
            })


        return () => listner()
    }, [])

    function sendMessage(){
        firestore().collection('chats').doc(route.params.id).collection('mensagens').add({autor: auth().currentUser.toJSON().displayName, texto: newMsg, hora: new Date()})
        .finally(() => setNewMsg(''))
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{route.params.nome}</Text>
            </View>
            <FlatList
                inverted={true}
                data={msgs}
                style={{flex: 1, padding: '5%'}}
                renderItem={({ item }) => (
                    <View style={
                        [styles.mensagem, {alignItems: auth().currentUser.toJSON().displayName == item.autor ? 'flex-end' : 'flex-start'}]}>
                        {auth().currentUser.toJSON().displayName !== item.autor && <Text>{item.autor}</Text>}
                        <Text>{item.texto}</Text>
                    </View>
                )}
            />

            <TextInput
                value={newMsg}
                onChangeText={setNewMsg}
                style={styles.inp}
                placeholder='Escreva uma mensagem'
                placeholderTextColor='#fff'
                onEndEditing={sendMessage}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212'
    },
    header: {
        padding: '5%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#080808'
    },
    backButton: {
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 20
    },
    title: {
        fontSize: 20
    },
    mensagem:{
        width: '100%'
    },
    inp: {
        backgroundColor: '#080808',
        borderRadius: 20,
        marginHorizontal: '5%',
        marginBottom: '3%',
        paddingLeft: 20
    }
})