import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Button, TextInput, SafeAreaView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { firebase_auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { AuthContext } from '../navigation/AuthProvider';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const logoImg = require("../assets/AQUARIZZ.png");
const logoImg1 = require("../assets/imgperson.png");
const logoImg2 = require("../assets/imgLoginperson.png");

const LoginScreen = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = firebase_auth;

  const handleLogin = async () => {
    try {
  
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      console.log("Logged in pressed");
      const db = getFirestore();

      navigation.navigate('HomePage',{
        UserInfo: response,
      });

    } catch (error) {
      console.log(error);
      alert('Sign in failed!' + error.message);
    }
  }


    // useEffect(() => {
  //   auth.onAuthStatementChanged(user => {
  //     if(user) {
  //       navigation.navigate("Home")
  //     }
  //   })

  //   return unsubscribe
  // }, [])

  return (

    <View style={styles.container}>
    <SafeAreaView>
    <ScrollView>
      <View style={styles.headerImg}>
        <Image source={logoImg} style={{width: 150, height: 100}} />
      </View>
      <View style= {[styles.box, styles.contactUsBtn]}>
        <Text style={styles.contactUsBtn}>Contact Us</Text>
        <StatusBar style="auto" />
      </View>
      <View style={[styles.hero, styles.heroText]}>
        <Text style={styles.heroHeader}>Connecting for the Love of Healthy Fish</Text>
      </View>
      <View style={[styles.hero, styles.heroText]}>
        <Text style={styles.heroFooter}>A Social media community to connect and sell your items.</Text>
      </View>
      <View>
        {/* <Button
          title='Join Now'
          onPress={() => console.log("Button pressed")}
        /> */}

        <Text style={styles.signUpBtn}>Join Now</Text>
      </View>
      <View style={styles.img1}>
      <Image source={logoImg1} style={{width: 500, height: 500}} />
      </View>

      <View style={styles.heroForm}>
        <View style={[styles.form]}>
          <Image source={logoImg2} style={styles.img2} />
          <KeyboardAvoidingView behavior='padding'>
          <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} placeholder='Email' 
            value={email}
            onChangeText={(text) => setEmail(text)}/>
       
          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.input} placeholder='Password' secureTextEntry 
            value={password} 
            onChangeText={(text) => setPassword(text)}/>


          <Text>Remember me</Text>

          <View style={styles.forgotBox}>
            <TouchableOpacity>
              <Text style={styles.signUpBtn}>Login</Text>
            <Button title='Login'  onPress={handleLogin} color={'black'} />
            </TouchableOpacity>
            <Text style={{margin: 20, left: 90, fontSize: 14}}>----- or ------</Text>
            <Button title='Create Account' onPress={() => navigation.navigate('Signup')} color={'black'} />
          </View>
          </KeyboardAvoidingView>
        </View>
      </View>

    </ScrollView>
  </SafeAreaView>
  </View>
  )
}

export default LoginScreen;

  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5d99dd',
    // alignItems: 'center',
    // justifyContent: 'center',
    padding: 0,
  },

  a: {
    margin: 0,
    padding: 0,
    fontStyle: "poppins",
  },

  box: {
    width: 150,
    height: 35,
    padding: 10,
    paddingHorizontal: 37,
    paddingVertical: 6,
    borderRadius: 50,
    marginHorizontal: 230,
    marginVertical: -50,
  },

  contactUsBtnContainer: {
    backgroundColor: "#ffc947",
  },

  contactUsBtn: {
    backgroundColor: "#ffc947",
    fontWeight: 'bold',
    fontSize: 15,
  },

  header: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerImg: {
    margin: 1,
    marginHorizontal: 5,
    bottom: -15,
  },

  img1: {
    left: '5%',
    top: -280,
  },

  img2: {
    left: 5,
    width: 300,
    height: 400,
    bottom: 60,
    marginBottom: -85,
  },

  hero: {
    flex: 1,
    width: '100%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: -100,
  },

  heroText: {
    width: 300,
    height: 280,
    flexDirection: 'column',
    padding: 0,
    marginHorizontal: -5,
  },

  heroHeader: {
    fontWeight: 'bold',
    fontSize: 40,
    color: 'white',
  },

  heroFooter: {
    color: '#fff',
    fontWeight: 'normal',
    fontSize: 15,
    bottom: 170,
    marginHorizontal: 20,
  },

  heroForm: {
    height: 1000,
    width: 350,
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    marginHorizontal: 20,
    bottom: 50,
  },

  signUpBtn: {
    backgroundColor: '#ffc947',
    fontWeight: 'bold',
    paddingHorizontal: 30,
    paddingVertical: 10,
    width: 150,
    height: 45,
    top: 300,
    justifyContent: 'center',
    flex: 1,
    left: 115,
    fontSize: 20,
  },

  italic: {
    fontWeight: 'bold',
    fontStyle: 'italic',
  },

  card: {
    height: '80%',
    backgroundColor: '#ffffff54',
    padding: 10,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 24,
    shadowOffset: 10,
    shadowColor: '#3a3a3a4b',
  },

  inputBoxes: {
    margin: 1,
    position: 'relative',
  },

  icon: {
    position: 'absolute',
    right: 0,
    top: '50%',
    
  }, 

  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
      elevation: 5,
    },

    shadowOpacity: 0.25,
    shadowRadius: 4,

  },
  
  label: {
    fontSize: 17,
    marginBottom: 15,
    fontWeight: 'bold',
  },

  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 25,
    padding: 10,
    borderRadius: 15,
  },

  forgotBox: {
    margin: 15,
    marginBottom: 25,
  },

  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  
  iconContainer: {
    top: 30,
    left: 10,
  }
});
