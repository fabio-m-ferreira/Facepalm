import React from'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity ,ScrollView, TextInput, ActivityIndicator} from 'react-native';
import {Footer, FooterTab} from 'native-base';
import {vw} from 'react-native-expo-viewport-units';
import Image from 'react-native-scalable-image';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import moment from 'moment';
import { Divider } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fire from '../Fire';
import RenderComment from '../components/RenderComment';


export default class PostDetailScreen extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            text: '',
            comments:[],
            loading: true
        }

    }

    componentDidMount(){
        const postId = this.props.navigation.state.params.post.postId;

        Fire.shared.getComments(this, postId);
    }

    navigateToProfile = () => {

        if(this.props.navigation.state.params.screen === 'CurrentUserProfileScreen'){

            this.props.navigation.goBack()

        } else {

            const userId = this.props.navigation.state.params.post.userData.uid
            this.props.navigation.navigate('UserProfileScreen', {userId})
            
        }
    }

    handleComment = async () => {
        const postId = this.props.navigation.state.params.post.postId

        await Fire.shared
        .addComment(this.state.text.trim(), postId)
            .then(ref => {
                Fire.shared.getComments(this, postId);
                this.setState({text: ''});
            }).catch( err => {
                alert(err);
            });
    }

    render(){

        const postData = this.props.navigation.state.params.post

        return(

            <SafeAreaView style={styles.container}>
                <ScrollView>

                    <View style={styles.close}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <AntDesign name="close" size={22} color="white"/>
                        </TouchableOpacity>
                    </View>

                    {( () => {

                        if(postData.image){
                            return(
                                <Image
                                    width={Dimensions.get('window').width}
                                    source={{uri: postData.image}}
                                />
                            );
                        } else {
                            return(
                                <View style={{marginTop: 50}}></View>
                            );
                        }

                    }) () }

                    <View style={styles.postProfile} >
                        <TouchableOpacity onPress={this.navigateToProfile} style={{backgroundColor: 'rgba(30,30,30,0.6)', borderRadius: 100, elevation: 10}}>
                            <Image 
                                style={styles.postAvatar}
                                width={70}
                                height={70}
                                source={
                                    postData.userData.avatar 
                                        ? {uri: postData.userData.avatar  }
                                        : require ('../assets/defaultavatar.png')} 
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.navigateToProfile} style={{alignItems: 'flex-end', flex: 1}}>
                            <Text style={styles.postName}>{postData.userData.name}</Text>
                        </TouchableOpacity>
                    </View>

                    <Divider style={{ backgroundColor: '#C4C6CE', width: '90%', height: 1, alignSelf: 'center'}} />

                    <View>
                        <Text style={styles.postText}>{postData.text}</Text>
                        <Text style={styles.timestamp}>{moment(postData.timestamp).fromNow()}</Text>
                    </View>

                    <Divider style={{ backgroundColor: '#C4C6CE', width: '90%', height: 1, alignSelf: 'center'}} />

                    <View style={styles.commentsContainer}>
                        <Text style={styles.commentsTitle}>Comments</Text>

                        {( () => {
                            if (this.state.loading === true){
                                
                                return(
                                    <View>
                                        <ActivityIndicator size="large" color="#3f51b5" style={{marginTop:20}}/>    
                                    </View>
                                );

                            }else {
                                if(this.state.comments.length === 0){
                                    return(
                                        <View style={{marginTop: 5}}>
                                            <Text style={{color:'#838899'}}>There are no comments</Text>
                                        </View>
                                        );
    
                                } else {
                                    return(
    
                                        this.state.comments.map( (item, index) => {
                                            return(
                                                <RenderComment key={index} item={item} navigation={this.props.navigation} />
                                            );
                                        })
                                        
                                    ); 
                                }
                            }
                        }) () }

                    </View>   

                </ScrollView>

                <Footer style={{height: 48}}>
                    <FooterTab style={styles.footerTab}>

                        <View style={{flex: 1}}>
                            <TextInput 
                                style={styles.input} 
                                autoCapitalize='none'
                                autoCorrect= {false}
                                placeholder='Add a comment...'
                                onChangeText={text => this.setState({ text })}
                                value={this.state.text}
                            />
                        </View>

                        <TouchableOpacity style={{marginLeft: 10}} onPress={ () => this.state.text !== '' ? this.handleComment() : alert('You need to insert some text in order to post the comment')}>
                            <Ionicons name="md-send" size={24} color="#fff" />
                        </TouchableOpacity>

                    </FooterTab>
                </Footer>

            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    close:{
        position: 'absolute',
        top: 25,
        left: 20,
        backgroundColor: 'rgba(30,30,30,0.6)',
        borderRadius: 14,
        padding: 3,
        zIndex: 10,
    },
    footerTab:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: '#5165db',
        marginVertical: 7,
        marginHorizontal: 10,
        paddingHorizontal: 7,
        borderRadius: 10,
    },
    input: {
        fontSize: 15,
        color: '#fff',
    },
    postProfile:{
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 30,
        flexDirection: 'row'
    },
    postAvatar:{
        borderRadius: 40,
    },
    postName:{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#444e5b',
        flexWrap: 'wrap'
    },
    timestamp:{
        fontSize: 14,
        color: '#C4C6CE',
        marginVertical: 5,
        marginHorizontal: 30,
    },
    postText:{
        marginVertical: 5,
        marginHorizontal: 30,
        fontSize: 18,
        color: '#838899',
    },
    commentsContainer:{
        marginVertical: 15,
        marginHorizontal: 30,
    },
    commentsTitle:{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#444e5b',
    },
});