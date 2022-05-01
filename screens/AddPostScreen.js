import React from'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, TextInput, StatusBar, ActivityIndicator} from 'react-native';
import {Footer, FooterTab, Button, Icon} from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Ionicons, MaterialIcons, Entypo, FontAwesome5} from '@expo/vector-icons';
import Fire from '../Fire';
import * as ImagePicker from 'expo-image-picker';
import UserPermissions from '../utilities/UserPermissions';

export default class AddPostScreen extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            text:"",
            image: null,
            loading: false,
            user:{},
        }
    }

    componentDidMount(){
        const user = Fire.shared.uid;

        Fire.shared.firestore
            .collection('users')
            .doc(user)
            .onSnapshot(doc => {
                this.setState({ user: doc.data()});
            })
    }

    handlePost = () => {
        this.setState({loading: true});

            Fire.shared
                .addPost({text: this.state.text.trim(), localUri: this.state.image, user: this.state.user})
                .then(ref => {
                    this.setState({text: '', image: null});
                    this.props.navigation.goBack();
                    this.props.navigation.navigate('HomeScreen');
                    this.setState({loading: false});
                })
                .catch(error => {
                    alert(error);
                });

    }

    pickImage = async () => {
        UserPermissions.getCameraPermission()

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
        });

        if(!result.cancelled) {
            this.setState({ image: result.uri });
        } else {
            alert('error: ' + result)
        }
    } 

    render(){

        if( this.state.loading === true ){
            return(
                <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
                    <ActivityIndicator size="large" color="#3f51b5" style={{marginTop:30}}/>    
                </View>
            );
        };
    
        return(
                <SafeAreaView style={styles.container}>
                    <StatusBar backgroundColor='#313e8c' barStyle='light-content'></StatusBar>

                    <View style={styles.header}>
                        <View style={{display:'flex', flexDirection:'row' , alignItems:  'center'}}>
                            <TouchableOpacity style={styles.arrowBack} onPress={() => this.props.navigation.goBack()}>
                                <Ionicons name="md-arrow-back" size={24} color="#fff"/>
                            </TouchableOpacity>

                            <Text style={{fontWeight: '500', color:'#fff', fontSize: 22, alignSelf: 'center', marginLeft: 10}}>Add New Post</Text>
                        </View>
                        
                        <View style={{display:'flex', flexDirection:'row' , alignItems:  'center'}}>
                            <TouchableOpacity 
                            onPress={ () => this.state.text !== '' || this.state.image !== null ? this.handlePost() : alert('You need to insert some text or an image in order to send the Post')}>
                                <Ionicons name="md-send" size={32} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{flex: 1}}>
                        <View style={styles.inputContainer}>
                            <Image 
                                style={styles.avatar} 
                                source={ this.state.user.avatar 
                                    ? {uri: this.state.user.avatar}
                                    : require ('../assets/defaultavatar.png') } 
                            />

                            <TextInput 
                                multiline={true} 
                                numberOfLines={4} 
                                style={styles.textInput} 
                                placeholder='Want to share something?'
                                placeholderTextColor='#707070'
                                onChangeText={text => this.setState({text})}
                                value={this.state.text}
                            ></TextInput>
                        </View>

                        <View style={styles.imageContainer}>
                            <Image source={{uri: this.state.image}} style={{width: '100%', height: '100%', borderRadius: 10}} />
                        </View>    
                    </View> 

                    <Footer>
                        <FooterTab>
                            <Button onPress={this.pickImage}>
                                <Entypo name="images" size={32} color="#fff" />
                                <Text style={{color: '#fff'}}>Add an Image</Text>
                            </Button>
                        </FooterTab>
                    </Footer>    
                </SafeAreaView>

        );
        
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        backgroundColor: '#3f50b5',
        paddingLeft: 15,
        paddingRight: 32,
        paddingVertical: 3,
    },
    arrowBack:{
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer:{
        margin: 32,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar:{
        width: 48,
        height: 48,
        borderRadius:24,
        marginRight:10
    },
    imageContainer:{
        marginHorizontal: 32, 
        marginTop: 32, 
        height: '40%',
        backgroundColor: '#e3e3e3',
        borderRadius: 10,
        justifyContent:'center',
        alignItems: 'center'
    },
    textInput:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e3e3e3',
        color: '#000',
        borderRadius: 10,
        padding: 10,
        height: 52,
    }
})