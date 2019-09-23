import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/authentication/auth.service';
import { tap, take, map, combineLatest } from 'rxjs/operators';
import { ChatService } from 'src/app/service/cloud firestore/chat.service';

import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { Log } from 'src/app/models/log.model';


@Component({
  selector: 'app-chat-nav',
  templateUrl: './chat-nav.component.html',
  styleUrls: ['./chat-nav.component.scss']
})
export class ChatNavComponent implements OnInit {
  checkshowchatroom=true;
  nameChatroom="";
  nameGroupsearch="";
  usersearched = [];
  listuser=[];
  usersDisplay=[];
  groupSearch=[];

  url = "../../../../assets/images/groupAvatar.png";
  indexuser = -1;
  usernamesearch = '';
  check=true;
  user1 = [];
  $chatUsers;
 

  $chatLogs: Observable<Array<any>>;

  constructor(public authservice: AuthService, public cs: ChatService,
    private router:Router
    ) { }

  ngOnInit() {
    this.$chatLogs = this.cs.getUserChatLog();
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
  onGroupSearch(){
    this.authservice.searchUsersByUsername(this.nameGroupsearch).pipe(
      tap(x => {
        this.groupSearch = x;
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
        console.log(chat);
        // console.log(usersDisplay.uid); 
        // console.log(chat.length);
        if (!chat || !chat.length || chat.length === 0) {
          this.cs.create(usersDisplay.uid, false);
        } else {
          this.router.navigate(['chats',chat[0].id]);          
        }
      })
    ).subscribe();
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

  elementTrack(i,item){
    return item.id;
  }
  createMMTChatroom(){
    this.router.navigate(['chats/INeV2z7vAVnI4219MjJV']);
  }
  addUserToGroup(){
    // this.cs.addUserToGroup('groupId','userId');
  }
}
