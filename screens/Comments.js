import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput, TouchableOpacity,
  Button,
  KeyboardAvoidingView
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { getFirestore } from 'firebase/firestore'
import {serverTimestamp, collection, addDoc} from "firebase/firestore";
import { firebase_auth } from '../firebase';
import {onAuthStateChanged} from 'firebase/auth';

const Comments = ({navigation}) => {
  const [user, setUser] = useState('');
  const [comment, setComment] = useState('');
  const [post, setPost] = useState(null);
  const auth = firebase_auth;
  const db = getFirestore(firestore);
  const getData = async() => {
    
    const unsubscribe = await onAuthStateChanged(auth, (currentUser) => {
        console.log("Login na ako")
        console.log(currentUser)
        setUser(currentUser);
      });
      return () => {
        unsubscribe();
      };
}
const createComment = (postData) => {

  const postRef = doc(db, "posts", postID);
      const commentRef = collection(postRef, "comments");
      return addDoc(commentRef, {
        content: content,
        authorID: user?.uid,
        name: userProfile.name,
        datePosted: Date.now(),
        createdAt: serverTimestamp(),
      });

      setContent("");
  // const collectionRef = collection(db, "comments");
  // return addDoc(collectionRef, { ...postData });
};

const handleSubmitComment = async () => {
  let NamePlaceHolder
  if (!user.name) {
    console.log("Variable is null, undefined, or an empty string");
    NamePlaceHolder = user.email
  } else {
    console.log("Variable is not null, undefined, or an empty string");
    NamePlaceHolder = user.name
  }

    const obj = {
      content: comment,
      authorId: user?.uid,
      name: NamePlaceHolder,
      // datePosted: Date.now(),
      datePosted: Date.now(),
      createdAt: serverTimestamp(),
    };

    await createComment(obj);
    navigation.navigate('Feeds')

    try {
      const postRef = doc(db, "posts", postID);
      const commentRef = collection(postRef, "comments");
      await addDoc(commentRef, {
        content: comment,
        authorID: user.uid,
        name: NamePlaceHolder,
        datePosted: Date.now(),
        createdAt: serverTimestamp(),
      });

      setContent("");
    } catch (err) {
      console.log(err.message);
    }
}
useEffect(() => {
  getData();
}, []);

async function getComments() {
    const data = [];

    const postRef = doc(db, "posts", postID);
    const commentRef = collection(postRef, "comments");
    // const querySnapshot = await getDocs(commentRef)
    const querySnapshot = await getDocs(
      query(commentRef, orderBy("createdAt", "desc"), limit(5))
    );

    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data(), id: doc.id });
    });

    return data;
  }
  //getting the comments but suddenly becoming undefined
  useEffect(() => {
    fetchComments();
    // console.log(comment)
  }, [user]);


const fetchComments = async () => {
    const comments = await getComments();
    setComment(comments);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior='padding'>
        <View style={styles.commentContainer}>
            <Text style={styles.commentText}>Comment1</Text>
            <Text style={styles.commentText}>Comment1</Text>
            <Text style={styles.commentText}>Comment1</Text>
            <Text style={styles.commentText}>Comment1</Text>
        </View>
        {/* <KeyboardAvoidingView behavior='padding'> */}
        <View>
          <TextInput style={styles.input} placeholder="Comment..."
            multiline
            numberOfLines={5}
            value={comment} onChangeText={(content) => {setComment(content)}}
            />
            <TouchableOpacity onPress={handleSubmitComment}>
              <Text style={styles.signUpBtn}>Submit</Text>
            </TouchableOpacity>
        </View>
        </KeyboardAvoidingView> 
    </View>
  )
}
export default Comments;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      borderWidth: 1,
      alignItems: 'flex-start',
      alignContent: 'flex-start',
    },

    commentContainer: {
      width: 400,
      height: 240,
      padding: 20,
    },

    input: {
      top: -5,
      borderWidth: 1,
      width: 400,
      height: 60,
      fontSize: 18,
      paddingHorizontal: 20,
    },

    signUpBtn: {
      // backgroundColor: 'white',
      fontWeight: 'bold',
      paddingVertical: 10,
      width: 100,
      bottom: 60,
      justifyContent: 'center',
      textAlign: 'center',
      left: 290,
      fontSize: 18,
    },
    commentText: {
      paddingBottom: 16,
      fontSize: 16,

    }
})