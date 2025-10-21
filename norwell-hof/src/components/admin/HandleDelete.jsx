// HandleDelete.jsx

import { doc, deleteDoc, getFirestore } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';

// Get the initialized instances of Firestore and Storage.
// NOTE: Make sure your Firebase App is initialized elsewhere in your code.
const db = getFirestore();
const storage = getStorage();

/**
 * Deletes an inductee document from Firestore and its associated main photo from Firebase Storage.
 * * @param {object} inductee - The inductee object containing 'id' and 'photoURL'.
 * @returns {object} - An object with an 'error' property if deletion fails, otherwise { error: null }.
 */
export const deleteInducteeWithPhoto = async (inductee) => {
    try {
        const inducteeId = inductee.id;
        const photoURL = inductee.photoURL;
        
        // --- 1. DELETE THE PHOTO FROM FIREBASE STORAGE ---
        if (photoURL && photoURL.startsWith('https://firebasestorage.googleapis.com')) {
            try {
                // The URL parser helps break down the complex storage URL
                const url = new URL(photoURL);
                const filePath = url.pathname;
                
                // Extract the storage path which starts after '/o/' and before the '?' query params.
                // Example URL: .../o/inductees%2F123.png?alt=media...
                const storagePathSegment = filePath.split('/o/')[1];
                
                if (storagePathSegment) {
                    // Decode URL encoding (e.g., %2F becomes /) and remove query parameters.
                    const storagePath = decodeURIComponent(storagePathSegment.split('?')[0]);
                    
                    // The path should look like: 'inductees/1760643142106_Screenshot_2025-10-16_at_3.27.40_PM.png'
                    const photoRef = ref(storage, storagePath); 
                    
                    await deleteObject(photoRef);
                    console.log(`✅ Deleted main photo: ${storagePath}`);
                }
            } catch (storageError) {
                // If the photo is already missing or there's a permission issue, log and continue 
                // to delete the document to prevent data inconsistency.
                console.warn(`⚠️ Warning: Failed to delete photo for ${inductee.name}. Continuing with document deletion.`, storageError);
            }
        }

        // --- 2. DELETE THE FIRESTORE DOCUMENT ---
        const docRef = doc(db, "inductees", inducteeId);
        await deleteDoc(docRef);
        
        console.log(`✅ Deleted document for: ${inductee.name}`);
        
        return { error: null };

    } catch (error) {
        console.error('❌ Fatal Error during inductee and photo deletion:', error);
        return { error: error.message };
    }
};

/**
 * Deletes an Induction Class document from Firestore.
 * This is designed for simple documents that do not have associated files 
 * in Firebase Storage (like inductee profile photos).
 * * @param {string} classId - The unique ID of the document to delete.
 * @returns {object} - An object with an 'error' property if deletion fails, otherwise { error: null }.
 */
export const deleteInductionClass = async (classId) => {
    try {
        const docRef = doc(db, "classes", classId); // Assuming collection is named "classes"
        await deleteDoc(docRef);
        
        console.log(`✅ Firestore: Deleted class document with ID: ${classId}`);
        
        return { error: null };

    } catch (error) {
        console.error('❌ Error during class document deletion:', error);
        return { error: error.message };
    }
};

export const deleteChampionshipWithPhoto = async (championship) => {
    try {
        const championshipId = championship.id;
        const photoURL = championship.photoURL;

        // --- STEP 1: DELETE THE PHOTO FROM FIREBASE STORAGE ---
        if (photoURL && photoURL.startsWith('https://firebasestorage.googleapis.com')) {
            try {
                const url = new URL(photoURL);
                const filePath = url.pathname;
                
                // Extract path after '/o/' (the file path in the bucket)
                const storagePathSegment = filePath.split('/o/')[1];
                
                if (storagePathSegment) {
                    const storagePath = decodeURIComponent(storagePathSegment.split('?')[0]);
                    
                    const photoRef = ref(storage, storagePath); 
                    await deleteObject(photoRef);
                    console.log(`✅ Storage: Deleted championship photo at path: ${storagePath}`);
                }
            } catch (storageError) {
                // Log warning and continue with document deletion
                console.warn(`⚠️ Warning: Failed to delete championship photo. Continuing with document deletion.`, storageError);
            }
        }

        // --- STEP 2: DELETE THE FIRESTORE DOCUMENT ---
        const docRef = doc(db, "championships", championshipId);
        await deleteDoc(docRef);
        
        console.log(`✅ Firestore: Deleted championship document: ${championship.title}`);
        
        return { error: null };

    } catch (error) {
        console.error('❌ Error during championship deletion:', error);
        return { error: error.message };
    }
};

export const deleteVideo = async (videoId) => {
    try {
        const docRef = doc(db, "videos", videoId);
        await deleteDoc(docRef);
        
        console.log(`✅ Firestore: Deleted video document with ID: ${videoId}`);
        
        return { error: null };

    } catch (error) {
        console.error('❌ Error during video document deletion:', error);
        return { error: error.message };
    }
};