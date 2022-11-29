import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, SafeAreaView, Text, StyleSheet, FlatList, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import ModalAddChat from '../../components/ModalAddChat';
import { useNavigation } from '@react-navigation/native';
import ModalChangePhoto from '../../components/ModalProfile';
import Ionicons from 'react-native-vector-icons/Ionicons'
import ModalCreateChat from '../../components/ModalCreateChat';
import { AuthContext } from '../../contexts/auth';


export default function ChatRoom({ navigation }) {
    const { isUserLogged, handleLogout } = useContext(AuthContext)

    const [chats, setChats] = useState([])
    const [modalodalAddChatt, setModalAddChat] = useState(false)
    const [modalProfile, setModalProfile] = useState(false)
    const [createChatModal, setCreateChatModal] = useState(false)
    const [refresh, setRefresh] = useState(true)



    

    function handleDeleteChatOnState(item) {
        setChats(oldChat => {
            console.log('entrou')
            let index = oldChat.indexOf(item)
            oldChat.splice(index, 1)
            return oldChat
        })
    }

    function refreshChats() {
        setRefresh(!refresh)
    }

    useEffect(() => {

        async function getGlobalChat() {
            setChats([])
            let data = await firestore().collection('chats').doc('lOOVcwIl5VzV2rYD0VbX').get()
            let newData = {
                ...data.data(),
                id: data.id
            }
            return newData
        }

        async function getChats() {
            var chatsData = [await getGlobalChat()]
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
                    chatsData.push(data)
                })

            }
            setChats(chatsData)

        }
        getChats()
    }, [refresh])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header} >
                <View style={styles.headerLeft}>
                    {
                        auth().currentUser && (
                            <TouchableOpacity onPress={() => handleLogout(() => navigation.navigate('SingIn'))} style={{ transform: [{ rotate: '180deg' }] }}>
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
                renderItem={({ item }) => <Item item={item} handleDeleteChatOnState={handleDeleteChatOnState} refreshChats={refreshChats} />}
            />

            <TouchableOpacity style={styles.createChat} onPress={() => setCreateChatModal(true)}>
                <Ionicons name='add-circle' color='#48CAE4' size={70} />
            </TouchableOpacity>


            {modalodalAddChatt && isUserLogged && <ModalAddChat refreshChats={refreshChats} visible={modalodalAddChatt} closeModal={() => setModalAddChat(false)} />}
            {createChatModal && isUserLogged && <ModalCreateChat refreshChats={refreshChats} visible={createChatModal} closeModal={() => setCreateChatModal(false)} />}
            {modalProfile && isUserLogged && <ModalChangePhoto visible={modalProfile} closeModal={() => setModalProfile(false)} />}
        </SafeAreaView>
    );
}


function Item({ item, handleDeleteChatOnState, refreshChats }) {
    const navigation = useNavigation()

    function handleNavigateChat(nome, id) {
        if (auth().currentUser) {
            navigation.navigate('Chat', { nome, id })
        } else {
            navigation.navigate('SingIn')
        }
    }

    function handleGoOut() {


        async function goOutChat() {
            handleDeleteChatOnState(item)
            let documentSnapshot = await firestore().collection('chats').doc(item.id).get()

            let { integrantes } = documentSnapshot.data()

            let index = integrantes.indexOf(auth().currentUser.uid)

            integrantes.splice(index, 1)

            await firestore().collection('chats').doc(item.id).update({ integrantes: integrantes })
            refreshChats()
        }
        Alert.alert(
            'Sair do chat',
            'Você deseja sair deste chat?',
            [
                {
                    text: 'Continuar',
                    onPress: () => goOutChat(),
                },

                {
                    text: 'Cancelar',
                    style: 'cancel'
                }
            ]
        )
    }
    return (
        <TouchableOpacity style={styles.chatCard} onPress={() => handleNavigateChat(item.nome, item.id)} onLongPress={handleGoOut}>
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
    },
    createChat: {
        position: 'absolute',
        right: '5%',
        bottom: '3%',
    }
})