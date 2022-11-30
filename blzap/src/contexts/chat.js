import React, { createContext, useContext, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from './auth';


export const ChatContext = createContext()

export default function ChatProvider({ children }) {
    const [chats, setChats] = useState([])
    const [messages, setMessages] = useState([])
    const [refreshChats, setRefreshChats] = useState(false)

    const { userInfo, isUserLogged } = useContext(AuthContext)

    const [loadingSearch, setLoadingSearch] = useState(false)

    useEffect(() => {
        getChats()
    }, [refreshChats])



    async function getGlobalChat() {
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
                .where('integrantes', 'array-contains', userInfo.uid)
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
    async function goOutChat(itemId) {
        let documentSnapshot = await firestore().collection('chats').doc(itemId).get()

        let { integrantes } = documentSnapshot.data()

        let index = integrantes.indexOf(userInfo.uid)

        integrantes.splice(index, 1)

        await firestore().collection('chats').doc(itemId).update({ integrantes: integrantes })

        toRefreshChats()
    }

    function toRefreshChats() {
        setRefreshChats(!refreshChats)
    }

    async function searchChat(code, closeModal) {
        setLoadingSearch(true)
        let doc = await firestore()
            .collection('chats')
            .where('id', '==', code)
            .get()


        let data = doc.docs.map(i => (i.data()))[0]

        if (!data.integrantes.includes(userInfo.uid)) {


            let uid = userInfo.uid

            await firestore().collection('chats').doc(data.id).update({ integrantes: [...data.integrantes, uid] })

            setLoadingSearch(false)
            toRefreshChats()
            closeModal()
        }

        setLoadingSearch(false)
        closeModal()
    }

    function sendMessage(setNewMsg, newMsg, chatId) {
        if (newMsg.length > 0) {
            setNewMsg('')
            firestore()
                .collection('chats')
                .doc(chatId)
                .collection('mensagens')
                .add({
                    texto: newMsg,
                    hora: firestore.FieldValue.serverTimestamp(),
                    uid: userInfo.uid
                })
        }
    }

    function listnerMessages(chatId) {
        return firestore()
            .collection('chats')
            .doc(chatId)
            .collection('mensagens')
            .orderBy('hora', 'desc')
            .onSnapshot((snapshotQuery) => {
                const msg = []
    
                snapshotQuery.docs.forEach(doc => {
                    msg.push({ ...doc.data(), id: doc.id })
                })
                setMessages(msg)
            })
    }
    
    

    return (
        <ChatContext.Provider value={{ chats, goOutChat, toRefreshChats, searchChat, loadingSearch, sendMessage, listnerMessages, messages }}>
            {children}
        </ChatContext.Provider>
    );
}