import React from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput} from 'react-native';
import {vh} from 'react-native-expo-viewport-units';
import Fire from '../Fire';
import firebase from 'firebase';
import moment from 'moment';
import RenderPost from '../components/RenderPost';


export default class HomeScreen extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            posts:[],
            friends:[],
            loading: true,
        }
    }

    componentDidMount(){

        Fire.shared.getPosts(this);
        Fire.shared.getFriends(this);

    }

    render(){

        return(
            <View style={styles.container}>
                <StatusBar backgroundColor='#313e8c' barStyle='light-content'></StatusBar>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Feed</Text>
                </View>

                {( () => {

                    if(this.state.loading === true){
                        return(

                            <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
                                <ActivityIndicator size="large" color="#3f51b5" style={{marginTop:30}}/>    
                            </View>

                            );

                    } else {
                        return(

                            <ScrollView>
                            
                            {// I prefered to use .map() over FlatList because FlatList was giving me problems when rendering large groups of items, 
                             // Some of them just wouldn't load, for example in a 50 item page FlatList wouldn't render like 3 items and would say that userData was undifined but the other 47 items were working perfectly, and those 3 items weren´t the first or the last items to render, 
                             //basically those items were just random items that couldn't load the userData in time ( when I console log the userData on the items that didn't load, the userData was always displayed, so the item just couldn't load it on time for some reason)
                            }

                            {this.state.posts.map( (item, index) => {
                                return(
                                    <RenderPost key={index} navigation={this.props.navigation} item={item} screen='HomeScreen'/>
                                );
                            })}

                            {/*<FlatList
                                data={this.state.posts} 
                                renderItem={ ({item}) => <RenderPost navigation={this.props.navigation} item={item} screen='HomeScreen'/>} 
                                keyExtractor={(item, index) => index.toString()}
                            />*/}

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
        backgroundColor: '#EFECF4'
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
});