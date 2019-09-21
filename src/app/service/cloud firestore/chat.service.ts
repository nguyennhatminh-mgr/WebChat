import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../authentication/auth.service';
import { Router } from '@angular/router';
import { map, switchMap, tap, take, flatMap, mergeMap, concatAll, toArray, combineAll, concat, zip, exhaustMap, reduce } from 'rxjs/operators';
import { firestore } from 'firebase';
import { Observable, combineLatest, of, from, forkJoin } from 'rxjs';


@Injectable({
	providedIn: 'root'
})
export class ChatService {

	constructor(
		private afs: AngularFirestore,
		private afu: AngularFireAuth,
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
	getUserChatLog() {
		let uid = this.afu.auth.currentUser.uid;
		let chatLog;
		const joinKeys = {}
		return this.afs
			.collection('chats', ref => ref.where(`users.${uid}`, '==', true))
			.snapshotChanges()
			.pipe(
				map(actions => {
					return actions.map(a => {
						const data: Object = a.payload.doc.data();
						const id = a.payload.doc.id;
						let isChatRoom = data['isChatRoom']?true:false;
						let friendId;
						if (!isChatRoom) {
							friendId = Object.keys(data['users']).find(x => x !== uid);
						}
						let info = {
							lastUpdated: data['lastUpdated'],
							lastMessage: data['lastMessage'],
							friendId,
							isChatRoom,
						}
						return { id, ...info };
					});
				}),
				switchMap(item=>{
					chatLog = item;
					const userInfo = item
						.filter(element=>element.friendId)
						.map(u=>this.afs.doc(`users/${u.friendId}`).valueChanges())
					return userInfo.length ? combineLatest(userInfo) : of([]);
				}),
				map(arr => {
					arr.forEach((v:any)=> (joinKeys[v.uid] = {
						displayName:v.displayName,
						photoURL:v.photoURL
					}))
					let mappedChatLog = chatLog.map(x=>{
						return {...x,...joinKeys[x.friendId]}
					})
					mappedChatLog.sort(function(a:any,b:any){return b.lastUpdated - a.lastUpdated });
					return mappedChatLog;
				}),
			);
	}
	getChatIdByUserId(userId: string) {
		return this.auth.user$.pipe(
			switchMap(user => {
				return this.afs
					.collection('chats', ref => ref.where(`users.${user.uid}`, '==', true).where(`users.${userId}`, '==', true))
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
	async create(friendId?: string, isChatRoom?:boolean, roomName?:string) {
		const { uid } = await this.auth.getUser();
		let a = {};
		a[uid] = true;
		a[friendId] = true;
		const data = {
			users: a,
			user: uid,
			createdAt: Date.now(),
			lastUpdated: Date.now(),
			count: 0,
			messages: [],
			isChatRoom,
			roomName
		};
		const docRef = await this.afs.collection('chats').add(data);
		this.router.navigate(['chats', docRef.id]);
	}
	async sendMessage(chatId, content, type, fileURL?) {
		const { uid } = await this.auth.getUser();
		const data = {
			uid,
			content,
			type,
			fileURL: fileURL ? fileURL : '',
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


}
