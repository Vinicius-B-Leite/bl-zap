import firestore from '@react-native-firebase/firestore'
import { getUid } from './auth'


export function sendMessage(setNewMsg, newMsg, chatId) {
    if (newMsg.length > 0) {
        setNewMsg('')
        firestore()
            .collection('chats')
            .doc(chatId)
            .collection('mensagens')
            .add({
                texto: newMsg,
                hora: firestore.FieldValue.serverTimestamp(),
                uid: getUid()
            })
    }
}

export function listnerMessages(chatId, setMsgs) {
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
            setMsgs(msg)
        })
}


export async function getGlobalChat(setChats) {
    setChats([])
    let data = await firestore().collection('chats').doc('lOOVcwIl5VzV2rYD0VbX').get()
    let newData = {
        ...data.data(),
        id: data.id
    }
    return newData
}