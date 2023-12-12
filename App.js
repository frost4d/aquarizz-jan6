import { NavigationContainer } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from './screens/ProfileScreen';
import AppStack from './navigation/AppStack';
import Feeds from './screens/Feeds';
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from './screens/LoginScreen';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { firebase_auth } from "./firebase";
import SignupScreen from "./screens/SignupScreen";
import FeedStack from "./navigation/AppStack";
import Comments from "./screens/Comments";
import DeleteModal from "./screens/DeleteModal";
const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()


const HomeStack = () => {
  // const [user, setUser] = useState<User | null>(null);

  // useEffect(() => {
  //   onAuthStateChanged(firebase_auth, (user) => {
  //     console.log('user', user);
  //     setUser(user);
  //   });
  // }, []);
  
  
  return (
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Signup" component={SignupScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={FeedStack}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Delete" component={DeleteModal}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen name="Comment" component={Comments}
        /> */}
      </Stack.Navigator>
  )
}

const ProfileStack = () => {
  return (
    <Stack.Navigator 
  //   screenOptions={{
  //     tabBarLabelPosition: "below-icon",
  //     tabBarShowLabel: true,
  //     tabBarActiveTintColor: "purple",
  // }}
    >
      <Stack.Screen name="Market" component={AppStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Breed" component={AppStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Tab.Screen name="Home" component={HomeStack} 
          options={{ headerShown: false }}
        />
        <Tab.Screen name="HomePage" component={AppStack} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;
