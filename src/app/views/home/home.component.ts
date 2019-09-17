import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/service/authentication/auth.service';
import { ChatService } from 'src/app/service/cloud firestore/chat.service';
import { from } from 'rxjs';
import { tap, take, map, flatMap, first } from 'rxjs/operators';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	userChats$;
	url = "../../../../assets/images/backgroundLogin.jpg";
	constructor(public auth: AuthService, public cs: ChatService) { }
	ngOnInit() {
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
}
