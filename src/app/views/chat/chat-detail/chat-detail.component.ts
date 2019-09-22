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
  type="";
  chatId;
  constructor(
    public cs: ChatService,
    private route: ActivatedRoute,
    public auth: AuthService,
    public upfile:UpfileService
  ) {
      this.displayusername=false;
   }

  ngOnInit() {
    this.route.params.subscribe(
      params=> {
        this.chatId = params['id'];
        const source = this.cs.get(this.chatId);
        this.chat$ = this.cs.joinUsers(source);
      }
    )
    // let chatId = this.route.snapshot.paramMap.get('id');
    // if (!chatId){
    //   chatId = "L8DXImtGfWNst2znSAZu";
    // }
    // const source = this.cs.get(chatId);
    // this.chat$ = this.cs.joinUsers(source);
  }

  submit(chatId){
    if (!this.newMsg) {
      return alert('you need to enter something');
    }
    this.cs.sendMessage(chatId, this.newMsg, 'message');
    this.newMsg = '';
  }

  trackByCreated(i, msg){
    return msg.createdAt;
  }

  scrollHandler(e){
    console.log(e);
  }
  upFile(event){
    let type = event.target.files[0].type.split('/')[0];
    let content = event.target.files[0].name;
    this.upfile.uploadFile(event,content).pipe(
      tap(x=>{
        x.subscribe(a=>{
          this.downloadURL=a;
          this.cs.sendMessage(this.chatId,content,type,a);
        })
      })
    ).subscribe();
    
  }

}
