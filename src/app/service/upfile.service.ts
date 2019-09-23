import { Injectable } from '@angular/core';
import{Observable} from 'rxjs';
import{AngularFireStorage,AngularFireUploadTask} from '@angular/fire/storage';
import { finalize,take,map, last } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UpfileService {

  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  constructor(private storage: AngularFireStorage){

  }
  uploadFile(event,filename) {
    const file = event.target.files[0];
    const filePath = 'files'+Date.now().toString()+filename;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file); 
    

    // observe percentage changes
    // this.uploadPercent = task.percentageChanges();
    // task.snapshotChanges().pipe(
    //   finalize(() => console.log(fileRef.getDownloadURL()) )
    // ).subscribe(x=>x,x=>x,()=>console.log(fileRef.getDownloadURL()));
    // fileRef.getDownloadURL().subscribe(x=>console.log(x));
    return task
    .snapshotChanges().pipe(
      last(),
      map(() => {
        return fileRef.getDownloadURL().pipe(
          map(x=>x)
        );
      })
    );
  }
}
