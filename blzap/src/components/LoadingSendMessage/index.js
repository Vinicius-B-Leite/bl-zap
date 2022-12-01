import React, { useContext, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { ChatContext } from '../../contexts/chat';

export default function LoadingSendMessage() {
    const { loadingsSendMessage } = useContext(ChatContext)

    const xLeftBubble = useRef(new Animated.Value(-100))
    const xMiddleBubble = useRef(new Animated.Value(-70))
    const xRightBubble = useRef(new Animated.Value(-40))

    const runLoadinAnimation = useRef(
        Animated.loop(
            Animated.parallel([
                Animated.timing(xRightBubble.current, {
                    toValue: 45,
                    duration: 1.8 * 1000,
                    useNativeDriver: true,
                    delay: 100
                }),
                Animated.timing(xMiddleBubble.current, {
                    toValue: 45,
                    duration: 1.8 * 1000,
                    useNativeDriver: true,
                    delay: 200
                }),
                Animated.timing(xLeftBubble.current, {
                    toValue: 45,
                    duration: 1.8 * 1000,
                    useNativeDriver: true,
                    delay: 300
                }),
            ])
        )
    ).current

    useEffect(() => loadingsSendMessage ? runLoadinAnimation.start() : xLeftBubble.setValue(0), [loadingsSendMessage])

    return <View style={[styles.btnSendMessage, { flexDirection: 'row', justifyContent: 'space-evenly' }]} >
        <Animated.View style={[styles.loading, { transform: [{ translateX: xLeftBubble.current }] }]} />
        <Animated.View style={[styles.loading, { transform: [{ translateX: xMiddleBubble.current }] }]} />
        <Animated.View style={[styles.loading, { transform: [{ translateX: xRightBubble.current }] }]} />
    </View>
}

const styles = StyleSheet.create({
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
    loading: {
        backgroundColor: '#fff',
        height: '20%',
        width: '20%',
        borderRadius: 20
    }
})