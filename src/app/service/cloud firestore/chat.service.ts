import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../authentication/auth.service';
import { Router } from '@angular/router';
import { map, switchMap, tap, take } from 'rxjs/operators';
import { firestore } from 'firebase';
import { Observable, combineLatest, of } from 'rxjs';


@Injectable({
	providedIn: 'root'
})
export class ChatService {

	constructor(
		private afs: AngularFirestore,
		private auth: AuthService,
		private router: Router
	) { }

	get(chatId) {
		return this.afs
			.collection<any>('chats')
			.doc(chatId)
			.snapshotChanges()
			.pipe(
				map(doc => {
					return { id: doc.payload.id, ...doc.payload.data() };
				})
			);
	}

	getUserChats() {
		return this.auth.user$.pipe(
			switchMap(user => {
				return this.afs
					.collection('chats', ref => ref.where('uid', '==', user.uid))
					.snapshotChanges()
					.pipe(
						map(actions => {
							return actions.map(a => {
								const data: Object = a.payload.doc.data();
								const id = a.payload.doc.id;
								return { id, ...data };
							});
						})
					);
			})
		);
	}

	getUserChatLog(){
		return this.auth.user$.pipe(
			switchMap(user => {
				return this.afs
					.collection('chats', ref => ref.where(`users.${user.uid}`,'==', true).orderBy('lastUpdated','desc'))
					.snapshotChanges()
					.pipe(
						map(actions => {
							return actions.map(a => {
								const data: Object = a.payload.doc.data();
								const id = a.payload.doc.id;
								return { id, ...data };
							});
						})
					);
			})
		);
	}
	getChatIdByUserId(userId:string){
		return this.auth.user$.pipe(
			switchMap(user => {
				return this.afs
					.collection('chats', ref=>ref.where(`users.${user.uid}`,'==',true).where(`users.${userId}`,'==',true))
					.snapshotChanges()
					.pipe(
						map(actions => {
							return actions.map(a => {
								const data: Object = a.payload.doc.data();
								const id = a.payload.doc.id;
								// this.router.navigate(['chats',id]);
								return { id, ...data };
							});
						})
					);
			})
		);
	}
	async create(friendId?:string,content?:string) {
		console.log('a');
		const { uid } = await this.auth.getUser();
		let a = {};
		a[uid]=true;
		a[friendId]=true;
		const data = {
			users:a,
			createdAt: Date.now(),
			lastUpdated: Date.now(),
			count: 0,
			messages: []
		};
		console.log('b');
		const docRef = await this.afs.collection('chats').add(data);
		console.log('c');
		this.router.navigate(['chats', docRef.id]);
	}
	async sendMessage(chatId, content) {
		const { uid } = await this.auth.getUser();
		const data = {
			uid,
			content,
			createdAt: Date.now()
		};
		if (uid) {
			const ref = this.afs.collection('chats').doc(chatId);
			return ref.update({
				lastUpdated: Date.now(),
				lastMessage: content,
				count: firestore.FieldValue.increment(1),
				messages: firestore.FieldValue.arrayUnion(data)
			})
		}
	}

	joinUsers(chat$: Observable<any>) {
		let chat;
		const joinKeys = {};

		return chat$.pipe(
			switchMap(c => {
				chat = c;
				const uids = Array.from(new Set(c.messages.map(v => v.uid)));

				const userDocs = uids.map(u =>
					this.afs.doc(`users/${u}`).valueChanges()
				);

				return userDocs.length ? combineLatest(userDocs) : of([]);
			}),
			map(arr => {
				arr.forEach(v => (joinKeys[(<any>v).uid] = v));
				chat.messages = chat.messages.map(v => {
					return { ...v, user: joinKeys[v.uid] };
				});
				return chat;
			})
		)
	}
}
