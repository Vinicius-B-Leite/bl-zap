import React, { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { launchImageLibrary } from 'react-native-image-picker';

import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'



export default function ModalChangePhoto({ visible, closeModal }) {

    const [photo, setPhoto] = useState(auth().currentUser.toJSON().photoURL)
    const [newName, setNewName] = useState(null)
    const [newEmail, setNewEmail] = useState(null)
    const [newPassword, setNewPassword] = useState(null)
    const [newPhoto, setNewPhoto] = useState(null)
    const [isLoading, setIsLoading] = useState(false)


    async function pickImage() {
        const response = await launchImageLibrary({
            mediaType: 'photo',
        })

        if (response.didCancel) return


        setNewPhoto(response.assets[0].uri)
        setPhoto(response.assets[0].uri)

    }

    async function updatePhoto(file) {
        const ref = storage().ref(auth().currentUser.toJSON().uid)
        await ref.putFile(file)


        let downloadURL = await ref.getDownloadURL()
        await auth().currentUser.updateProfile({ photoURL: downloadURL })
        await firestore()
                .collection('users')
                .doc(auth().currentUser.toJSON().uid)
                .update({ foto: downloadURL })
    }

    async function saveAll() {
        setIsLoading(true)
        if (newName) {
            await auth().currentUser.updateProfile({ displayName: newName })
            await firestore()
                .collection('users')
                .doc(auth().currentUser.toJSON().uid)
                .update({ nome: newName })
        }
        if (newEmail) await auth().currentUser.updateEmail(newEmail)
        if (newPassword) await auth().currentUser.updatePassword(newEmail)
        if (newPhoto) await updatePhoto(newPhoto)
        setIsLoading(false)
        closeModal()
    }

    return (
        <Modal visible={visible} onRequestClose={closeModal} animationType='slide' >
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={closeModal}>
                        <FontAwesome name='arrow-left' size={18} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Perfil</Text>
                </View>

                <View style={styles.main}>
                    <TouchableOpacity onPress={pickImage}>
                        <Image
                            source={{ uri: photo ? photo : 'https://www.showmetech.com.br/wp-content/uploads//2021/02/capa-dog-1920x1024.jpg' }}
                            style={styles.userPhoto}
                        />
                    </TouchableOpacity>

                    <TextInput
                        value={newName}
                        onChangeText={setNewName}
                        placeholder={auth().currentUser.toJSON().displayName}
                        placeholderTextColor='#949494'
                        style={styles.inp}
                    />

                    <TextInput
                        value={newEmail}
                        onChangeText={setNewEmail}
                        placeholder={auth().currentUser.toJSON().email}
                        placeholderTextColor='#949494'
                        style={styles.inp}
                    />

                    <TextInput
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder='*******'
                        placeholderTextColor='#949494'
                        style={styles.inp}
                    />

                    <TouchableOpacity style={styles.btn} onPress={saveAll}>
                        <Text style={styles.textBtn}>{isLoading ? <ActivityIndicator size={20} color='#fff' /> : 'Salvar'}</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#121212',
        flex: 1,
    },
    header: {
        padding: '5%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        paddingLeft: '5%',
        fontSize: 18
    },
    main: {
        flex: 1,
        alignItems: 'center'
    },
    userPhoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: '5%',
        marginBottom: '5%'
    },
    inp: {
        backgroundColor: '#080808',
        width: '80%',
        paddingLeft: 20,
        marginTop: '5%',
        borderRadius: 10
    },
    btn: {
        backgroundColor: '#48CAE4',
        width: '80%',
        paddingLeft: 20,
        marginTop: '5%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2%',
        borderRadius: 10
    },
    textBtn: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#fff'
    }
})