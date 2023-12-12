import { StyleSheet, Text, View, SafeAreaView, FlatList, StatusBar, ActivityIndicator, TextInput, Button, ScrollView, Image} from 'react-native';
import { useEffect, useState } from 'react';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot,
  where,
} from "firebase/firestore";

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { DEFAULT_PLACEHOLDER } from 'react-native-gifted-chat';
import placeholder from './../../aquarizz'

export default function App({navigation}) {
  const [postList, setPostList] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [postTitle, setPostTitle] = useState("")
  const [postBody, setPostBody] = useState("")
  const [postImage, setPostImage] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  const [deleted, setDeleted] = useState(false);
  const [likes, setLikes] = useState("")
  const [comment, setComment] = useState("")
  const [posts, setPosts] = useState([]);
  const db = getFirestore(firestore);

  async function showPosts() {
    const colRef = collection(db, "posts");
    const querySnapshot = await getDocs(
      query(colRef, orderBy("createdAt", "desc"))
    );
    const q = query(colRef, orderBy("date", "desc"), limit(5));
    const data = [];

    // onSnapshot(colRef, (snapshot) => {
    //   snapshot.docs.forEach((doc) => {
    //     data.push({ ...doc.data(), id: doc.id });
    //   });
    // });

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

  const addPost = async () => {
    setIsPosting(true)
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: postTitle,
        body: postBody,
        image: postImage,
      })
    })
    const newPost = await response.json()
    setPostList([newPost, ...postList])
    setPostTitle("")
    setPostBody("")
    setPostImage("")
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData();
  }, [])

  
  return (
    <SafeAreaView style={styles.container}>
      <>
      {/* <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder='Post Title' value={postTitle} onChangeText={setPostTitle} />
        <TextInput style={styles.input} placeholder='Post Body' value={postBody} onChangeText={setPostBody} />
        <Button title={isPosting ? "Adding..." : "Add Post"} 
        onPress={addPost}
        disabled={isPosting} />
      </View> */}
      <View style={styles.listContainer}>
        <FlatList 
        data={posts}
        renderItem={({ item }) => {
          return (
            <View style={styles.card}>
              <Text style={styles.titleText} >{item.name}</Text>
              <Text style={styles.bodyText} >{item.postContent}</Text>
              {/* <Text style={styles.imageCard}>{item.postImg}</Text> */}
              <Image source={{ uri: item.postImg }} style={styles.imageCard} />
              <View style={styles.flex}>
                <Text style={styles.likeContainer} onPress={{}}>Like</Text>
                <Text style={styles.likeContainer} onPress={() => navigation.navigate('Comment')}>Comment</Text>
                {/* <Text style={styles.deleteBtn} onPress={{}}>Delete</Text> */}
              </View>
            </View>
            
            
          )
        }} 
        ItemSeparatorComponent={() => {
          <View style={{height: 16,}} />
        }}
        ListEmptyComponent={<Text>No Posts Found</Text>}
        // ListHeaderComponent={<Text style={styles.headerText} >Post List</Text>}
        ListFooterComponent={<Text style={styles.footerText} >End of List</Text>}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        />
      </View>
      </>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    // paddingTop: StatusBar.currentHeight,
    // alignItems: 'center',
    // justifyContent: 'center',
  },

  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },

  card: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 7,
  },

  titleText: {
    fontSize: 24,
  },

  bodyText: {
    fontSize: 18,
    color: '#666666'
  },

  headerText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 12,
  },

  footerText: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 12,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: StatusBar.currentHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    margin: 16,
  },

  input:{
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
  },

  likeContainer: {
    paddingVertical: 5,
    borderWidth: 1,
    width: 160,
    height: 30,
    borderRadius: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  imageCard: {
    height: 300,
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 5,
    justifyContent: 'center',
    textAlign: 'center',
  },

  deleteBtn: {
    backgroundColor: 'red',
    paddingVertical: 5,
    borderWidth: 1,
    width: 105,
    height: 30,
    borderRadius: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  }
});
