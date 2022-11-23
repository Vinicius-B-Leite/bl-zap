import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';


import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'


var autor = 'vinicius '
export default function Chat({ route }) {
    const navigation = useNavigation()
    const [msgs, setMsgs] = useState([])


    useEffect(() => {

        let listner = firestore()
            .collection('chats')
            .doc(route.params.id)
            .collection('mensagens')
            .onSnapshot((snapshotQuery) => {
                setMsgs([])

                snapshotQuery.docs.forEach(doc => {
                    autor = doc.data().autor
                    console.log("🚀 ~ file: index.js ~ line 27 ~ .onSnapshot ~ autor", autor)
                    setMsgs(oldD => [...oldD, doc.data()])
                })
            })


        return () => listner()
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{route.params.nome}</Text>
            </View>
            <FlatList
                data={msgs}
                style={{flex: 1}}
                renderItem={({ item }) => (
                    <View style={styles.mensagem}>
                        <Text>{item.autor}</Text>
                        <Text>{item.texto}</Text>
                    </View>
                )}
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
        marginLeft: 'vinicius ' === autor ? 300 : 10,
        width: '100%'
    }
})