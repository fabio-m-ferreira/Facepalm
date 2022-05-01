import React from'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback} from 'react-native';
import { Divider } from 'react-native-elements';
import { FontAwesome5, AntDesign } from '@expo/vector-icons'; 
import Fire from '../Fire';

export default class UsersScreen extends React.PureComponent {

    render(){

        if(this.props.item.uid !== Fire.shared.uid){

            return(

                <TouchableOpacity
                    onPress={ () => {
                        const userId = this.props.item.uid;
                        const screen = this.props.screen;
                        this.props.navigation.navigate('UserProfileScreen', {userId, screen} );
                    }} 
                    delayPressIn={ 50 } 
                >
                    <View style={styles.userContainer}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image
                                style={styles.avatar}
                                source={
                                    this.props.item.avatar 
                                        ? {uri: this.props.item.avatar  }
                                        : require ('../assets/defaultavatar.png')
                                    }  
                            />
                            
                            <Divider style={{ backgroundColor: '#C4C6CE', height: '90%', width: 1, marginHorizontal: 8}} />
                            
                            <View style={{justifyContent: 'center', width: '70%'}}>
                                <Text style={styles.userName}>{this.props.item.name}</Text>
                            </View>
                            
                        </View>

                        <View style={{justifyContent: 'center'}}>
                        {( () => {

                            // I create a friends collection in firebase every time a user send a Friend Request
                            //if pendingRequest is true it means that the user recieved a friend request or gave a friend request, and that request is not yet answered(when the recipient accept the request, the field pendingRequest will be false, if they decline the request, the document will be removed).
                            //if pendingRequest is false it means that they are officially friends because if they are not, the object that this.props.friend has will be removed from firebase(the document in firebase which refers to the their friendship will be removed)
                            //Based on that if this.props.friend exists its because they are friends or they have a pending request
                            //Talking about this IF statment, it means that if this.props.friends exists the removeFriendButton will appear if not, the addButton will appear
                            if(this.props.friend){

                                //if pendingRequest is true it means that they are still not friends, so if the recipient is the current user, instead of removeFriend button it will appear an accept and decline option for the friend Request
                                if(this.props.friend.pendingRequest === true){

                                    //if recipient is not the current user (which basically means that the current user was the one who sent the request) the button will be disabled
                                    if(this.props.friend.recipientUserId === Fire.shared.uid){
                                        return(
                                            <View>
                                                <TouchableOpacity onPress={() => this.props.handleAcceptRequest(this.props.item)}>
                                                    <AntDesign name="check" size={28} color="#2196f3" />
                                                </TouchableOpacity>

                                                <TouchableOpacity style={{marginTop: 5}} onPress={ () => this.props.handleRemoveFriend(this.props.item) }>
                                                    <AntDesign name="close" size={28} color="#f44336" />
                                                </TouchableOpacity>
                                            </View>
                                        );
                                    }else{
                                        return(
                                            <TouchableWithoutFeedback>
                                                <FontAwesome5 name="user-plus" size={24} color="#444e5b"  style={{opacity: 0.5, alignSelf: 'center'}}/>
                                            </TouchableWithoutFeedback>
                                        );
                                    }

                                }else{
                                    return(
                                        <TouchableOpacity style={{alignSelf: 'center'}} onPress={ () => this.props.handleRemoveFriend(this.props.item) }>
                                            <FontAwesome5 name="user-minus" size={24} color="#444e5b" />
                                        </TouchableOpacity>  
                                    );
                                }

                            }else {
                                return(
                                    <TouchableOpacity style={{alignSelf: 'center'}} onPress={() => this.props.handleAddFriend(this.props.item)}>
                                        <FontAwesome5 name="user-plus" size={24} color="#444e5b" />
                                    </TouchableOpacity>
                                );
                            }

                        }) () }
                        </View>
                    </View>
                </TouchableOpacity>

            );
        }else{
            return(
                <View></View>
            );
        }
    }
}

const styles = StyleSheet.create({
    userContainer:{
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 13,
    },
    avatar:{
        width: 50,
        height: 50,
        borderRadius: 30,
    },
    userName:{
        fontSize: 17,
        fontWeight: 'bold',
        color: '#444e5b',
        flexWrap: "wrap",
    },
})