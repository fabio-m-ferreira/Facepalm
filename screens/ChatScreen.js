import React from'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput} from 'react-native';
import {Ionicons, MaterialIcons, Entypo, FontAwesome5} from '@expo/vector-icons';
import {Footer, FooterTab} from 'native-base';
import RenderMessage from '../components/RenderMessage';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import Fire from '../Fire';

export default class ChatScreen extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            text: '',
            messages:[]
        }

    }

    componentDidMount(){

        const userId = this.props.navigation.state.params.userData.uid

        Fire.shared.getMessages(this, userId);
    }

    handleMessage = async () => {

        const userId = this.props.navigation.state.params.userData.uid

        await Fire.shared
        .addMessage(this.state.text.trim(), userId)
        .then(ref => {
            Fire.shared.getMessages(this, this.props.navigation.state.params.userData.uid)
            this.setState({text: ''});
        }).catch( err => {
            alert(err);
        });

    }

    render(){

        const userData = this.props.navigation.state.params.userData.userData

        return(

            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.arrowBack} onPress={() => this.props.navigation.goBack()}>
                        <Ionicons name="md-arrow-back" size={24} color="#fff"/>
                    </TouchableOpacity>

                    <Image 
                        style={styles.avatar}
                        source={
                            userData.avatar 
                                ? {uri: userData.avatar  }
                                : require ('../assets/defaultavatar.png')
                            } 
                    />

                    <TouchableOpacity style={{flex: 1}}>
                        <Text style={styles.headerTitle}>{userData.name}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{flex: 1, justifyContent: 'flex-end'}}>
                    <ScrollView style={{ padding: 15, transform: [{ scaleY: -1 }]}} >
                            {this.state.messages.map( (item, index) => {
                                return <RenderMessage key={index} item={item} />
                            })}
                    </ScrollView>
                </View>

                <Footer style={{height: 48}}>
                    <FooterTab style={styles.footerTab}>

                        <View style={{flex: 1}}>
                            <TextInput 
                                style={styles.input} 
                                autoCapitalize='none'
                                autoCorrect= {false}
                                placeholder='Send a message...'
                                onChangeText={text => this.setState({ text })}
                                value={this.state.text}
                            />
                        </View>

                        <TouchableOpacity style={{marginLeft: 10}} onPress={ () => this.state.text !== '' ? this.handleMessage() : alert('You need to insert some text in order to post the comment')}>
                            <Ionicons name="md-send" size={24} color="#fff" />
                        </TouchableOpacity>

                    </FooterTab>
                </Footer>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    header:{
        backgroundColor: '#3f50b5',
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 10,
        paddingVertical: 4,
        paddingHorizontal: 20,
        shadowColor: '#454D65',
        shadowOffset:{ height: 5 },
        shadowRadius: 15,
        shadowOpacity: 0.2,
        zIndex: 10,
    },
    headerTitle:{
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        flexWrap: 'wrap',
        width:'100%'
    },
    arrowBack:{
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar:{
        width: 39,
        height: 39,
        borderRadius: 19,
        marginRight: 16
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
})