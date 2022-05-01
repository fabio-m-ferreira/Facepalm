import React from'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { vh } from 'react-native-expo-viewport-units';
import {AntDesign, FontAwesome,FontAwesome5,Entypo} from '@expo/vector-icons';
import UserPermissions from '../utilities/UserPermissions';
import * as ImagePicker from 'expo-image-picker';
import { Divider } from 'react-native-elements';
import firebase from 'firebase';
import Fire from '../Fire';

import RenderPost from '../components/RenderPost';

export default class CurrentUserProfileScreen extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            user:{},
            posts:[],
            userFriends:[],
            loadingUser: true,
            loadingPosts: true
        }
    }

    componentDidMount(){
        const user = this.props.uid || Fire.shared.uid;

        Fire.shared.firestore
            .collection('users')
            .doc(user)
            .onSnapshot(doc => {
                const currentUser = doc.data();
                this.setState({ user: currentUser, loadingUser: false });
            })

        Fire.shared.getUserPosts(this, user);
        Fire.shared.getUserFriends(this, user)

    }

    handlePickAvatar = async () => {
        UserPermissions.getCameraPermission()

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect:[4, 4]
        });

        if (!result.cancelled) {
            this.setState({ user: {...this.state.user, avatar: result.uri} });
            Fire.shared.updateUserAvatar(this.state.user)
        }

    }

    handlePickBackgroundImage = async () => {
        UserPermissions.getCameraPermission()

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect:[4, 2]
        });

        if (!result.cancelled) {
            this.setState({ user: {...this.state.user, backgroundImage: result.uri} });
            Fire.shared.updateUserBackgroundImage(this.state.user)
        }

    }

    handleSignOut = () => {
        firebase.auth().signOut()
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

                <View style={styles.header}>

                    <Text style={{fontWeight: 'bold', color:'#fff', fontSize: 22, alignSelf: 'center'}}>Profile</Text>
                    
                    <View style={{display:'flex', flexDirection:'row' , alignItems:  'center'}}>
                        <TouchableOpacity onPress={this.handleSignOut}>
                            <FontAwesome name="sign-out" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView contentContainerStyle={{alignItems: 'center' }}>

                    <TouchableOpacity style={styles.imageContainer} onPress={this.handlePickBackgroundImage}>
                            <Image 
                                style={styles.imageBackground} 
                                source={
                                    this.state.user.backgroundImage 
                                        ? {uri: this.state.user.backgroundImage }
                                        : require ('../assets/defaultbackgroundimage.jpg')
                                }
                            />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.avatarContainer} onPress={this.handlePickAvatar}>
                        <Image 
                            style={styles.avatar} 
                            source={
                                this.state.user.avatar 
                                    ? {uri: this.state.user.avatar}
                                    : require ('../assets/defaultavatar.png')
                            }
                        />
                    </TouchableOpacity>

                    <View style={{marginTop: vh(33)}}>
                        <Text style={styles.name}>{this.state.user.name}</Text>
                    </View>

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
                                                <RenderPost key={index} item={item} navigation={this.props.navigation} screen='CurrentUserProfileScreen'/>
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
    header:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        backgroundColor: '#3f50b5',
        paddingHorizontal: 32,
        paddingVertical: 13,
    },
    name:{
        marginTop: 24,
        fontSize: 28,
        fontWeight: 'bold',
        color: '#444e5b',
        textAlign: 'center',
        alignSelf: 'center',
        minWidth: '90%',
        maxWidth: '91%'
    },
    statsContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '50%',
        marginTop: 24
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