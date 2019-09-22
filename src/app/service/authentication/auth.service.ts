import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap, first, flatMap, tap,take, map } from 'rxjs/operators';
import { User } from './../../models/user.model';
import { auth } from 'firebase';
@Injectable({
	providedIn: 'root'
})
export class AuthService {

  userData: Observable<firebase.User>;
  user$: Observable<any>;
  check=true;
  constructor(
    private angularFireAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router:Router,
  ) {
    this.userData = angularFireAuth.authState;
    this.user$ = angularFireAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    )
  }



	getUser() {
		return this.user$.pipe(first()).toPromise();
	}
	getImageURLByUserId(userId:string){
		return this.afs.collection('users').doc(userId).valueChanges().pipe(
			take(1),
			map((x:any)=>x.photoURL)
		);
	}
	searchUsersByUsername(username: string) {
    return this.afs.collection('users', ref=> ref.where('displayName','==',username)).valueChanges()
      .pipe(
			take(1),
			map(x=>{
				return x;
			}),
		);
	}

	googleSignIn() {
		const provider = new auth.GoogleAuthProvider();
		return this.oAuthLogin(provider);
	}

	private async oAuthLogin(provider) {
		const credential = await this.angularFireAuth.auth.signInWithPopup(provider);
		return this.updateUserData(credential.user);
	}

	private updateUserData(user) {
		const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
		const data: User = {
			uid: user.uid,
			email: user.email,
			displayName: user.displayName,
			photoURL: user.photoURL?user.photoURL : null
		}
		this.router.navigate(['/home']);
		return userRef.set(data);
	}


	public async updateUserProfile(profile) {
		let user = this.angularFireAuth.auth.currentUser;
		const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
		let updateData = {
			displayName: profile.displayName?profile.displayName:null,
			photoURL: profile.photoURL?profile.photoURL:null,
		};
		user.updateProfile(updateData).then(() => {
			userRef.update(updateData)
		}, () => console.log('error'));
	}

  async signOut() {
    await this.angularFireAuth.auth.signOut();
    return this.router.navigate(['/login']);
  }

	/* Sign up */
	SignUp(email: string, password: string, username?: string) {
		this.angularFireAuth
			.auth
			.createUserWithEmailAndPassword(email, password)
			.then(async (res: any) => {
				await this.updateUserProfile({ displayName: username });
				const user = res.user;
				const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
				const data: User = {
					uid: user.uid,
					email: user.email,
					displayName: username,
					photoURL: user.photoURL
				};
				userRef.set(data);
				console.log('Successfully signed up!', res);
				return this.router.navigate(['/home']);
			})
			.catch(error => {
				console.log('Something is wrong:', error.message);
			});
	}


  /* Sign in */
  SignIn(email: string, password: string):boolean {
    // var check=true;
    this.angularFireAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then((res:any) => {
        const user = res.user;
        console.log(user);
        const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
        const data:User = {
          uid : user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }
        userRef.set(data);
		console.log('Successfully signed in!');
        return this.router.navigate(['/home']);
      })
      .catch(err => {
        console.log('Something is wrong:', err.message);
		this.check = false;
		return false;
      });
	return this.check;
  }

	/* Sign out */
	SignOut() {
		this.angularFireAuth
			.auth
			.signOut();
	}
}
