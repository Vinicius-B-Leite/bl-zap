import React, { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { launchImageLibrary } from 'react-native-image-picker';

import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'



export default function ModalChangePhoto({ visible, closeModal }) {

    const [photo, setPhoto] = useState(auth().currentUser.toJSON().photoURL)

    async function pickImage() {
        const response = await launchImageLibrary({
            mediaType: 'photo',
        })

        const ref = storage().ref(auth().currentUser.toJSON().uid)
        await ref.putFile(response.assets[0].uri)

        let downloadURL = await ref.getDownloadURL()

        await auth().currentUser.updateProfile({photoURL: downloadURL})

        setPhoto(auth().currentUser.toJSON().photoURL)

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
        marginTop: '5%'
    }
})