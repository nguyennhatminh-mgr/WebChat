import { Injectable } from '@angular/core';
import{Observable} from 'rxjs';
import{AngularFireStorage,AngularFireUploadTask} from '@angular/fire/storage';
import { finalize,take,map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UpfileService {

  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  constructor(private storage: AngularFireStorage){

  }
  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = 'name-your-file-path-here';
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    // task.snapshotChanges().pipe(
    //     finalize(() =>{
    //       this.downloadURL = fileRef.getDownloadURL();
    //       console.log(this.downloadURL);
    //     }  )
    //  )
    // .subscribe();

    return fileRef.getDownloadURL();
    
  }
}
