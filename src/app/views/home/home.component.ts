import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/service/authentication/auth.service';
import { ChatService } from 'src/app/service/cloud firestore/chat.service';
import { from, Observable } from 'rxjs';
import { tap, take, map, flatMap, first, finalize } from 'rxjs/operators';
import { UpfileService } from 'src/app/service/upfile.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	userChats$;
	url = "../../../assets/images/reminduploadfile.png";
	checkedit=true;
	valueedit="";
	oldphotoURL="";
	checkshowimg=true;
	uploadPercent: Observable<number>;
	downloadURL: Observable<string>;
	checkcloadingDone:boolean;
	constructor(public auth: AuthService, public cs: ChatService,public upfile:UpfileService,
		private storage: AngularFireStorage) { }
	ngOnInit() {
		this.auth.getUser().then(
			(x:any)=>{
				this.valueedit=x.displayName;
				this.oldphotoURL=x.photoURL;
			}
		);
		/*CAREFUL: trong home.html phan create co tham so truyen vao la friendId va noi dung tin nhan
		//			ong co gi config lai doan do nhe, hien tai t dang de la '123' va 'hi'
		*/

		/*lay chat theo friendId, co ve la ko dung */
		// this.cs.getChatIdByUserId("def").pipe(
		// 	first(),
		// 	tap(x=>{
		//		// xu ly trong nay
		// 		console.log(x);
		// 	})
		// ).subscribe();

		/* tim kiem nguoi dung theo ten */
		// this.auth.searchUsersByUsername("nhatminh").pipe(
		// 	tap(x => {
		// 		//do any thing with user here
		// 		console.log(x);
		// 	})
		// ).subscribe();

		/* Lay toan bo history */
		// this.cs.getUserChatLog().pipe(
		// 	take(1),
		// 	tap(x=>{
		//		// xu ly trong nay
		// 		console.log(x); 
		// 	})
		// ).subscribe();
		

		//lay hinh, 1 trong 2 cach nhe
		//truyen tham so userid vao nhe, cai kia la tui test thoi
		/*c1 : */
		// this.auth.getImageURLByUserId('vuZjsrf4pchNKdWXRzPqrMA0vFR2').pipe(
		// 	take(1),
		// 	tap(x=>{
		//	// xu ly trong nay
		// 		console.log(x);
		// 	})
		// ).subscribe()

		/*c2 : */
		// this.auth.getImageURLByUserId('vuZjsrf4pchNKdWXRzPqrMA0vFR2').subscribe(x=>{
		// 	// xu ly trong nay
		// 	console.log(x)
		// });
	}

	getUrl() {
		if (this.auth.user$) {

		}
	}
	getCheckEdit(){
		this.checkedit=!this.checkedit;
	}
	updateUsername(){
		this.auth.getUser().then(
			(x:any)=>{
				this.oldphotoURL=x.photoURL;
				let profile={
					displayName: this.valueedit,
					photoURL: this.oldphotoURL
				}
				console.log("profile="+profile);
				this.auth.updateUserProfile(profile);
			}
		);
		
	}
	updateURL(event){
		this.checkcloadingDone=true;
		this.auth.getUser().then(
			(x:any)=>{
				this.valueedit=x.displayName;
			}
		);
		let type = event.target.files[0].type.split('/')[0];
		let content = event.target.files[0].name;
		const file = event.target.files[0];
    	const filePath = 'images'+Date.now().toString()+content;
    	const fileRef = this.storage.ref(filePath);
    	const task = this.storage.upload(filePath, file); 
		if(type==='image'){
			// this.upfile.uploadFile(event,content).pipe(
			// 	tap(x=>{
			// 	  x.subscribe(a=>{
					// let profile={
					// 	displayName: this.valueedit,
					// 	photoURL: a
					// }
					// this.auth.updateUserProfile(profile);
					// console.log("update successful");
			// 	  })
			// 	})
			//   ).subscribe();
			this.uploadPercent = task.percentageChanges();
    		// get notified when the download URL is available
    		task.snapshotChanges().pipe(
				finalize(() => fileRef.getDownloadURL()
					.pipe(
					tap(x=>{
						let profile={
							displayName: this.valueedit,
							photoURL: x
						}
						this.auth.updateUserProfile(profile).then(
							// a=>{this.checkcloadingDone=false;}
						);
						console.log("update successful");
						// this.checkcloadingDone=false;
					}),
					tap(x=>{
						this.checkcloadingDone=false;
					})
					).subscribe()
				),
				
     			)
    		.subscribe()

		}
		
	  }
	
}
