import React from 'react';
import './FixTimerBug'; // Fix of a Bug that happened in Android where the setTimeouts of Firebase would reduce the app performance
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator, TransitionPresets} from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {Ionicons, FontAwesome5, FontAwesome, Entypo} from '@expo/vector-icons';

import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import UsersScreen from './screens/UsersScreen';
import AddPostScreen from './screens/AddPostScreen';
import CurrentUserProfileScreen from './screens/CurrentUserProfileScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import PostDetailScreen from './screens/PostDetailScreen';
import UserChatsScreen from './screens/UserChatsScreen';
import ChatScreen from './screens/ChatScreen';

const AppContainer = createStackNavigator(
	{
		// Bottom Tab Navigator
		default: createBottomTabNavigator(
			{
				Home: {
					screen: HomeScreen,
					navigationOptions: {
						tabBarIcon: ({tintColor}) => <Entypo name="home" size={24} color={tintColor} />,
					}
				},
				Message: {
					screen: UserChatsScreen,
					navigationOptions: {
						tabBarIcon: ({tintColor}) => <FontAwesome name="comments" size={24} color={tintColor} />
					}
				},
				AddPost: {
					screen: AddPostScreen,
					navigationOptions: {
						tabBarIcon: ({tintColor}) => <Ionicons name='ios-add-circle' size={48} color={'#fff'}/>
					}
				},
				Users: {
					screen: UsersScreen,
					navigationOptions: {
						tabBarIcon: ({tintColor}) => <FontAwesome5 name="user-friends" size={24} color={tintColor} />
					}
				},
				Profile: {
					screen: CurrentUserProfileScreen,
					navigationOptions: {
						tabBarIcon: ({tintColor}) => <FontAwesome5 name="user-alt" size={24} color={tintColor}/>
					}
				},
			},
			// End Bottom Tab Navigator
			// Tab Navigator Options
			{
				defaultNavigationOptions:{
					//if the Tab that is being pressed it's the post Tab, then the HomeScreen disapears and PostScreen opens in a new section
					tabBarOnPress: ({ navigation, defaultHandler }) => {
						if (navigation.state.key === "AddPost") {
							navigation.navigate("postModal")
						} else {
							defaultHandler()
						}
					},
				},
				tabBarOptions: {
					activeTintColor: '#fff',
					inactiveTintColor: '#B8BBC4',
					style: {
						backgroundColor: '#3f50b5',
						borderTopWidth: 0,
					  },
					showLabel: false,
				},
			}
			// End Tab Navigator Options
		),
		postModal: {
			screen: AddPostScreen,
		},
	},
	{
		mode: 'none',
		headerMode: 'none',
	}
)

//In this stack navigator I had to make a little trick, Instead of putting as the first screen the HomeScreen and then, in the App Container use the HomePage variable as a screen at the Home Tab
// I did the oposite because that way this Home Page don't inherit the bottom tab navigator of the app container
// Note: that Chat Screen doesn't have a particular position in this HomePage, it is there because stack navigator only calls Screens if they are inside a Stack Navigator
// So I decided to put it here, that way ChatScreen doesn't inherit the bottom tab navigator and its available as a screen
const HomePage = createStackNavigator(
	{
		AppContainer,
		PostDetailScreen,
		UserProfileScreen,
		ChatScreen,
	},
	{
		headerMode: 'none',
		defaultNavigationOptions: {
			...TransitionPresets.SlideFromRightIOS,
		},
	}
)

const AuthStack = createStackNavigator(
	{
		Login: LoginScreen,
		Register: RegisterScreen,
	},
	{
		defaultNavigationOptions: {
			...TransitionPresets.SlideFromRightIOS,
		},
	}

);

export default createAppContainer(
	createSwitchNavigator(
		{
			Loading: LoadingScreen,
			App: HomePage,
			Auth: AuthStack,
		},
		{
			initialRouteName: "Loading",
			
		}
	)
);
