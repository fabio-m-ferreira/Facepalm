import React from'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { vh } from 'react-native-expo-viewport-units';
import { Divider } from 'react-native-elements';
import { FontAwesome5, AntDesign } from '@expo/vector-icons'; 
import Fire from '../Fire';

import RenderPost from '../components/RenderPost';
import RenderFriendButton from '../components/RenderFriendButton'

export default class UserProfileScreen extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            user:{},
            posts:[],
            userFriends:[], // retrieve only the friends
            friends:[], // retrieve the friends and the pending requests
            loadingPosts: true,
            loadingUser: true
        }
    }

    componentDidMount(){
        const user = this.props.navigation.state.params.userId;

        Fire.shared.firestore
            .collection('users')
            .doc(user)
            .onSnapshot(doc => {
                const currentUser = doc.data();
                this.setState({ user: currentUser, loadingUser: false });
            })

        Fire.shared.getUserPosts(this, user);
        Fire.shared.getUserFriends(this, user);
        Fire.shared.getFriends(this)
    }

    handleAddFriend = (userData) => {
        Fire.shared.sendFriendRequest(userData);
        Fire.shared.getFriends(this);
    }

    handleAcceptRequest = (userData) => {
        Fire.shared.acceptRequest(userData)
    }

    handleRemoveFriend = (userData) => {
       Fire.shared.removeFriend(userData);
       Fire.shared.getFriends(this);
    }

    render(){

        if( this.state.loadingUser === true ){
            return(
                <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
                    <ActivityIndicator size="large" color="#3f51b5" style={{marginTop:30}}/>    
                </View>
            );
        };

        return(

            <SafeAreaView style={styles.container}>

                <ScrollView contentContainerStyle={{alignItems: 'center' }}>

                    <View style={styles.close}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <AntDesign name="close" size={22} color="white"/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.imageContainer}>
                            <Image 
                                style={styles.imageBackground} 
                                source={
                                    this.state.user.backgroundImage 
                                        ? {uri: this.state.user.backgroundImage }
                                        : require ('../assets/defaultbackgroundimage.jpg')
                                }
                            />
                    </View>

                    <View style={styles.avatarContainer}>
                        <Image 
                            style={styles.avatar} 
                            source={
                                this.state.user.avatar 
                                    ? {uri: this.state.user.avatar}
                                    : require ('../assets/defaultavatar.png')
                            }
                        />
                    </View>

                    <View style={{marginTop: vh(33)}}>
                        <Text style={styles.name}>{this.state.user.name}</Text>
                    </View>

                    <RenderFriendButton
                        userData={this.state.user}
                        handleAddFriend={this.handleAddFriend}
                        friend={this.state.friends[this.state.user.uid]}
                        handleAcceptRequest={this.handleAcceptRequest}
                        handleRemoveFriend={this.handleRemoveFriend}
                    />

                    <Divider style={{ backgroundColor: '#444e5b', width: '90%', height: 1, marginTop: 30 }} />
                    
                    <View style={styles.statsContainer}>
                        <View style={{alignItems: 'center'}}>
                            <Text style={styles.statAmount}>{this.state.posts.length}</Text>
                            <Text style={styles.statTitle}>Posts</Text>
                        </View>

                        <View style={{alignItems: 'center'}}>
                            <Text style={styles.statAmount}>{this.state.userFriends.length}</Text>
                            <Text style={styles.statTitle}>Friends</Text>
                        </View>
                    </View>

                    <Divider style={{ backgroundColor: '#444e5b', width: '90%', height: 1, marginTop: 30 }} />

                    <View style= {{width: '100%'}}>
                        <Text style={styles.profilePostsTitle}>Latest Posts</Text>

                        {( () => {
                            if (this.state.loadingPosts === true){
                                
                                return(
                                    <View>
                                        <ActivityIndicator size="large" color="#3f51b5" style={{marginTop:20}}/>    
                                    </View>
                                );

                            }else {
                                if(this.state.posts.length === 0){
                                    return(
                                        <View style={{marginTop: 5}}>
                                            <Text style={{alignSelf: 'center', color:'#838899'}}>There are no Posts</Text>
                                        </View>
                                        );
    
                                } else {
                                    return(
    
                                        this.state.posts.map( (item, index) => {
                                            return(
                                                <RenderPost key={index} item={item} navigation={this.props.navigation}/>
                                            );
                                        })
                                        
                                    ); 
                                }
                            }
                        }) () }

                    </View>
                    
                </ScrollView>
            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#f2f2f2'
    },
    close:{
        position: 'absolute',
        top: 25,
        left: 20,
        backgroundColor: 'rgba(30,30,30,0.6)',
        borderRadius: 14,
        padding: 3,
        zIndex: 1000,
    },
    name:{
        marginTop: 24,
        fontSize: 28,
        fontWeight: 'bold',
        color: '#444e5b',
        alignSelf: 'center',
        textAlign: 'center',
        minWidth: '90%',
        maxWidth: '91%'
    },
    statsContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '50%',
        marginTop: 24,
    },
    statAmount:{
        color: '#4F566D',
        fontSize: 24,
    },
    statTitle:{
        color: '#a5a6ad',
        fontSize: 18,
        fontWeight: 'bold',
    },
    avatarContainer:{
        position: 'absolute',
        top: vh(15),
        width: vh(20),
        height: vh(20),
        borderWidth: vh(1.5),
        borderColor: '#f2f2f2',
        borderRadius: vh(10),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        zIndex: 100,
    },  
    avatar: {
        position: 'absolute',
        width: vh(17),
        height: vh(17),
        borderRadius: vh(8.5),
        zIndex: 100,

    },
    imageContainer:{
        position: 'absolute',
        top: 0,
        width:'100%',
        height: vh(25),
        justifyContent: 'flex-start',
        alignItems: 'center',
        zIndex: 100,
    },
    imageBackground:{
        position: 'absolute',
        width: '100%',
        height: vh(25),
        zIndex: 100
    },
    profilePostsTitle:{
        marginTop: 24,
        fontSize: 28,
        fontWeight: 'bold',
        color: '#444e5b',
        alignSelf: 'center'
    },
})