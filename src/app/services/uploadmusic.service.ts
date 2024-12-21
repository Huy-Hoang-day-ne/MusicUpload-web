import { Injectable } from '@angular/core';
import {MusicModel} from '../model/music.model';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  getFirestore, onSnapshot,
  query,
  setDoc, where
} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  getMetadata,
  listAll
} from '@angular/fire/storage';
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
  //get music by ID
  async getMusicById(id: string): Promise<MusicModel | undefined> {
    const docRef = doc(this.db, 'music', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as MusicModel;
    } else {
      console.log('No such document!');
      return undefined;
    }
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
  // Delete data in firebase
  async deleteMusicById(id: string): Promise<void> {
    const docRef = doc(this.db, 'music', id);
    try {
      await deleteDoc(docRef);
      console.log('Document delete success');
    } catch (error) {
      console.error('Error deleting document: ', error);
      throw error;
    }
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
  searchMusicRealtime(searchTerm: string, callback: (results: MusicModel[]) => void): void {
    const musicCollection = collection(this.db, 'music');

    // Truy vấn tất cả dữ liệu từ Firestore
    const musicQuery = query(musicCollection);

    // Mảng lưu trữ kết quả và bộ lọc ID duy nhất
    const uniqueIds = new Set<string>();

    // Lấy dữ liệu từ Firestore và áp dụng bộ lọc
    onSnapshot(musicQuery, (querySnapshot) => {
      const results: MusicModel[] = []; // Đặt lại mảng mỗi lần snapshot

      querySnapshot.docs.forEach((doc) => {
        const music = doc.data() as MusicModel;
        const title = music.title || '';
        const artist = music.artist || '';
        const singer = music.singer || '';
        const searchTermLower = searchTerm.toLowerCase();

        // Lọc dữ liệu theo searchTerm và tránh trùng lặp ID
        if (
          !uniqueIds.has(music.id) &&
          (title.toLowerCase().includes(searchTermLower) ||
            artist.toLowerCase().includes(searchTermLower) ||
            singer.toLowerCase().includes(searchTermLower))
        ) {
          uniqueIds.add(music.id);
          results.push(music);
        }
      });

      // Gọi callback để trả kết quả
      callback(results);
    });
  }
}
