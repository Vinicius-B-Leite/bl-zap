import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';

import Feather from 'react-native-vector-icons/Feather'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'


export default function Chat({ route }) {
    const navigation = useNavigation()
    const [msgs, setMsgs] = useState([])
    const [newMsg, setNewMsg] = useState('')
    const photouri = auth().currentUser.toJSON().photoURL
    const userName = auth().currentUser.toJSON().displayName

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

    function sendMessage() {
        firestore().collection('chats').doc(route.params.id).collection('mensagens').add({ autor: auth().currentUser.toJSON().displayName, texto: newMsg, hora: new Date() })
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
                style={{ flex: 1, padding: '5%' }}
                renderItem={({ item }) => (
                    <View style={
                        [styles.mensagem, { justifyContent: userName == item.autor ? 'flex-end' : 'flex-start',  marginVertical: userName !== item.autor ? 10 : 0}]}>
                        {
                            userName !== item.autor &&
                            (<Image
                                source={{ uri: !!photouri ? photouri : 'https://www.showmetech.com.br/wp-content/uploads//2021/02/capa-dog-1920x1024.jpg' }}
                                style={styles.img}
                            />)
                        }
                        <View>
                            {auth().currentUser.toJSON().displayName !== item.autor && <Text style={styles.owner}>{item.autor}</Text>}
                            <Text>{item.texto}</Text>
                        </View>
                    </View>
                )}
            />

            <View style={styles.inpContainer}>
                <TextInput
                    value={newMsg}
                    onChangeText={setNewMsg}
                    style={styles.inp}
                    placeholder='Escreva uma mensagem'
                    placeholderTextColor='#d3d3d3'
                    onEndEditing={sendMessage}
                />
                <TouchableOpacity>
                    <Feather name='send' size={20} color='#48CAE4' />
                </TouchableOpacity>
            </View>
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
    mensagem: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        
    },
    inp: {
    },
    inpContainer: {
        backgroundColor: '#080808',
        borderRadius: 20,
        marginHorizontal: '5%',
        marginBottom: '3%',
        paddingLeft: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15
    },
    img: {
        width: 30, 
        height: 30,
        marginRight: 10,
        borderRadius: 15,
        resizeMode: 'cover'

    },
    owner:{
        color: '#48CAE4'
    }
})