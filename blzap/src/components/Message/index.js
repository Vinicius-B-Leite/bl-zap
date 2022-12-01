import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../../contexts/auth';
import { ChatContext } from '../../contexts/chat';

export default function Message({item}) {
    const { userInfo } = useContext(AuthContext)
    const { getMessage } = useContext(ChatContext)
    const [isMyMessage, setIsMyMessage] = useState(true)
    const [owner, setOwner] = useState('')
    const [photo, setPhoto] = useState('https://img.favpng.com/7/5/8/computer-icons-font-awesome-user-font-png-favpng-YMnbqNubA7zBmfa13MK8WdWs8.jpg')

    useEffect(() => {

        setIsMyMessage(item.uid == userInfo.uid)
        getMessage(item.uid).then((snapshot) => {
            setOwner(snapshot.owner)
            setPhoto(snapshot.photo)
        })

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
                {item.tipo === 'imagem' && <Image source={{ uri: item.imagemURL }} style={styles.imagemAsMessage} />}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mensagem: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
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
    
    imagemAsMessage: {
        width: Dimensions.get('screen').width / 2,
        height: Dimensions.get('screen').height / 3,
        borderRadius: 10,
        resizeMode: 'cover',

    },
})