import React from'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import RenderUserChat from '../components/RenderUserChat';
import Fire from '../Fire';

export default class UserChatsScreen extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            userFriends:[],
        }
    }

    componentDidMount(){

        const userId = Fire.shared.uid;

        Fire.shared.getUserFriends(this, userId);
    }

    render(){
        return(

            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity>
                        <Text style={styles.headerTitle}>Chats</Text>
                    </TouchableOpacity>
                </View>

                {( () => {
                    if(this.state.userFriends.length === 0){
                        return(
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{fontSize: 16, fontWeight: 'bold', textAlign: 'center'}}>
                                    You don't have available chats {'\n'} To enable a Chat you need to be friends with a user
                                </Text>
                            </View>
                        );
                    }else {
                        return(
                            <ScrollView style={{paddingHorizontal: 16}}>
                                {this.state.userFriends.map( (item, index) => {
                                    return (
                                        <RenderUserChat key={index} item={item} navigation={this.props.navigation}/>
                                    )
                                })}
                            </ScrollView>
                        );
                    }
                }) () }
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
})