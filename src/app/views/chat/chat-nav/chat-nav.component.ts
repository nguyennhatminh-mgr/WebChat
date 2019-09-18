import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../service/authentication/auth.service';
import { tap, take, map } from 'rxjs/operators';
import { ChatService } from 'src/app/service/cloud firestore/chat.service';

@Component({
  selector: 'app-chat-nav',
  templateUrl: './chat-nav.component.html',
  styleUrls: ['./chat-nav.component.scss']
})
export class ChatNavComponent implements OnInit {

  user=[
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh 10"}
  ]
  user1=[];

  url="../../../../assets/images/backgroundLogin.jpg";
  indexuser=-1;
  usernamesearch='';
  constructor(public authservice:AuthService,private cs:ChatService) { }

  ngOnInit() {
    this.getAllChatLog();
  }
  onSearch(){
    this.authservice.searchUsersByUsername(this.usernamesearch).pipe(
      tap(x=>{
        this.user1=x;
        x.forEach((element:any) => {
          console.log(element);
        });
      })
    ).subscribe();
  }
  searchUserClick(user){
    this.cs.getChatIdByUserId(user.uid).pipe(
      take(1),
      map((chat:any)=>{
        // console.log(user.uid); 
        // console.log(chat.length);
        console.log(chat);
        if (!chat||!chat.length||chat.length===0){
          this.cs.create(user.uid,'hello');
        } else{
          this.cs.getChatIdByUserId(user.uid);
        }
      })
    ).subscribe();
  }
  getAllChatLog(){
    this.cs.getUserChatLog().pipe(
      take(1),
      map((a:any)=>{
        console.log(a);
      })
    ).subscribe()
  }
}
