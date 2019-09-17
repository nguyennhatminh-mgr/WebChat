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
	getChatIdByUserId(userId:string){
		return this.auth.user$.pipe(
			take(1),
			map((user:any) => {
				return this.afs.collection('chatLog', ref=>ref.where('owner','==',user.uid).where('userId','==',userId))
				.snapshotChanges().pipe(
					take(1),
					map(actions => {
						return actions.map(a => {
							const id = a.payload.doc.id;
							return id;
						});
					})
				);
			})
		);
	}
	async create() {
		const { uid } = await this.auth.getUser();
		const data = {
			uid,
			createdAt: Date.now(),
			count: 0,
			messages: []
		};
		const docRef = await this.afs.collection('chats').add(data);
		await this.updateUserChatLog(docRef.id,'abc','def');
		return this.router.navigate(['chats', docRef.id]);
	}
	async updateUserChatLog(chatId, content?, userId?) {
		const { uid } = await this.auth.getUser();
		if (uid) {
			const ref = this.afs.collection('chatLog').doc(chatId);
			ref.get().subscribe((snap) => {
				if (snap.exists) {
					ref.update({
						lastUpdated: Date.now(),
						lastMessage: content,
						messagedBy: uid
					})
				}
				else {
					ref.set({
						userId: userId ? userId : 0,
						lastUpdated: Date.now(),
						owner: uid,
					})
					const subRef = this.afs.collection('users').doc(uid);
					subRef.update({
						chatArray: firestore.FieldValue.arrayUnion(chatId)
					})
				}
			})
		}
	}
	async sendMessage(chatId, content, userId?) {
		const { uid } = await this.auth.getUser();
		const data = {
			uid,
			content,
			createdAt: Date.now()
		};
		if (uid) {
			this.updateUserChatLog(chatId, content, userId);
			const ref = this.afs.collection('chats').doc(chatId);
			return ref.update({
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
