import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView} from 'react-native';
import * as firebase from 'firebase';

export default class LoginScreen extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            email:"",
            password:"",
            errorMessage: null

        }
    }

    handleLogin = () => {
        const {email, password} = this.state;

        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch(error => this.setState({ errorMessage: error.message }));
    }

    static navigationOptions = {
        headerShown: false,
    }
    
    render(){
        return(
            <ScrollView contentContainerStyle={styles.container}>
                    <Image source={require('../assets/facepalm_logo.png')} style={styles.imageLogo}></Image>

                    <Text style={styles.greeting}>{`Welcome Back.`}</Text>

                    <View style={styles.errorMessage}>
                        {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                    </View>

                    <View style={styles.form}>
                            <View>
                                <Text style={styles.inputTitle}>Email Address</Text>
                                <TextInput 
                                    style={styles.input} 
                                    autoCapitalize='none'
                                    autoCorrect= {false}
                                    onChangeText={email => this.setState({ email })}
                                    value={this.state.email}
                                ></TextInput>
                            </View>

                        <View style={{marginTop: 32}}>
                            <Text style={styles.inputTitle}>Password</Text>
                            <TextInput 
                                style={styles.input} 
                                secureTextEntry 
                                autoCapitalize='none'
                                autoCorrect= {false}
                                onChangeText={password => this.setState({ password })}
                                value={this.state.password}
                                ></TextInput>
                        </View>
                    </View>

                    
                    <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
                        <Text style={{color: '#fff', fontWeight:'500' }}>Sign In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{alignSelf: 'center', marginTop: 32}} onPress={() => this.props.navigation.navigate('Register')}>
                        <Text style={{color: '#414959', fontSize: 13}}>
                            Don't have an account? <Text style={{fontWeight: '500', color: '#3f50b5'}}>Sign Up</Text>
                        </Text>
                    </TouchableOpacity>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flexGrow:1,
        justifyContent: 'center',
    },
    greeting:{
        marginTop: 32,
        fontSize: 18,
        fontWeight:'400',
        textAlign:'center',
    },
    errorMessage:{
        height: 72,
        alignItems:'center',
        justifyContent:'center',
        marginHorizontal:30,
    },
    error: {
        color: '#E9446A',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 30,
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
    imageLogo:{
        marginTop:30, 
        alignSelf:'center',
        resizeMode:'contain',
        height: '20%',
    },
})