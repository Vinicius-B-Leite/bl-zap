import React, { useEffect, useState } from 'react';
import { Button, View, TouchableOpacity, SafeAreaView, Text, StyleSheet, FlatList } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'



export default function ChatRoom({ navigation }) {
    const [chats, setChats] = useState([])

    function handleLogout() {
        auth().signOut().then(() => {
            navigation.navigate('SingIn')
        })
    }

    function handleChat(nome, id){
        if (auth().currentUser){
            navigation.navigate('Chat', {nome, id})
        }else{
            navigation.navigate('SingIn')
        }
    }
    useEffect(() => {

        async function getChats() {
            let data = await firestore()
                .collection('chats')
                .where('integrantes', 'array-contains', 'vinicius')
                .get()
            setChats([])
            data.docs.forEach(i => {
                let data = {
                    ...i.data(),
                    id: i.id
                }
                setChats(oldChat => [...oldChat, data])
            })

        }


        getChats()
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header} >
                <View style={styles.headerLeft}>
                    {
                        auth().currentUser && (
                            <TouchableOpacity onPress={handleLogout}>
                                <MaterialIcons name='arrow-back' size={23} color='#fff' />
                            </TouchableOpacity>
                        )
                    }
                    <Text style={styles.title}>BL ZAP</Text>
                </View>
                <TouchableOpacity>
                    <MaterialIcons name='search' size={28} color='#fff' />
                </TouchableOpacity>
            </View>
            <FlatList
                style={{ marginTop: '5%' }}
                contentContainerStyle={{paddingHorizontal: '5%'}}
                data={chats}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.chatCard} onPress={() => handleChat(item.nome, item.id)}>
                        <Text>{item.nome}</Text>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '7%',
        backgroundColor: '#080808',
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#48CAE4',
        paddingLeft: 10
    },
    chatCard: {
        backgroundColor: '#080808',
        padding: '5%',
        borderRadius: 12
    }
})