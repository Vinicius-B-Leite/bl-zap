import auth from '@react-native-firebase/auth'


export function getUid(){
    return auth().currentUser.toJSON().uid
}

export function isUserLogged(){
    return !!auth().currentUser
}

export function signOgout(goSignIn) {
    auth().signOut().then(() => {
        goSignIn()
    })
    return
}