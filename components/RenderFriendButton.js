import React from'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback} from 'react-native';
import { Divider } from 'react-native-elements';
import { FontAwesome5, AntDesign } from '@expo/vector-icons'; 
import Fire from '../Fire';

export default class RenderFriendButton extends React.PureComponent {

    render(){

        //if the user is the currentUser it doesn't show the friendUser
        if(this.props.userData.uid !== Fire.shared.uid){

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
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <TouchableOpacity style={styles.profileButtonAccept} onPress={() => this.props.handleAcceptRequest(this.props.userData)}>
                                    <AntDesign name="check" size={28} color="#fff" />
                                    <Text style={styles.profileButtonText}>Accept</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.profileButtontDecline} onPress={ () => this.props.handleRemoveFriend(this.props.userData) }>
                                    <AntDesign name="close" size={28} color="#fff" />
                                    <Text style={styles.profileButtonText}>Decline</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    }else{
                        return(
                            <View style={{opacity: 0.7}}>
                                <View style={styles.profileButton}>
                                    <AntDesign name="check" size={28} color="#fff" />
                                    <Text style={styles.profileButtonText}>Already Sent</Text>
                                </View>
                            </View>
                        );
                    }

                }else{
                    return(
                        <TouchableOpacity style={styles.profileButton} onPress={() => this.props.handleRemoveFriend(this.props.userData)}>
                            <FontAwesome5 name="user-minus" size={24} color="#ffff" style={{marginRight: 10}} />
                            <Text style={styles.profileButtonText}>Remove Friend</Text>
                        </TouchableOpacity> 
                    );
                }

            }else {
                return(
                    <TouchableOpacity style={styles.profileButton} onPress={() => this.props.handleAddFriend(this.props.userData)}>
                        <FontAwesome5 name="user-plus" size={24} color="#fff" style={{marginRight: 10}} />
                        <Text style={styles.profileButtonText}>Request Friend</Text>
                    </TouchableOpacity>
                );
            }
        }else {
            return <View></View>
        }
    }
}

const styles = StyleSheet.create({
    profileButton:{
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: 24,
        backgroundColor: '#3f50b5',
        borderRadius: 50,
        paddingHorizontal: 40,
        paddingVertical: 7
    },
    profileButtonAccept:{
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: 24,
        backgroundColor: '#3f50b5',
        borderRadius: 50,
        paddingHorizontal: 10,
        paddingVertical: 7,
        marginRight: 20
    },
    profileButtontDecline:{
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: 24,
        backgroundColor: '#d32f2f',
        borderRadius: 50,
        paddingHorizontal: 10,
        paddingVertical: 7
    },
    profileButtonText:{
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold'
    },
})