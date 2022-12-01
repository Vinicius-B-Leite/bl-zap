import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Animated, Dimensions } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

import Feather from 'react-native-vector-icons/Feather'
import { ChatContext } from '../../contexts/chat';
import { AuthContext } from '../../contexts/auth';
import LoadingSendMessage from '../../components/LoadingSendMessage';
import Message from '../../components/Message';

const AnimatedImagePicker = Animated.createAnimatedComponent(TouchableOpacity)


export default function Chat({ route }) {
    const { sendMessage, listnerMessages, messages, uploadoToStorage, loadingsSendMessage } = useContext(ChatContext)
    const navigation = useNavigation()
    const [newMsg, setNewMsg] = useState('')
    const xImagePicker = useRef(new Animated.Value(0)).current

    useEffect(() => {

        let listner = listnerMessages(route.params.id)

        return () => listner()
    }, [])


    function runAnimationImagePicker(toValue) {
        Animated.timing(xImagePicker, {
            toValue,
            useNativeDriver: true,
            duration: 0.3 * 1000, //0.3 seconds
        }).start()
    }

    function pickImage() {

        const opt = {
            mediaType: 'photo',
            selectionLimit: 1
        }

        launchImageLibrary(opt, async ({ assets }) => {
            let uri = assets[0].uri
            let downloadURL = await uploadoToStorage(uri, route.params.id)
            sendMessage(setNewMsg, newMsg, route.params.id, 'imagem', downloadURL)
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('ChatRoom')}>
                    <Text style={styles.backButton}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{route.params.nome}</Text>
            </View>
            <FlatList
                inverted={true}
                data={messages}
                style={{ flex: 1, paddingHorizontal: '5%' }}
                renderItem={({ item }) => <Message item={item} />}
            />

            <View style={styles.inpContainer}>
                <TextInput
                    value={newMsg}
                    onChangeText={(text) => {
                        runAnimationImagePicker(text.length > 0 ? 40 : 0)
                        setNewMsg(text)
                    }}
                    onDe
                    style={styles.inp}
                    placeholder='Escreva uma mensagem'
                    placeholderTextColor='#d3d3d3'
                    autoCorrect={true}
                    multiline={true}
                    scrollEnabled={true}
                />

                <View style={styles.containerActions}>

                    <AnimatedImagePicker style={{ transform: [{ translateX: xImagePicker }] }} onPress={pickImage}>
                        <Feather name='image' size={20} color='#48CAE4' />
                    </AnimatedImagePicker>

                    {
                        loadingsSendMessage ?
                            <LoadingSendMessage />
                            :
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => sendMessage(setNewMsg, newMsg, route.params.id, 'texto')}
                                style={styles.btnSendMessage}>
                                <Feather name='send' size={20} color='#fff' />
                            </TouchableOpacity>
                    }

                </View>
            </View>
        </View >
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212'
    },
    header: {
        padding: '5%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#080808'
    },
    backButton: {
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 20
    },
    title: {
        fontSize: 20
    }, 
    inp: {
    },
    inpContainer: {
        backgroundColor: '#080808',
        borderRadius: 20,
        marginHorizontal: '5%',
        marginBottom: '3%',
        marginTop: '5%',
        paddingLeft: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        maxHeight: 200
    },
    btnSendMessage: {
        width: '50%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#48CAE4',
        borderRadius: 30,
        overflow: 'hidden'
    },
    containerActions: {
        flexDirection: 'row',
        position: 'relative',
        justifyContent: 'space-between',
        width: '30%',
        height: '100%',
        alignItems: 'center'
    },
    
})