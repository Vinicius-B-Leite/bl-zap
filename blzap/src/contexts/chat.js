import React, { createContext, useContext, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from './auth';
import storage from '@react-native-firebase/storage'

export const ChatContext = createContext()

export default function ChatProvider({ children }) {
    const [chats, setChats] = useState([])
    const [messages, setMessages] = useState([])
    const [refreshChats, setRefreshChats] = useState(false)

    const { userInfo, isUserLogged } = useContext(AuthContext)
    const [loadingSearch, setLoadingSearch] = useState(false)
    const [loadingsSendMessage, setLoadingSendMessage] = useState(false)

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
        console.log(isUserLogged)
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

    function sendMessage(setNewMsg, newMsg, chatId, type, imageURI) {
        if (newMsg.length > 0 && type == 'texto' || imageURI.length > 0 && type == 'imagem') {

            setLoadingSendMessage(true)

            setNewMsg('')
            firestore()
                .collection('chats')
                .doc(chatId)
                .collection('mensagens')
                .add({
                    texto: newMsg,
                    hora: firestore.FieldValue.serverTimestamp(),
                    uid: userInfo.uid,
                    tipo: type,
                    imagemURL: imageURI ? imageURI : ''
                }).finally(() => {
                    setLoadingSendMessage(false)
                })

            
        }
    }

    async function uploadoToStorage(uri, chatId) {
        setLoadingSendMessage(true)
        const ref = storage().ref(`chats/${chatId}/${userInfo.uid}_${new Date()}`)
        await ref.putFile(uri)
        setLoadingSendMessage(false)
        return await ref.getDownloadURL()
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

    async function getMessage(userUID) {
        let data = await firestore().collection('users').doc(userUID).get()
        return { owner: data?.data()?.nome, photo: data?.data()?.foto }
    }

    return (
        <ChatContext.Provider value={{
            chats,
            goOutChat,
            toRefreshChats,
            searchChat,
            loadingSearch,
            sendMessage,
            listnerMessages,
            messages,
            getMessage,
            uploadoToStorage,
            loadingsSendMessage
        }}>
            {children}
        </ChatContext.Provider>
    );
}