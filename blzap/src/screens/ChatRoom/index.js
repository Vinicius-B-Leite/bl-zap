import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, SafeAreaView, Text, StyleSheet, FlatList, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import ModalAddChat from '../../components/ModalAddChat';
import { useNavigation } from '@react-navigation/native';
import ModalChangePhoto from '../../components/ModalProfile';
import Ionicons from 'react-native-vector-icons/Ionicons'
import ModalCreateChat from '../../components/ModalCreateChat';
import { AuthContext } from '../../contexts/auth';
import { ChatContext } from '../../contexts/chat';


export default function ChatRoom({ navigation }) {
    const { isUserLogged, handleLogout } = useContext(AuthContext)
    const { chats } = useContext(ChatContext)

    const [modalodalAddChatt, setModalAddChat] = useState(false)
    const [modalProfile, setModalProfile] = useState(false)
    const [createChatModal, setCreateChatModal] = useState(false)

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header} >
                <View style={styles.headerLeft}>
                    {
                        isUserLogged && (
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
                renderItem={({ item }) => <Item item={item} />}
            />

            <TouchableOpacity style={styles.createChat} onPress={() => setCreateChatModal(true)}>
                <Ionicons name='add-circle' color='#48CAE4' size={70} />
            </TouchableOpacity>


            {modalodalAddChatt && isUserLogged && <ModalAddChat visible={modalodalAddChatt} closeModal={() => setModalAddChat(false)} />}
            {createChatModal && isUserLogged && <ModalCreateChat visible={createChatModal} closeModal={() => setCreateChatModal(false)} />}
            {modalProfile && isUserLogged && <ModalChangePhoto visible={modalProfile} closeModal={() => setModalProfile(false)} />}
        </SafeAreaView>
    );
}


function Item({ item }) {
    const navigation = useNavigation()
    const { isUserLogged } = useContext(AuthContext)
    const { goOutChat } = useContext(ChatContext)



    function handleNavigateChat() {
        if (isUserLogged) {
            navigation.navigate('Chat', { nome: item.nome, id: item.id })
        } else {
            navigation.navigate('SingIn')
        }
    }

    function handleGoOut() {
        Alert.alert(
            'Sair do chat',
            'Você deseja sair deste chat?',
            [
                {
                    text: 'Continuar',
                    onPress: () => goOutChat(item.id),
                },

                {
                    text: 'Cancelar',
                    style: 'cancel'
                }
            ]
        )
    }
    return (
        <TouchableOpacity style={styles.chatCard} onPress={() => handleNavigateChat()} onLongPress={handleGoOut}>
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