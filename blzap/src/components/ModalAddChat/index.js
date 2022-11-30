import React, { useContext, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View, TouchableOpacity, ActivityIndicator } from 'react-native';

import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import ChatProvider, { ChatContext } from '../../contexts/chat';


export default function ModalAddChat({ visible, closeModal }) {
    const { searchChat, loadingSearch } = useContext(ChatContext)
    const [code, setCode] = useState('')


    return (
        <Modal visible={visible} animationType='slide' transparent={true} onRequestClose={closeModal}>
            <>
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={styles.screen}></View>
                </TouchableWithoutFeedback>
                <View style={styles.main}>
                    <TextInput
                        style={styles.inp}
                        value={code}
                        onChangeText={setCode}
                        placeholder='Informe o código da sala'
                        placeholderTextColor='#303030'
                    />
                    <TouchableOpacity style={styles.btn} onPress={() => searchChat(code, closeModal)}>
                        <Text style={styles.btnText}>{loadingSearch ? <ActivityIndicator/> : 'Enviar'}</Text>
                    </TouchableOpacity>
                </View>
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
        marginTop: '5%'
    },
    btn: {
        backgroundColor: '#48CAE4',
        padding: '2%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '5%'
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
    },
    screen: {
        flex: 1,
        backgroundColor: 'rgba(18, 18, 18, 0.9)'

    }
})