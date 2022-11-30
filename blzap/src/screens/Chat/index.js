import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Animated, Dimensions } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

import Feather from 'react-native-vector-icons/Feather'
import { ChatContext } from '../../contexts/chat';
import { AuthContext } from '../../contexts/auth';

const AnimatedImagePicker = Animated.createAnimatedComponent(TouchableOpacity)


export default function Chat({ route }) {
    const { sendMessage, listnerMessages, messages, uploadoToStorage } = useContext(ChatContext)
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
        let uri = ''

        const opt = {
            mediaType: 'photo', 
            selectionLimit: 1
        }

        launchImageLibrary(opt, async ({assets}) => {
            uri = assets[0].uri
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
                renderItem={({ item }) => <Item item={item} />}
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

                    <TouchableOpacity activeOpacity={0.9} onPress={() => sendMessage(setNewMsg, newMsg, route.params.id, 'texto')} style={styles.btnSendMessage}>
                        <Feather name='send' size={20} color='#fff' />
                    </TouchableOpacity>

                </View>
            </View>
        </View >
    );
}


function Item({ item }) {
    const { userInfo } = useContext(AuthContext)
    const { getMessage } = useContext(ChatContext)
    const [isMyMessage, setIsMyMessage] = useState(true)
    const [owner, setOwner] = useState('')
    const [photo, setPhoto] = useState('https://img.favpng.com/7/5/8/computer-icons-font-awesome-user-font-png-favpng-YMnbqNubA7zBmfa13MK8WdWs8.jpg')

    useEffect(() => {

        setIsMyMessage(item.uid == userInfo.uid)
        let { owner: ownerMessage, photo: avatar } = getMessage(item.uid)
        setOwner(ownerMessage)
        setPhoto(avatar)

    }, [item])


    return (
        <View style={
            [styles.mensagem, {
                justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                marginVertical: isMyMessage ? 4 : 10
            }]}>
            {
                !isMyMessage &&
                (<Image
                    source={{ uri: photo }}
                    style={styles.img}
                />)
            }
            <View >
                {!isMyMessage && <Text style={styles.owner}>{owner}</Text>}
                {item.tipo === 'texto' && <Text>{item.texto}</Text>}
                {item.tipo === 'imagem' && <Image source={{uri: item.imagemURL}} style={styles.imagemAsMessage}/>}
            </View>
        </View>
    )
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
    mensagem: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',

    },
    inp: {
    },
    inpContainer: {
        backgroundColor: '#080808',
        borderRadius: 20,
        marginHorizontal: '5%',
        marginBottom: '3%',
        paddingLeft: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        maxHeight: 200
    },
    img: {
        width: 30,
        height: 30,
        marginRight: 10,
        borderRadius: 15,
        resizeMode: 'cover'

    },
    owner: {
        color: '#48CAE4'
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
        borderRadius: 30
    },
    containerActions: {
        flexDirection: 'row',
        position: 'relative',
        justifyContent: 'space-between',
        width: '30%',
        height: '100%',
        alignItems: 'center'
    },
    imagemAsMessage:{
        width: Dimensions.get('screen').width / 2,
        height: Dimensions.get('screen').height / 3,
        borderRadius: 10,
        resizeMode: 'cover',
        
    }
})