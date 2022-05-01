import React from'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback} from 'react-native';
import { Divider } from 'react-native-elements';
import { FontAwesome5, AntDesign } from '@expo/vector-icons'; 
import moment from 'moment';
import Fire from '../Fire';

export default class UsersScreen extends React.PureComponent {

    render(){

        return(

            <View style={{transform: [{ scaleY: -1 }]}}>

                {( () => {
                    if(this.props.item.senderId === Fire.shared.uid){
                        return(
                            <View style={{justifyContent:'center', alignItems: 'flex-end'}}>
                                <View style={styles.currentUserMessageContainer}>
                                    <Text style={styles.currentUserMessageText}>{this.props.item.text}</Text>
                                </View>

                                <Text style={styles.timestamp}>{moment(this.props.item.timestamp).fromNow()}</Text>
                            </View>
                        );
                    } else {
                        return(
                            <View style={{justifyContent:'center', alignItems: 'flex-start'}}>
                                <View style={styles.otherUserMessageContainer}>
                                    <Text style={styles.otherUserMessageText}>{this.props.item.text}</Text>
                                </View>

                                <Text style={styles.timestamp}>{moment(this.props.item.timestamp).fromNow()}</Text>
                            </View>
                        );
                    }
                }) ()}

                
            </View>

        );
    }
}

const styles = StyleSheet.create({
    currentUserMessageContainer:{
        marginTop: 16,
        backgroundColor: '#5165db',
        maxWidth: '70%',
        padding: 13,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 30,
        elevation: 2,
        margin: 2
    },
    otherUserMessageContainer:{
        marginTop: 16,
        backgroundColor: '#fff',
        maxWidth: '70%',
        padding: 13,
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 2,
        margin: 2
    },
    avatar:{
        width: 50,
        height: 50,
        borderRadius: 30,
    },
    currentUserMessageText:{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    otherUserMessageText:{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#444e5b',
        width: 'auto'
    },
    timestamp:{
        fontSize: 11,
        color: '#a2a4ab',
        marginTop: 2,
        marginHorizontal: 5
    },
})