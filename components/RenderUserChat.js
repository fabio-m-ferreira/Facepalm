import React from'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback} from 'react-native';
import { Divider } from 'react-native-elements';
import { FontAwesome5, AntDesign, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import Fire from '../Fire';

export default class UsersScreen extends React.PureComponent {

    render(){

        return(

            <TouchableOpacity 
                onPress={ () => {
                    const userData = this.props.item;
                    this.props.navigation.navigate('ChatScreen', {userData} );
                }}
            >
                <View style={styles.userContainer}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                            style={styles.avatar}
                            source={
                                this.props.item.userData.avatar 
                                    ? {uri: this.props.item.userData.avatar  }
                                    : require ('../assets/defaultavatar.png')
                                }  
                        />
                        
                        <Divider style={{ backgroundColor: '#C4C6CE', height: '90%', width: 1, marginHorizontal: 8}} />
                    
                        <View style={{justifyContent: 'center', width: '70%'}}>
                            <Text style={styles.userName}>{this.props.item.userData.name}</Text>
                        </View>
                    </View>

                    <View style={{alignSelf: 'center'}}>
                        <MaterialIcons name="comment" size={32} color="#444e5b" />
                    </View>

                </View>
            </TouchableOpacity>

        );
    }
}

const styles = StyleSheet.create({
    userContainer:{
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 13
    },
    avatar:{
        width: 50,
        height: 50,
        borderRadius: 30,
    },
    userName:{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#444e5b',
            flexWrap: 'wrap'
    },
})