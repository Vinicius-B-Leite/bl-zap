import React, { useState } from 'react';
import {KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import firestore from '@react-native-firebase/firestore'
import Clipboard from '@react-native-community/clipboard';

import auth from '@react-native-firebase/auth'



export default function ModalCreateChat({ visible, closeModal, refreshChats }) {

    const [chatName, setChatName] = useState('')
    const [code, setCode] = useState(null)

    async function createChat() {
        if (chatName !== '') {
            firestore().collection('chats').add({
                autor: auth().currentUser.toJSON().displayName,
                id: '',
                integrantes: [
                    auth().currentUser.toJSON().uid
                ],
                nome: chatName
            }).then(async (documentRef) => {
                await firestore().collection('chats').doc(documentRef.id).update({ id: documentRef.id })
                setCode(documentRef.id)
                
            })
        }
    }

    function copyToClipboard(){
        Clipboard.setString(code)
    }
    return (
        <Modal visible={visible} animationType='slide' transparent={true} onRequestClose={() => {
            closeModal()
            refreshChats()}}>
            <>
                <TouchableWithoutFeedback onPress={() => {
                    closeModal()
                    refreshChats()
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
                            <Text>{code ? code : 'O código irá aparecer aqui'}</Text>
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