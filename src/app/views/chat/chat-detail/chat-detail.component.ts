import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/service/cloud firestore/chat.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/service/authentication/auth.service';
import{UpfileService}from '../../../service/upfile.service';
import { take, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.scss']
})
export class ChatDetailComponent implements OnInit {

  chat$ : Observable<any>;
  newMsg: string;
  displayusername:boolean;
  dem=-1;
  scrolltop;
  downloadURL:Observable<any>;
  constructor(
    public cs: ChatService,
    private route: ActivatedRoute,
    public auth: AuthService,
    public upfile:UpfileService
  ) {
      this.displayusername=false;
   }

  ngOnInit() {
    let chatId = this.route.snapshot.paramMap.get('id');
    if (!chatId){
      chatId = "L8DXImtGfWNst2znSAZu";
    }
    const source = this.cs.get(chatId);
    this.chat$ = this.cs.joinUsers(source);
  }

  submit(chatId){
    if (!this.newMsg) {
      return alert('you need to enter something');
    }
    this.cs.sendMessage(chatId, this.newMsg);
    this.newMsg = '';
  }

  trackByCreated(i, msg){
    return msg.createdAt;
  }

  scrollHandler(e){
    console.log(e);
  }
  upFile(event){
    this.upfile.uploadFile(event).pipe(
      take(1),
      tap(x=>{
        console.log(x);
        this.downloadURL=x;
      })
    ).subscribe();
  }

}
