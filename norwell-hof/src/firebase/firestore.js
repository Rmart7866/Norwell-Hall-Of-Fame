// src/firebase/firestore.js
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
  } from 'firebase/firestore';
  import { db } from './config';
  
  // INDUCTEES
  export const createInductee = async (inducteeData) => {
    try {
      const docRef = await addDoc(collection(db, 'inductees'), {
        ...inducteeData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: docRef.id, error: null };
    } catch (error) {
      return { id: null, error: error.message };
    }
  };
  
  export const getInductee = async (id) => {
    try {
      const docRef = doc(db, 'inductees', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
      }
      return { data: null, error: 'Inductee not found' };
    } catch (error) {
      return { data: null, error: error.message };
    }
  };
  
  export const getAllInductees = async () => {
    try {
      const q = query(collection(db, 'inductees'), orderBy('classYear', 'desc'));
      const querySnapshot = await getDocs(q);
      const inductees = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { data: inductees, error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  };
  
  export const getInducteesByClass = async (classYear) => {
    try {
      const q = query(
        collection(db, 'inductees'),
        where('classYear', '==', classYear),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);
      const inductees = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { data: inductees, error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  };
  
  export const updateInductee = async (id, inducteeData) => {
    try {
      const docRef = doc(db, 'inductees', id);
      await updateDoc(docRef, {
        ...inducteeData,
        updatedAt: serverTimestamp(),
      });
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  };
  
  export const deleteInductee = async (id) => {
    try {
      await deleteDoc(doc(db, 'inductees', id));
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  };
  
  // CLASSES
  export const createClass = async (classData) => {
    try {
      const docRef = await addDoc(collection(db, 'classes'), {
        ...classData,
        createdAt: serverTimestamp(),
      });
      return { id: docRef.id, error: null };
    } catch (error) {
      return { id: null, error: error.message };
    }
  };
  
  export const getAllClasses = async () => {
    try {
      const q = query(collection(db, 'classes'), orderBy('year', 'desc'));
      const querySnapshot = await getDocs(q);
      const classes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { data: classes, error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  };
  
  // PHOTOS
  export const createPhoto = async (photoData) => {
    try {
      const docRef = await addDoc(collection(db, 'photos'), {
        ...photoData,
        uploadedAt: serverTimestamp(),
      });
      return { id: docRef.id, error: null };
    } catch (error) {
      return { id: null, error: error.message };
    }
  };
  
  export const getPhotosByInductee = async (inducteeId) => {
    try {
      const q = query(
        collection(db, 'photos'),
        where('inducteeId', '==', inducteeId),
        orderBy('order')
      );
      const querySnapshot = await getDocs(q);
      const photos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { data: photos, error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  };
  
  // VIDEOS
  export const createVideo = async (videoData) => {
    try {
      const docRef = await addDoc(collection(db, 'videos'), {
        ...videoData,
        uploadedAt: serverTimestamp(),
      });
      return { id: docRef.id, error: null };
    } catch (error) {
      return { id: null, error: error.message };
    }
  };
  
  export const getVideosByClass = async (classYear) => {
    try {
      const q = query(
        collection(db, 'videos'),
        where('classYear', '==', classYear),
        orderBy('uploadedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const videos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { data: videos, error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  };