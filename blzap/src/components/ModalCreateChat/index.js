import React, { useContext, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import firestore from '@react-native-firebase/firestore'
import Clipboard from '@react-native-community/clipboard';

import { ChatContext } from '../../contexts/chat';
import { AuthContext } from '../../contexts/auth';



export default function ModalCreateChat({ visible, closeModal }) {

    const [chatName, setChatName] = useState('')
    const [code, setCode] = useState(null)
    const { toRefreshChats } = useContext(ChatContext)
    const { userInfo } = useContext(AuthContext)

    async function createChat() {
        if (chatName !== '') {
            firestore().collection('chats').add({
                autor: userInfo.displayName,
                id: '',
                integrantes: [
                    userInfo.uid
                ],
                nome: chatName
            }).then(async (documentRef) => {
                await firestore().collection('chats').doc(documentRef.id).update({ id: documentRef.id })
                setCode(documentRef.id)
            })
        }
    }

    function copyToClipboard() {
        Clipboard.setString(code)
        ToastAndroid.show('Texto copiado', ToastAndroid.SHORT)
    }
    return (
        <Modal visible={visible} animationType='slide' transparent={true} onRequestClose={() => {
            closeModal()
            toRefreshChats()
        }}>
            <>
                <TouchableWithoutFeedback onPress={() => {
                    closeModal()
                    toRefreshChats()
                }}>
                    <View style={styles.screen}></View>
                </TouchableWithoutFeedback>
                <KeyboardAvoidingView enabled={false} behavior={'padding'} style={styles.main}>
                    <View>
                        <TextInput
                            style={styles.inp}
                            value={chatName}
                            onChangeText={setChatName}
                            placeholder='Digite o nome da sala'
                            placeholderTextColor='#303030'
                        />
                        <View style={[styles.inp, styles.viewCode]}>
                            <Text>{code ? code : 'O c??digo ir?? aparecer aqui'}</Text>
                            <TouchableOpacity onPress={copyToClipboard}>
                                <Feather name='clipboard' color='#fff' size={20} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.btn} onPress={createChat}>
                            <Text style={styles.btnText}>Criar</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </>
        </Modal>
    );
}

const styles = StyleSheet.create({

    main: {
        backgroundColor: '#080808',
        position: 'absolute',
        bottom: 0,
        padding: '5%',
        width: '100%',
        height: '40%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        zIndex: 2
    },
    inp: {
        backgroundColor: '#121212',
        paddingLeft: 20,
        borderRadius: 10,
        marginTop: '5%',
        alignItems: 'center'
    },
    btn: {
        backgroundColor: '#48CAE4',
        padding: '2%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '5%',
        borderRadius: 8
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
    },
    screen: {
        flex: 1,
        backgroundColor: 'rgba(18, 18, 18, 0.9)'

    },
    viewCode: {
        flexDirection: 'row',
        height: '27%',
        justifyContent: 'space-between',
        paddingRight: 20
    }
})