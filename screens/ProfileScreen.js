import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, TouchableOpacity, RefreshControl, Modal, TouchableHighlight  } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import FormButton from "../components/FormButton";
import { AuthContext } from "../navigation/AuthProvider";
import PostCard from "../components/PostCard";
import { firebase_auth } from '../firebase';
import {onAuthStateChanged, signOut } from 'firebase/auth';
import { UserAuth } from "../context/AuthContext";
import { doc, deleteDoc, where, getFirestore, orderBy, query, getDocs, collection, limit } from "firebase/firestore"; 
import { FlatList } from "react-native-gesture-handler";
import firestore from '@react-native-firebase/firestore';

const profileImg = require("../assets/userProfile.png");
const auth = firebase_auth;
const ProfileScreen = ({navigation, route}) => {
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [ user, setUser ] = useState('')
    const [ posts, setPosts ] = useState('')
    const [refreshing, setRefreshing] = useState(false)
    const [postTitle, setPostTitle] = useState("")
    const [postBody, setPostBody] = useState("")
    const [postImage, setPostImage] = useState("")
    const [isPosting, setIsPosting] = useState(false)
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

    // const deleteItem = (itemId) => {
    //     firestore()
    //       .collection('posts')
    //       .doc(itemId) // doc id to record
    //       .delete()
    //       .then(() => {
    //         console.log('User successfully deleted!');
    //       })
    //       .catch((error) => {
    //         console.error("Error removing document: ", error);
    //       });
    //   }
      
    async function showPosts() {
        console.log(user.email)
        const colRef = collection(db, "posts");
        const querySnapshot = await getDocs(
          query(colRef, where("name", "==", user.email))
        );
        const q = query(colRef, orderBy("date", "desc"), limit(5));
        const data = [];
    
        querySnapshot.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
    
        return data;
      }
    
      const fetchData = async (e) => {
        const userDataPosts = await showPosts();
        setPosts(userDataPosts);
        console.log(posts)
        setRefreshing(false)
        
      }

      const handleRefresh = () => {
        setRefreshing(true)
        fetchData(20)
        setRefreshing(false)
      }

    const getProfile = async () => {
        const data = [];
  
        try {
          setLoading(true);
          if (!user) {
            // Handle the case when user is not defined
            console.log("can't get user");
            return;
          }
          const docRef = doc(db, "users1", user.uid);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            setProfile((profile) => {
              return { ...profile, ...docSnap.data() };
            });
          }
          setLoading(false);
        } catch (err) {
          console.log(err.message);
        }
      };

    //getProfile();

    useEffect(() => {
        
        getData();
        fetchData();
        getProfile();
      }, [user]);
    
   
    

    const handleDelete = () => {}

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
            <ScrollView style={styles.container}
                contentContainerStyle={{justifyContent: "center", alignItems: "center",}}
                showsVerticalScrollIndicator={false}
            >
                <Image source={profileImg} style={styles.userImg} />
                <Text style={styles.userName}>{user.email}</Text>
                <Text>{
                //user.email
                }</Text>
                <Text style={styles.aboutUser}>
                    aquarizzzzzzz
                </Text>
                <View style={styles.userBtnWrapper}>
                    {route.params ? (
                        <>
                    <TouchableOpacity style={styles.userBtn} onPress={() => {}}>
                        <Text style={styles.userBtnText}>Message</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.userBtn} onPress={() => {}}>
                        <Text style={styles.userBtnText}>Follow</Text>
                    </TouchableOpacity>
                    </>
                    ) : (
                        <>
                    <TouchableOpacity style={styles.userBtn} onPress={() => navigation.navigate('EditProfile')}>
                        <Text style={styles.userBtnText}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.userBtn} onPress={() => {signOut(auth),navigation.navigate('Login')}}>
                        <Text style={styles.userBtnText}>Logout</Text>
                    </TouchableOpacity>
                    </>
                    )}
                </View>

                <View style={styles.userInfoWrapper}>
                    <View style={styles.userInfoItem}>
                        <Text style={styles.userInfoTitle}>22</Text>
                        <Text style={styles.userInfoSubTitle}>Posts</Text>
                    </View>
                    <View style={styles.userInfoItem}>
                        <Text style={styles.userInfoTitle}>2202</Text>
                        <Text style={styles.userInfoSubTitle}>Followers</Text>
                    </View>
                    <View style={styles.userInfoItem}>
                        <Text style={styles.userInfoTitle}>143</Text>
                        <Text style={styles.userInfoSubTitle}>Following</Text>
                    </View>
                </View>
                {/* <View style={styles.flexContainer}> */}

                <ScrollView
                    contentContainerStyle={styles.flexContainer}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                        }
                        >
                        {posts && posts.map((item) => (
                            <View key={item.id} style={styles.flexContainer} >

                                <TouchableOpacity onPress={() => navigation.navigate('Delete')}>
                                    <Image source={{ uri: item.postImg }} style={styles.postContainer}/>
                                </TouchableOpacity>
                                {/* Other components */}
             
                         </View>
                        ))}
                  </ScrollView>

                 

                {/* <FlatList 
        data={posts}
        renderItem={({ item }) => {
          return (
            <View style={styles.flexContainer}>
              <Text style={styles.titleText} >{item.name}</Text>
                    <Text style={styles.bodyText} >{item.postContent}</Text>
                    <Text style={styles.imageCard}>{item.postImg}</Text>
                <Image source={{ uri: item.postImg }} style={styles.postContainer} />
               <View style={styles.flex}>
                <Text style={styles.likeContainer} onPress={{}}>Like</Text>
                <Text style={styles.likeContainer} onPress={() => navigation.navigate('Comment')}>Comment</Text>
                <Text style={styles.deleteBtn} onPress={{}}>Delete</Text>
              </View>
              </View>

            
            
          )
        }} 
        ItemSeparatorComponent={() => {
          <View style={{height: 16,}} />
        }}
        ListEmptyComponent={<Text>No Posts Found</Text>}
        ListHeaderComponent={<Text style={styles.headerText} >Post List</Text>}
        ListFooterComponent={<Text style={styles.footerText} >End of List</Text>}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        /> */}
                {/* </View> */}
{/* 
                {post.map((item) => (
                    <PostCard key={item.id} item={item} onDelete={handleDelete}/>
                ))} */}
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 5,
    },
    userImg: {
        height: 150,
        width: 150,
        borderRadius: 75,
    },
    userName: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 10,
    },
    aboutUser: {
        fontSize: 12,
        fontWeight: "600",
        color: "#666",
        textAlign: "center",
        marginBottom: 10,
    },
    userBtnWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        marginBottom: 10,
    },
    userBtn: {
        borderColor: "#2e64e5",
        borderWidth: 2,
        borderRadius: 3,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 5,
    },
    userBtnText: {
        color: "#2e64e5",
    },
    userInfoWrapper: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginVertical: 20,
    },
    userInfoItem: {
        justifyContent: "center",
    },
    userInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "center",
    },
    userInfoSubTitle: {
        fontSize: 12,
        color: "#666",
        textAlign: "center",
    },

    postContainer: {
        width: 125.5,
        height: 125.5,
        borderWidth: 1,
        margin: 1,
        textAlign: "center",
        paddingVertical: 30,
    },
    flexContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',

    },

    cardModal: {
      width: 300,
      height: 150,
      alignItems: 'center',
      justifyContent:'center',
      borderWidth: 3,
      borderRadius: 30,
      margin: 45,
      top: 250,
    },
    deleteBtn: {
      width: 250,
      height: 50,
      // borderWidth: 2,
      fontSize: 18,
      justifyContent: 'center',
      textAlign: 'center',
      padding: 13,
      borderRadius: 40,
      backgroundColor: 'red',
      color: 'white',
      fontWeight: 'bold',
    },
  
    cancelBtn: {
      width: 250,
      height: 50,
      borderWidth: 2,
      fontSize: 18,
      justifyContent: 'center',
      textAlign: 'center',
      padding: 13,
      borderRadius: 40,
      color: 'red',
      marginTop: 10,
      fontWeight: 'bold',
    }
})