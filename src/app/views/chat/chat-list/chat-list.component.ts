import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
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

  url="../../../../assets/images/backgroundLogin.jpg";
  constructor() { }

  ngOnInit() {
  }

}
