import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import { vh } from 'react-native-expo-viewport-units';
import { MaterialIcons } from '@expo/vector-icons'; 
import { Divider } from 'react-native-elements';
import moment from 'moment';

class RenderPost extends React.PureComponent{

    render(){
        return(

            <TouchableOpacity 
                onPress={ () => {
                    const post = this.props.item;
                    const screen = this.props.screen;
                    this.props.navigation.navigate('PostDetailScreen', {post, screen} );
                }} 
                delayPressIn={ 50 } 
                style={styles.feedItem}
                >

                    <View style={{ alignItems: 'center'}}>
                            <Image 
                                style={styles.postAvatar}
                                source={
                                    this.props.item.userData.avatar 
                                        ? {uri: this.props.item.userData.avatar  }
                                        : require ('../assets/defaultavatar.png')
                                    } 
                            />
                    </View>

                    <View style={{flex:1}}>
                        
                        <View style={styles.itemHeader}>
                            <View>
                                <Text style={styles.postName}>{this.props.item.userData.name}</Text>
                                <Text style={styles.timestamp}>{moment(this.props.item.timestamp).fromNow()}</Text>
                            </View>

                        </View>

                        <Divider style={{ backgroundColor: '#C4C6CE', width: '100%', height: 1, marginTop: 8}} />

                        <Text numberOfLines={2} style={styles.postText}>{this.props.item.text}</Text>

                        {( () => {

                            if(this.props.item.image){
                                return(
                                    <Image 
                                        style={styles.postImage}
                                        source={{uri: this.props.item.image}}
                                    />
                                );
                            }

                        }) () }

                    </View>
            </TouchableOpacity>

        );
    }

}

const styles = StyleSheet.create({
    feedItem:{
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 8,
        marginTop: 16,
        marginHorizontal: 16,
        flexDirection: 'row'
    },
    postAvatar:{
        width: 39,
        height: 39,
        borderRadius: 19,
        marginRight: 16
    },
    itemHeader:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    postName:{
        fontSize: 15,
        fontWeight: '500',
        color: '#454D65'
    },
    timestamp:{
        fontSize: 11,
        color: '#C4C6CE',
        marginTop: 4
    },
    postText:{
        marginTop: 8,
        fontSize: 14,
        color: '#838899'
    },
    postImage: {
        width: undefined,
        height: vh(30),
        borderRadius: vh(1),
        marginVertical: 8
    }
})

export default RenderPost;