import React, { useState, useEffect } from 'react';
import { Modal, Text, TouchableHighlight, View, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
// import { doc, deleteDoc, where, getFirestore, orderBy, query, getDocs, collection, limit, DocumentSnapshot } from "firebase/firestore"; 
import {firestore, doc, deleteDoc, where, getFirestore, orderBy, query, getDocs, collection, limit, DocumentSnapshot } from '@react-native-firebase/firestore';
import { PostImg } from '../styles/FeedStyles';
import storage from '@react-native-firebase/storage';

import { firebase_auth } from '../firebase';
import {onAuthStateChanged, signOut } from 'firebase/auth';
import { UserAuth } from "../context/AuthContext";

const DeleteModal = ({route, navigation}) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [ user, setUser ] = useState('')
  const db = getFirestore(firestore);
  const { itemId } = route.params;
  console.log(itemId)

  // const deleteItem = (itemId) => {
  //   firestore()
  //     .collection('posts')
  //     .doc(itemId) // doc id to record
  //     .then((DocumentSnapshot) => {
  //       console.log('User successfully deleted!');
  //       const {postImg} = DocumentSnapshot.data();

  //       if (postImg != null ) {
  //         const storageRef = storage().refFromURL(postImg);
  //         const imageRef = storage().ref(storageRef.fullpath);

  //         imageRef
  //         .delete()
  //         .then(() => {
  //           console.log('${postImg} User successfully deleted!');
  //           deleteFirestoreData(itemId);
  //       })
  //     }
  //     })
  //     .catch((error) => {
  //       console.error("Error removing document: ", error);
  //     });
  // }

  const deleteFirestoreData = (itemId) => {
    firestore()
      .collection('posts')
      .doc(itemId) // doc id to record
      .delete()
      .then(() => {
        Alert.alert('post Deleted')
      })
      .catch(e => console.log('delete post error', e))
    }

    useEffect(() => {
        
      // deleteItem();
    }, [user]);
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          alert('Modal has been closed.');
        }}>
        <View style={styles.cardModal}>
          <View>
            <Text style={styles.deleteBtn} onPress={deleteFirestoreData}>Delete Post</Text>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Text style={styles.cancelBtn}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* <TouchableHighlight
        onPress={() => {
          setModalVisible(true);
        }}>
        <Text>Show Modal</Text>
      </TouchableHighlight> */}
    </View>
  );
}

export default DeleteModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
});