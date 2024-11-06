import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {getStorage, provideStorage} from '@angular/fire/storage';
import firebase from 'firebase/app';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({eventCoalescing: true}), provideRouter(routes), provideFirebaseApp(() => initializeApp({
    "projectId": "reanatauth",
    "appId": "1:550340552858:web:7d36557a0e188d57c0d723",
    "databaseURL": "https://reanatauth-default-rtdb.firebaseio.com",
    "storageBucket": "reanatauth.appspot.com",
    // "locationId": "asia-southeast1",
    "apiKey": "AIzaSyA0_if_J3ng3_Yb7VWWtwpOr2aAXUcM-Ic",
    "authDomain": "reanatauth.firebaseapp.com",
    "messagingSenderId": "550340552858",
    "measurementId": "G-RSFTCW7HNC"
  })), provideFirestore(() => getFirestore()), provideStorage(() => getStorage()), provideAnimationsAsync()]
};

