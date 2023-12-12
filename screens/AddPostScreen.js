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
  Image,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
// import ImagePicker from 'react-native-image-crop-picker';
import * as ImagePicker from 'expo-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { getFirestore } from 'firebase/firestore'
import {serverTimestamp, collection, addDoc} from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
//import { db } from "../firebase";
// import {
//   InputField,
//   InputWrapper,
//   AddImage,
//   SubmitBtn,
//   SubmitBtnText,
//   StatusWrapper,
// } from '../styles/AddPost';

import { UserAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { firebase_auth } from '../firebase';
import {onAuthStateChanged} from 'firebase/auth';

// import placeholder from "../assets/posts";

const AddPostScreen = () => {
  //const { createPost, showPosts } = UserAuth();
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [post, setPost] = useState(null);
  const [ user, setUser ] = useState('');
  const [ imageUrl, setImageUrl ] = useState('');

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

const uploadImage = async (uri) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storage = getStorage();
  const storageRef = ref(storage, 'images/' + Date.now());
  const uploadTask = uploadBytesResumable(storageRef, blob);

  uploadTask.on('state_changed', 
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
    }, 
    (error) => {
      console.error(error);
    }, 
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setImageUrl(downloadURL)
        console.log('File available at', downloadURL);
      });
    }
  );
};

const readImage = async () => {
  
  console.log("UploadImg")
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [3, 4],
    quality: 1,
  });

  if (!result.canceled) {
    setImage(result.assets[0].uri);
    console.log("Img TO :" + result.assets[0].uri)
    uploadImage(result.assets[0].uri)
  }
};

  // const uploadImage = async (mode) => {
  //   try {
  //     let result = {}

  //     if (mode === "gallery") {
  //       await ImagePicker.
  //       requestMediaLibraryPermissionsAsync();
  //       result = await ImagePicker.
  //       lauchImagelibraryAsync({
  //         mediaTypes: ImagePicker.MediaTypeOptions.
  //         Images,
  //         allowsEditing: true,
  //         aspect: [1, 1],
  //         quality: 1,
  //       })
  //     } else {
  //       console.log("working")
  //       // await ImagePicker.requestCameraPermissionsAsync();
  //       // result = await ImagePicker.lauchCameraAsync({
  //       //   cameraType: ImagePicker.cameraType.
  //       //   lauchCameraAsync({
  //       //     cameraType: ImagePicker.cameraType.
  //       //     front,
  //       //     allowsEditing: true,
  //       //     aspect: [1, 1],
  //       //     quality: 1,
  //       //   })
  //       // })
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // const saveImage = async (image) => {
  //   try {
  //     setImage(image);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // const takePhotoFromCamera = () => {
  //   ImagePicker.openCamera({
  //     width: 1200,
  //     height: 780,
  //     cropping: true,
  //   }).then((image) => {
  //     console.log(image);
  //     // const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
  //     setImage(image.path);
  //   });
  // };

  // const choosePhotoFromLibrary = () => {
  //   ImagePicker.openPicker({
  //     width: 1200,
  //     height: 780,
  //     cropping: true,
  //   }).then((image) => {
  //     console.log(image);
  //     const imageSource = extractImageSource(image)
  //     // const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
  //     setImage(imageUri);
  //   });
  // };

  const createPost = (postData) => {
    console.log(postData)
    const collectionRef = collection(db, "posts");
    return addDoc(collectionRef, { ...postData });
    
  };
  

  const submitPost = async () => {
    let NamePlaceHolder
    if (!user.name) {
      console.log("Variable is null, undefined, or an empty string");
      NamePlaceHolder = user.email
    } else {
      console.log("Variable is not null, undefined, or an empty string");
      NamePlaceHolder = user.name
    }
    console.log(imageUrl)
    const obj = {
    postContent: post,
    authorId: user.uid,
    name: NamePlaceHolder,
    postImg: imageUrl,
      // datePosted: Date.now(),
    datePosted: Date.now(),
    createdAt: serverTimestamp(),
  };


  await createPost(obj);
  navigation.navigate('Feeds')
  
    const imageUri = await readImage();
    console.log('Image Url: ', image);


    // console.log('Post: ', post);
    // console.log('User ID: ', user.uid);
    // console.log('Post Time: ', firestore.Timestamp.fromDate(new Date()));
    // firestore()
    // .collection('posts')
    // .add({
    //   userId: user.uid,
    //   post: post,
    //   postImg: imageUrl,
    //   postTime: firestore.Timestamp.fromDate(new Date()),
    //   likes: null,
    //   comments: null,
    // })
    // .then(() => {
    //   console.log('Post Added!');
    //   Alert.alert(
    //     'Post published!',
    //     'Your post has been published Successfully!',
    //   );
    //   setPost(null);
    // })
    // .catch((error) => {
    //   console.log('Something went wrong with added post to firestore.', error);
    // });
    // navigation.navigate('Feeds',{
    //   UserInfo: "response",
    // });


    

  }


  // const uploadImage = async () => {
  //   if( image == null ) {
  //     return null;
  //   }
  //   const uploadUri = image;
  //   let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

  //   // Add timestamp to File Name
  //   const extension = filename.split('.').pop(); 
  //   const name = filename.split('.').slice(0, -1).join('.');
  //   filename = name + Date.now() + '.' + extension;

  //   setUploading(true);
  //   setTransferred(0);

  //   const storageRef = storage().ref(`photos/${filename}`);
  //   const task = storageRef.putFile(uploadUri);

  //   // Set transferred state
  //   task.on('state_changed', (taskSnapshot) => {
  //     console.log(
  //       `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
  //     );

  //     setTransferred(
  //       Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
  //         100,
  //     );
  //   });

  //   try {
  //     await task;

  //     const url = await storageRef.getDownloadURL();

  //     setUploading(false);
  //     setImage(null);

  //     Alert.alert(
  //       'Image uploaded!',
  //       'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
  //     );
  //     return url;

  //   } catch (e) {
  //     console.log(e);
  //     return null;
  //   }

  // };
  useEffect(() => {
    getData();
  }, []);
  

  return (
    <View style={styles.container}>
        <View>
          <TextInput style={styles.input} placeholder="What's on your mind?"
          multiline
          numberOfLines={5}
          value={post} onChangeText={(content) => {setPost(content)}}
          />
          <TouchableOpacity onPress={submitPost}>
            <Text style={styles.signUpBtn}>Post</Text>
            {/* <Button title='Post' onPress={submitPost} color='black' /> */}
          </TouchableOpacity>
        </View>
        <View style={styles.postContainer}>
          <Text style={styles.photoBtn} onPress={() => readImage("image")}>Select Photo</Text>
          {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        </View>
    </View>

    // <View style={styles.container}>
    //   <InputWrapper>
    //     {image != null ? <AddImage source={{uri: image}} /> : null}

    //     <InputField
    //       placeholder="What's on your mind?"
    //       multiline
    //       numberOfLines={4}
    //       value={post}
    //       onChangeText={(content) => setPost(content)}
    //     />
    //     {uploading ? (
    //       <StatusWrapper>
    //         <Text>{transferred} % Completed!</Text>
    //         <ActivityIndicator size="large" color="#0000ff" />
    //       </StatusWrapper>
    //     ) : (
    //       <SubmitBtn onPress={submitPost}>
    //         <SubmitBtnText>Post</SubmitBtnText>
    //       </SubmitBtn>
    //     )}
    //   </InputWrapper>
    //   <ActionButton buttonColor="#2e64e5">
    //     <ActionButton.Item
    //       buttonColor="#9b59b6"
    //       title="Take Photo"
    //       onPress={takePhotoFromCamera}>
    //       <Icon name="camera-outline" style={styles.actionButtonIcon} />
    //     </ActionButton.Item>
    //     <ActionButton.Item
    //       buttonColor="#3498db"
    //       title="Choose Photo"
    //       onPress={choosePhotoFromLibrary}>
    //       <Icon name="md-images-outline" style={styles.actionButtonIcon} />
    //     </ActionButton.Item>
    //   </ActionButton>
    // </View>
  );
};

export default AddPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },

  input: {
    width: 300,
    height: "50%",
    fontSize: 17,

  },

  signUpBtn: {
    // backgroundColor: 'white',
    fontWeight: 'bold',
    paddingVertical: 10,
    width: 100,
    bottom: 170,
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: 10,
    left: 240,
    fontSize: 20,
    borderWidth: 1,
  },

  postContainer: {
      height: 1000,
      width: 400,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 20,
      bottom: 0,
      borderTopWidth: 2,
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderTopStartRadius: 30,
      borderTopRightRadius: 30,
    },

    photoBtn: {
      backgroundColor: '#fff',
      fontWeight: 'bold',
      width: 500,
      height: 50,
      justifyContent: 'center',
      padding: 10,
      fontSize: 20,
      textAlign: 'center',
      borderWidth: 1.5,
      bottom: 10,
    },
});