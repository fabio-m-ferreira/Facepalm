import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, Image, Keyboard, ScrollView} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import Fire from '../Fire';
import UserPermissions from '../utilities/UserPermissions';
import * as ImagePicker from 'expo-image-picker';

export default class RegisterScreen extends React.Component {

    static navigationOptions = {
        title: 'Create an account',
          headerStyle: {
            backgroundColor: '#3f50b5',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
    }

    constructor(props){
        super(props);

        this.state = {
            user:{
                email:"",
                password:"",
                name:"",
                avatar: null,
                backgroundImage: null,
            },       
            errorMessage: null

        }
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
        }

    }

    handleSignUp = () => {
        Keyboard.dismiss();
        Fire.shared.createUser(this.state.user, this);
    }

    render(){
        return(
            <View style={styles.container}>
                <StatusBar backgroundColor='#313e8c' barStyle='light-content'></StatusBar>

                <TouchableOpacity style={styles.imagePlaceholder} onPress={this.handlePickBackgroundImage}>
                    <Image source={{uri: this.state.user.backgroundImage}} style={styles.imageBackground} />
                    <Ionicons name='ios-add' size={40} color='#fff' style={{position: 'absolute', top: vh(2.5)}}/>
                </TouchableOpacity>

                <TouchableOpacity style={styles.avatarPlaceholder} onPress={this.handlePickAvatar}>
                    <Image source={{uri: this.state.user.avatar}} style={styles.avatar} />
                    <Ionicons name='ios-add' size={40} color='#fff'/>
                </TouchableOpacity>

                <View style={styles.errorMessage}>
                    {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                </View>

                <View>
                    <ScrollView contentContainerStyle={styles.scrollView}>
                        <View style={styles.form}>
                            <View style={{marginTop: 12}}>

                                <Text style={styles.inputTitle}>Username</Text>
                                
                                <TextInput 
                                    style={styles.input} 
                                    autoCapitalize='none'
                                    onChangeText={name => this.setState({ user: {...this.state.user, name} })}
                                    value={this.state.user.name}
                                    maxLength={15}
                                ></TextInput>
                            </View>

                            <View style={{marginTop: 32}}>
                                <Text style={styles.inputTitle}>Email Address</Text>
                                <TextInput 
                                    style={styles.input} 
                                    autoCapitalize='none'
                                    autoCorrect= {false}
                                    onChangeText={email => this.setState({ user: {...this.state.user, email} })}
                                    value={this.state.user.email}
                                ></TextInput>
                            </View>

                            <View style={{marginTop: 32}}>
                                <Text style={styles.inputTitle}>Password</Text>
                                <TextInput 
                                    style={styles.input} 
                                    secureTextEntry 
                                    autoCapitalize='none'
                                    autoCorrect= {false}
                                    onChangeText={password => this.setState({ user: {...this.state.user, password} })}
                                    value={this.state.user.password}
                                    ></TextInput>
                            </View>
                        </View>

                        
                        <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
                            <Text style={{color: '#fff', fontWeight:'500' }}>Sign Up</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{alignSelf: 'center', marginTop: 12, marginBottom: 32}} onPress={() => this.props.navigation.navigate('Login')}>
                            <Text style={{color: '#414959', fontSize: 13}}>
                                Already have an account? <Text style={{fontWeight: '500', color: '#3f50b5'}}>Login</Text>
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'flex-end'
    },
    scrollView:{
        backgroundColor:'#f2f2f2',  
        flexGrow: 1,
        justifyContent: 'flex-end',
        zIndex: 200,
    },
    errorMessage:{
        height: 60,
        alignItems:'center',
        justifyContent:'center',
        marginHorizontal:30,
        zIndex: 200
    },
    error: {
        color: '#E9446A',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },
    form: {
        marginBottom: 30,
        marginHorizontal: 30,
        zIndex: 200
    },
    inputTitle:{
        color: '#8A8F9E',
        fontSize: 10,
        textTransform: 'uppercase',
        fontWeight: 'bold'
    },
    input: {
        borderBottomColor: '#8A8F9E',
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 30,
        width:'90%',
        fontSize: 15,
        color: '#161F3D',
    },
    button: {
        marginHorizontal:30,
        backgroundColor: '#3f50b5',
        borderRadius: 4,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarPlaceholder:{
        position: 'absolute',
        top: vh(10),
        width: vh(20),
        height: vh(20),
        backgroundColor: '#d2d4d9',
        borderWidth: vh(1.5),
        borderColor: '#f2f2f2',
        borderRadius: vh(10),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },  
    avatar: {
        position: 'absolute',
        width: vh(17),
        height: vh(17),
        borderRadius: vh(8.5),
        zIndex: 90
    },
    imagePlaceholder:{
        position: 'absolute',
        top: 0,
        width:'100%',
        height: vh(22),
        backgroundColor: '#d2d4d9',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    imageBackground:{
        position: 'absolute',
        width: '100%',
        height: vh(22),
        zIndex: 100
    }
});