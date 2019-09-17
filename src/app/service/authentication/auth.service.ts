import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap, first, flatMap, tap,take } from 'rxjs/operators';
import { User } from './../../models/user.model';
import { auth } from 'firebase';
@Injectable({
	providedIn: 'root'
})
export class AuthService {

  userData: Observable<firebase.User>;
  user$: Observable<any>;
  check:boolean;
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

	searchUsersByUsername(username: string) {
		this.afs.collection('users', ref=> ref.where('displayName','==',username)).valueChanges().pipe(
			take(1),
			flatMap(x=>{
				return x;
			}),
			tap((x:any)=>{
				console.log(x.uid);
			})
		).subscribe();
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
			photoURL: user.photoURL
		}
		return userRef.set(data);
	}


	private async updateUserProfile(profile) {
		let user = this.angularFireAuth.auth.currentUser;
		user.updateProfile({
			displayName: profile.displayName,
			photoURL: profile.photoURL
		}).then(() => console.log('success'), () => console.log('error'));
	}

  async signOut() {
    await this.angularFireAuth.auth.signOut();
    return this.router.navigate(['/login']);
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
