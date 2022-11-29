import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';

import Feather from 'react-native-vector-icons/Feather'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { listnerMessages, sendMessage } from '../../services/firebase/firestore';


export default function Chat({ route }) {
    const navigation = useNavigation()
    const [msgs, setMsgs] = useState([])
    const [newMsg, setNewMsg] = useState('')

    useEffect(() => {

        listnerMessages(route.params.id, setMsgs)

        return () => listnerMessages()
    }, [])

   

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('ChatRoom')}>
                    <Text style={styles.backButton}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{route.params.nome}</Text>
            </View>
            <FlatList
                inverted={true}
                data={msgs}
                style={{ flex: 1, padding: '5%' }}
                renderItem={({ item }) => <Item item={item} />}
            />

            <View style={styles.inpContainer}>
                <TextInput
                    value={newMsg}
                    onChangeText={setNewMsg}
                    style={styles.inp}
                    placeholder='Escreva uma mensagem'
                    placeholderTextColor='#d3d3d3'
                    autoCorrect={true}                    
                    multiline={true}
                    scrollEnabled={true}
                />
                <TouchableOpacity onPress={() => sendMessage(setNewMsg, newMsg, route.params.id)} style={styles.btnSendMessage}>
                    <Feather name='send' size={20} color='#48CAE4' />
                </TouchableOpacity>
            </View>
        </View>
    );
}


function Item({ item }) {

    const [isMyMessage, setIsMyMessage] = useState(true)
    const [owner, setOwner] = useState('')
    const [photo, setPhoto] = useState('https://img.favpng.com/7/5/8/computer-icons-font-awesome-user-font-png-favpng-YMnbqNubA7zBmfa13MK8WdWs8.jpg')

    useEffect(() => {

        setIsMyMessage(item.uid == auth().currentUser.toJSON().uid)


        firestore().collection('users').doc(item.uid).get().then(documentSnapshot => {
            setOwner(documentSnapshot?.data()?.nome)
            setPhoto(documentSnapshot?.data()?.foto)
        })
    }, [item])


    return (
        <View style={
            [styles.mensagem, {
                justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                marginVertical: isMyMessage ? 2 : 10
            }]}>
            {
                !isMyMessage &&
                (<Image
                    source={{ uri: photo }}
                    style={styles.img}
                />)
            }
            <View>
                {!isMyMessage && <Text style={styles.owner}>{owner}</Text>}
                <Text>{item.texto}</Text>
            </View>
        </View>
    )
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
        paddingHorizontal: 15,
        position: 'relative',
        maxHeight: 200
    },
    img: {
        width: 30,
        height: 30,
        marginRight: 10,
        borderRadius: 15,
        resizeMode: 'cover'

    },
    owner: {
        color: '#48CAE4'
    },
    btnSendMessage: {
        width: '15%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 5,
        right: 5,
    }
})