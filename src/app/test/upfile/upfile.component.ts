import { Component, OnInit } from '@angular/core';
import{AngularFireStorage,AngularFireUploadTask} from '@angular/fire/storage';
import{AngularFirestore} from '@angular/fire/firestore';
import{Observable} from 'rxjs';
import { tap, map, take } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-upfile',
  templateUrl: './upfile.component.html',
  styleUrls: ['./upfile.component.scss']
})
export class UpfileComponent implements OnInit {

  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  constructor(private storage: AngularFireStorage){

  }
  ngOnInit(){

  }
  async uploadFile(event) {
    const file = event.target.files[0];
    const filePath = 'name-your-file-path-here';
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    // task.snapshotChanges().pipe(
    //   finalize(() =>{
    //     this.downloadURL = fileRef.getDownloadURL();
    //     console.log(this.downloadURL);
    //     a=this.downloadURL;
        
    //   }  )
    // )
    // .subscribe();
    return fileRef.getDownloadURL().pipe(
      take(1),
      map(value => {
        return value;
      })
    )
      // return await fileRef.getDownloadURL();
  }
  async check(event){
    console.log('click '+ await this.uploadFile(event));
  }

}
