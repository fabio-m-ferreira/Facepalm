import FireBaseKeys from './Config';
import firebase from 'firebase';
import 'firebase/firestore';

class Fire{
    constructor(){
        firebase.initializeApp(FireBaseKeys);
    };
    
    createUser = async (user, registerScreenThis) => {
        let remoteUri = null
        let _this = registerScreenThis

        try {
            await firebase.auth().createUserWithEmailAndPassword(user.email, user.password)

            let db = this.firestore.collection('users').doc(this.uid)

            db.set({
                uid: this.uid,
                name: user.name,
                email : user.email,
                avatar: null,
                backgroundImage: null
            })

            if (user.avatar) {
                remoteUri = await this.uploadPhotoAsync(user.avatar, `avatars/${this.uid}`);

                db.set({ avatar: remoteUri }, {merge: true});
            }

            if (user.backgroundImage) {
                remoteUri = await this.uploadPhotoAsync(user.backgroundImage, `backgroundImages/${this.uid}`);

                db.set({ backgroundImage: remoteUri }, {merge: true});
            }
        } catch (error) {
            _this.setState({ errorMessage: error.message })
        }
    };

    updateUserAvatar = async (user) => {

        let remoteUri = null

        try {
            let db = this.firestore.collection('users').doc(this.uid)

            if (user.avatar) {

                remoteUri = await this.uploadPhotoAsync(user.avatar, `avatars/${this.uid}`);

                db.set({ avatar: remoteUri }, {merge: true});
            }
        } catch (error) {
            alert('error: ', error.message )
        }

    };

    updateUserBackgroundImage  = async (user) => {

        let remoteUri = null

        try {
            let db = this.firestore.collection('users').doc(this.uid)

            if (user.backgroundImage) {
                remoteUri = await this.uploadPhotoAsync(user.backgroundImage, `backgroundImages/${this.uid}`);

                db.set({ backgroundImage: remoteUri }, {merge: true});
            }
        } catch (error) {
            alert('error: ', error.message )
        }

    };
  
    //Upload an Image to Firestore(Firebase "Data Base")
    uploadPhotoAsync = async (uri, fileName) => {

        return new Promise(async (res, rej) => {
            const response = await fetch(uri);
            const file = await response.blob();

            let upload = firebase
                .storage()
                .ref(fileName)
                .put(file);

            upload.on(
                "state_changed",
                snapshot => {},
                err => {
                    rej(err);
                },
                async () => {
                    const url = await upload.snapshot.ref.getDownloadURL();
                    res(url);
                }
            );
        });
    };

    // Add Post
    addPost = async ({text, localUri, user}) => {

        let remoteUri = null

        if (localUri === null){
            remoteUri = null
        } else {
            remoteUri = await this.uploadPhotoAsync(localUri,`photos/${this.uid}/${Date.now()}`);
        }

        return new Promise((res, rej) => {
            let newPostRef = this.firestore.collection('posts').doc();

            newPostRef.set({
                text,
                timestamp: this.timestamp,
                image: remoteUri,
                postId: newPostRef.id,
                uid: this.uid
            })
            .then(ref => {
                res(ref);
            })
            .catch(error => {
                rej(error);
            })
        })
    };

    // Get Posts
    //onSnapshot means that every time a firebase collection is updated it triggers the onSnapshot function, which means that this function have real time updates
    getPosts = async (_this) => {
        
        let loadedPosts = [];

        var posts = firebase.firestore()
                .collection('posts')
                .orderBy('timestamp', 'desc');

        posts.onSnapshot( async (docSnaps) => {

            for(var i = 0; i < docSnaps.docs.length; i++){
                loadedPosts[i] =  docSnaps.docs[i].data();

                await firebase.firestore().collection('users').doc(docSnaps.docs[i].data().uid).get().then((userDoc) => {
                    loadedPosts[i].userData = userDoc.data();
                });
            }
            
            _this.setState({posts: loadedPosts, loading: false})
            
        });
    };

    //get Posts on the user profile
    getUserPosts = (_this, userId) => {

        let loadedPosts = [];

        var posts = firebase.firestore()
                .collection('posts')
                .where('uid', '==', userId)
                .orderBy('timestamp', 'desc')


        posts.onSnapshot( async (docSnaps) => {

            for(var i = 0; i < docSnaps.docs.length; i++){
                loadedPosts[i] =  docSnaps.docs[i].data();

                await firebase.firestore().collection('users').doc(userId).get().then((userDoc) => {
                    loadedPosts[i].userData = userDoc.data();
                });
            }
            _this.setState({posts: loadedPosts, loadingPosts: false})
        });

    };

    addComment = (text, postId) => {
        return new Promise((res, rej) => {
            this.firestore
                .collection('posts')
                .doc(postId)
                .collection('comments')
                .add({
                    text: text,
                    timestamp: this.timestamp,
                    uid: this.uid
                })
                .then(ref => {
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                })
        });
    };

    getComments = async (_this, postId) => {

        let loadedComments = [];

        var comments = firebase.firestore()
                .collection('posts')
                .doc(postId)
                .collection('comments')
                .orderBy('timestamp', 'desc');


        comments.onSnapshot( async (docSnaps) => {
            for(var i = 0; i < docSnaps.docs.length; i++){
                loadedComments[i] =  docSnaps.docs[i].data();

                await firebase.firestore().collection('users').doc(docSnaps.docs[i].data().uid).get().then(async (userDoc) => {
                    loadedComments[i].userData = userDoc.data();
                });
            };

            _this.setState({comments: loadedComments, loading: false});

        });

    };

    getUsers = (_this) => {

        this.firestore
            .collection('users')
            .orderBy('name')
            .onSnapshot( async (docSnaps) => {

                var users = docSnaps.docs.map( (doc) => {
                    return doc.data()
                });

                await _this.setState({ users: users });
                
            });
    };

    sendFriendRequest = (userData) => {

        let currentUser = {};

        this.firestore
            .collection('users')
            .doc(this.uid)
            .get()
            .then( doc => {
                currentUser = doc.data();

                    this.firestore
                        .collection('users')
                        .doc(userData.uid)
                        .collection('friends')
                        .doc(this.uid)
                        .set({
                            pendingRequest: true,
                            uid: this.uid,
                            recipientUserId: userData.uid,
                            userData: currentUser,
                        }).then( () => {
                            alert('You sent a Friend Request to ' + userData.name + '\n\nOnce the user has accepted you will be able to start a conversation in the Chat Tab' )
                        });
            });

        this.firestore
            .collection('users')
            .doc(this.uid)
            .collection('friends')
            .doc(userData.uid)
            .set({
                pendingRequest: true,
                uid: userData.uid,
                recipientUserId: userData.uid,
                userData: userData
            });
            
    };

    acceptRequest = (userData) => {

        this.firestore
            .collection('users')
            .doc(this.uid)
            .collection('friends')
            .doc(userData.uid)
            .update({
                pendingRequest: false,
            });

        this.firestore
            .collection('users')
            .doc(userData.uid)
            .collection('friends')
            .doc(this.uid)
            .update({
                pendingRequest: false,
            }).then(() => {
                alert('You accepted ' + userData.name + ' Friend Request \n\nNow you can start a conversation in the Chats Tab ')
            });

    };

    // Also used to decline a Friend Request
    removeFriend = (userData) => {

        this.firestore
            .collection('users')
            .doc(this.uid)
            .collection('friends')
            .doc(userData.uid)
            .delete();                    

        this.firestore
            .collection('users')
            .doc(userData.uid)
            .collection('friends')
            .doc(this.uid)
            .delete()
            .then(() => {
                alert('You have removed ' + userData.name +' as a Friend')
            })

    };

    getUserFriends = (_this, userId) => {

        this.firestore
            .collection('users')
            .doc(userId)
            .collection('friends')
            .where('pendingRequest', '==', false)
            .onSnapshot( async (docSnaps) => {

                var users = docSnaps.docs.map( (doc) => {
                    return doc.data()
                });

                await _this.setState({ userFriends: users });
                
            });

    };

    getFriends = (_this) => {

        let friends = {}

        this.firestore
            .collection('users')
            .doc(this.uid)
            .collection('friends')
            .onSnapshot( (docSnaps) => {
                docSnaps.docs.map( doc => {
                    return friends[doc.id] = doc.data();
                });

                _this.setState({ friends: friends });
            })

    };

    addMessage = (text, userId) => {
        return new Promise((res, rej) => {
            this.firestore
                .collection('users')
                .doc(this.uid)
                .collection('chats')
                .doc(userId)
                .collection('messages')
                .add({
                    text: text,
                    timestamp: this.timestamp,
                    senderId: this.uid
                })
                .then(ref => {
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                })

            this.firestore
                .collection('users')
                .doc(userId)
                .collection('chats')
                .doc(this.uid)
                .collection('messages')
                .add({
                    text: text,
                    timestamp: this.timestamp,
                    senderId: this.uid
                })
                .then(ref => {
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                })
        });
    };

    getMessages = (_this, userId) => {
        this.firestore
                .collection('users')
                .doc(this.uid)
                .collection('chats')
                .doc(userId)
                .collection('messages')
                .orderBy('timestamp', 'desc')
                .onSnapshot( async (docSnaps) => {

                    var messages = docSnaps.docs.map( (doc) => {
                        return doc.data()
                    });
    
                    await _this.setState({ messages: messages })
                    
                });
    };

    //get Firestore
    get firestore() {
        return firebase.firestore()
    };

    // get UserID
    get uid() {
        return (firebase.auth().currentUser || {}).uid
    };

    //get Current Date
    get timestamp() {
        return Date.now()
    };
}

Fire.shared = new Fire();
export default Fire;