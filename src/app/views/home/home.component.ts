import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/service/authentication/auth.service';
import { ChatService } from 'src/app/service/cloud firestore/chat.service';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	userChats$;
	userId;
	constructor(public auth: AuthService, public cs: ChatService) { }
	ngOnInit() {
		this.userChats$ = this.cs.getUserChats();
		// this.cs.getChatIdByUserId("555").subscribe(
		// 	x => {
		// 		x.pipe(
		// 			tap(a=>{
		// 				console.log(a);
		// 			})
		// 		).subscribe()
		// 	}
		// )
	}

}
