import * as firebase from 'firebase/app';
import 'firebase/firestore';

export interface Chat {
    user: string;
    type: 'text' | 'image';
    content: string;
    time: firebase.firestore.Timestamp | firebase.firestore.FieldValue;
}
