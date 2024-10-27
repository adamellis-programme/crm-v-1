// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'

// SDK
import { getFirestore } from 'firebase/firestore' // is the database we are using
// can import admin sdk and then export it to the functions page
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD-wognTbI1M9QQhdH_gKmHOcORQqQR3-Y',
  authDomain: 'crm---v1.firebaseapp.com',
  projectId: 'crm---v1',
  storageBucket: 'crm---v1.appspot.com',
  messagingSenderId: '421656143254',
  appId: '1:421656143254:web:00a026c3552f68bd8229b7',
}

// Initialize Firebase
// passing the config into the firebase app
const app = initializeApp(firebaseConfig)

export const db = getFirestore()
