import React, { useCallback, useEffect, useState } from 'react';
import { View, TouchableOpacity, SafeAreaView, Text, StyleSheet, FlatList } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import ModalAddChat from '../../components/ModalAddChat';
import { useNavigation } from '@react-navigation/native';
import ModalChangePhoto from '../../components/ModalChangePhoto';



export default function ChatRoom({ navigation }) {
    const [chats, setChats] = useState([])
    const [modalodalAddChatt, setModalAddChat] = useState(false)
    const [modalProfile, setModalProfile] = useState(false)
    let isUserLogged = !!auth().currentUser


    function handleLogout() {
        auth().signOut().then(() => {
            navigation.navigate('SingIn')
            isUserLogged = false
        })
    }



    useEffect(() => {

        async function getGlobalChat() {
            setChats([])
            let data = await firestore().collection('chats').doc('lOOVcwIl5VzV2rYD0VbX').get()
            let newData = {
                ...data.data(),
                id: data.id
            }
            setChats(oldChat => [...oldChat, newData])
        }

        async function getChats() {
            if (isUserLogged) {
                let data = await firestore()
                    .collection('chats')
                    .where('integrantes', 'array-contains', auth()?.currentUser?.toJSON()?.uid)
                    .get()
                data?.docs?.forEach(i => {
                    let data = {
                        ...i.data(),
                        id: i.id
                    }
                    setChats(oldChat => [...oldChat, data])
                })
            }

        }
        getGlobalChat().then(() => {
            getChats()
        })
    }, [modalodalAddChatt, modalProfile])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header} >
                <View style={styles.headerLeft}>
                    {
                        auth().currentUser && (
                            <TouchableOpacity onPress={handleLogout} style={{ transform: [{ rotate: '180deg' }] }}>
                                <MaterialIcons name='logout' size={23} color='#fff' />
                            </TouchableOpacity>
                        )
                    }
                    <Text style={styles.title}>BL</Text><Text style={styles.subTitle}>zap</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => setModalAddChat(true)}>
                        <Entypo name='chat' size={25} color='#d3d3d3' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalProfile(true)}>
                        <FontAwesome name='user-circle-o' size={25} color='#d3d3d3' />
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                style={{ marginTop: '5%' }}
                contentContainerStyle={{ paddingHorizontal: '5%' }}
                data={chats}
                renderItem={({ item }) => <Item item={item} />}
            />

            {modalodalAddChatt && isUserLogged && <ModalAddChat visible={modalodalAddChatt} closeModal={() => setModalAddChat(false)} />}
            {modalProfile && isUserLogged && <ModalChangePhoto visible={modalProfile} closeModal={() => setModalProfile(false)} />}
        </SafeAreaView>
    );
}


function Item({ item }) {
    const navigation = useNavigation()

    function handleChat(nome, id) {
        if (auth().currentUser) {
            navigation.navigate('Chat', { nome, id })
        } else {
            navigation.navigate('SingIn')
        }
    }

    return (
        <TouchableOpacity style={styles.chatCard} onPress={() => handleChat(item.nome, item.id)}>
            <Text>{item.nome}</Text>
        </TouchableOpacity>
    )
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
        padding: '6%',
        backgroundColor: '#080808',
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
    subTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffffff',
        paddingLeft: 10
    },
    chatCard: {
        backgroundColor: '#080808',
        padding: '5%',
        borderRadius: 12,
        marginTop: 20
    },
    headerRight: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '25%'
    }
})