import { Injectable } from '@angular/core';
import {MusicModel} from '../model/music.model';
import {collection, deleteDoc, doc, Firestore, getDoc, getDocs, getFirestore, setDoc} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Storage, ref, uploadBytesResumable, getDownloadURL} from '@angular/fire/storage';
import {getApp, getApps, initializeApp} from '@angular/fire/app';

@Injectable({
  providedIn: 'root'
})
export class UploadmusicService {
  music: MusicModel[] = [];

  constructor(public storage:Storage,public firebase:Firestore) {}
  firebaseConfig = {
    apiKey: 'AIzaSyA0_if_J3ng3_Yb7VWWtwpOr2aAXUcM-Ic',
    authDomain: 'reanatauth.firebaseapp.com',
    projectId: 'reanatauth',
    storageBucket: 'reanatauth.appspot.com',
    messagingSenderId: '550340552858',
    appId: '1:550340552858:web:7d36557a0e188d57c0d723',
    databaseURL: 'https://reanatauth-default-rtdb.firebaseio.com',
    measurementId: 'G-RSFTCW7HNC',
  };
  app = !getApps().length ? initializeApp(this.firebaseConfig) : getApp();
  db = getFirestore(this.app);

  async getData(): Promise<MusicModel[]> {
    const querySnapshot = await getDocs(collection(this.db, 'music'));
    return querySnapshot.docs.map(doc => doc.data() as MusicModel);
  }
  // Post data to firebase
  async postData(newmusic: MusicModel) {
    console.log(newmusic)
    try{
      await setDoc(doc(this.db, 'music', newmusic.id),newmusic);
    }catch (e){
      console.log(e)
    }
  }
  // Update data in firebase
  async updateData(updatedMusic: MusicModel) {
    const docRef = doc(this.db, 'Music');
    await setDoc(docRef, { data: updatedMusic }, { merge: true });
    console.log('Update success');
  }
  // Delete data in firebase
  async deleteData(deletemusci: MusicModel) {
    const docRef = doc(this.db, 'Music');
    // await deleteDoc(docRef,{data:deletemusci},);
    console.log('Delete success');
  }
  //upload file jpg and mp3 to firebase storage
  uploadFile(
    file: File,
    path: string,
  ): Observable<number | string> {
    return new Observable((observer) => {
      const storageRef = ref(this.storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          observer.next(progress);
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          observer.error(error);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            observer.next(downloadURL)
            observer.complete()
          });
        }

      );
    });
  }
}
