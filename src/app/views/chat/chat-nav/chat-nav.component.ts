import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/authentication/auth.service';
import { tap, take, map, combineLatest } from 'rxjs/operators';
import { ChatService } from 'src/app/service/cloud firestore/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-nav',
  templateUrl: './chat-nav.component.html',
  styleUrls: ['./chat-nav.component.scss']
})
export class ChatNavComponent implements OnInit {
  currentUser;
  usersearched = [];
  listuser=[];
  usersDisplay=[];

  url = "../../../../assets/images/backgroundLogin.jpg";
  indexuser = -1;
  usernamesearch = '';
  check;
  constructor(public authservice: AuthService, private cs: ChatService,
    private router:Router
    ) { }

  ngOnInit() {
    this.currentUser = this.authservice.user$;
    this.getAllChatLog();
  }
  onSearch() {
    this.authservice.searchUsersByUsername(this.usernamesearch).pipe(
      tap(x => {
        this.usersearched = x;
        x.forEach((element: any) => {
          console.log(element);
        });
      })
    ).subscribe();
  }
  searchUserClick(usersDisplay) {
    this.cs.getChatIdByUserId(usersDisplay.uid).pipe(
      take(1),
      map((chat: any) => {
        // console.log(usersDisplay.uid); 
        // console.log(chat.length);
        console.log(chat);
        if (!chat || !chat.length || chat.length === 0) {
          this.cs.create(usersDisplay.uid, 'hello');
        } else {
          this.cs.getChatIdByUserId(usersDisplay.uid);
        }
      })
    ).subscribe();
  }
  getAllChatLog() {
    this.cs.getUserChatLog().pipe(
      tap((a: any) => {
        a.sort((a: any, b: any) => {
          let keyA = new Date(a.lastUpdated);
          let keyB = new Date(b.lastUpdated);
          if (keyA < keyB) return 1;
          if (keyA > keyB) return -1;
          return 0;
        })
        console.log('a');
        a.forEach(element => {
          // console.log(element)
        });
        console.log(a);
        this.listuser=a;
        // this.usersDisplay=this.listuser;
        this.check=true;
      })
    ).subscribe()
  }

  checkSearch($event){
    // console.log($event.target.value)
    if(!$event.target.value){
      // this.usersDisplay=this.listuser;
      this.check=true;
    }
    else{
      // this.usersDisplay=this.usersearched;
      this.check=false;
    }
  }
  getChatCouple(user){
    // console.log("uid"+user.id);
    this.router.navigate(['/chats/'+user.id]);
  }
}
