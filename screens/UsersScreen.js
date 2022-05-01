import React from'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';
import { Divider } from 'react-native-elements';
import Fire from '../Fire';
import RenderUser from '../components/RenderUser';

export default class UsersScreen extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            users:[],
            friends:[]
        }
    }

    componentDidMount(){
        Fire.shared.getUsers(this);
        Fire.shared.getFriends(this);
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
        return(

            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity>
                        <Text style={styles.headerTitle}>Users</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={{paddingHorizontal: 16}}>
                    
                    {this.state.users.map( (item, index) => {
                        return(
                            <RenderUser 
                                key={index} 
                                item={item} 
                                navigation={this.props.navigation} 
                                screen={'UsersScreen'}
                                handleAddFriend={this.handleAddFriend}
                                friend={this.state.friends[item.uid]}
                                handleAcceptRequest={this.handleAcceptRequest}
                                handleRemoveFriend={this.handleRemoveFriend}
                            />
                        );

                    })}

                </ScrollView>
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
        justifyContent: 'center',
        elevation: 10,
        paddingVertical: 14,
        paddingHorizontal: 30,
        shadowColor: '#454D65',
        shadowOffset:{ height: 5 },
        shadowRadius: 15,
        shadowOpacity: 0.2,
        zIndex: 10,
    },
    headerTitle:{
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold'
    },
    userContainer:{
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 8
    },
    avatar:{
        width: 60,
        height: 60,
        borderRadius: 19,
    },
    userName:{
            fontSize: 22,
            fontWeight: 'bold',
            color: '#444e5b',

    },
})