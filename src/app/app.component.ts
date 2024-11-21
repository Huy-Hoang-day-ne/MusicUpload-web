import {ChangeDetectionStrategy, Component, input, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {UploadmusicService} from './services/uploadmusic.service';
import {MusicModel} from './model/music.model';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {doc} from '@angular/fire/firestore';
import firebase from 'firebase/app';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {window} from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.getMusicList();
  }

  title = 'plsrun';
  newSongId = Date.now().toString();
  newSongLink = '';
  newSongCoverLink = '';
  musicFormGroup !: FormGroup;
  musics: MusicModel[] = [];
  searchTerm: string = '';

  constructor(public uploadmusic: UploadmusicService) {
    this.musicFormGroup = new FormGroup({
      id: new FormControl(this.newSongId),
      title: new FormControl(''),
      artist: new FormControl(''),
      singer: new FormControl(''),
      category: new FormControl(''),
      publishedDate: new FormControl(''),
      mp3: new FormControl(''),
      image: new FormControl('')
    })
  }

  // Upload file to firebase storage
  onSongFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const path = `Music/${this.newSongId}/song`;
      this.uploadmusic.uploadFile(file, path).subscribe({
        next: (value) => {
          this.newSongLink = value as string
          this.newSongCoverLink = value as string
        },
        error: (error) => console.error('Upload error:', error),
        complete: () => {
          this.musicFormGroup.setValue({...this.musicFormGroup.value, mp3: this.newSongLink});
          console.log(this.musicFormGroup)
        }
      });
    }
  }

  onImgFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const path = `Music/${this.newSongId}/image`;
      this.uploadmusic.uploadFile(file, path).subscribe({
        next: (value) => {
          this.newSongLink = value as string
          this.newSongCoverLink = value as string
        },
        error: (error) => console.error('Upload error:', error),
        complete: () => {
          this.musicFormGroup.setValue({...this.musicFormGroup.value, image: this.newSongCoverLink});
          console.log(this.musicFormGroup)
        }
      });
    }
  }

  // Get list music from firebase
  getMusicList() {
    this.uploadmusic.getData().then((data) => {
      this.musics = data;
    }).catch((error) => {
      console.error('Error getting documents: ', error);
    });
  }
  // Get music by id
  getMusicById(id: string) {
    this.uploadmusic.getMusicById(id).then((music) => {
      if (music) {
        this.musicFormGroup.setValue(music);
      }
    }).catch((error) => {
      console.error('Error getting document: ', error);
    });
  }
  // Summit upload music to firebase
  postData() {
    let newMusic = this.musicFormGroup.value;
    this.uploadmusic.postData(newMusic).then(() => {
      this.newSongId = Date.now().toString()
      this.musicFormGroup.reset()
      this.resetPage();
      // this.getData();
    });
  }
  resetPage(){
    location.reload();
  }
  // Delete music by id
  deleteMusicById(id: string) {
    console.log('Deleting music with id:', id); // Debug log
    this.uploadmusic.deleteMusicById(id).then(() => {
      this.getMusicList();
    }).catch((error) => {
      console.error('Error deleting document: ', error);
    });
  }
  searchMusic() {
    this.uploadmusic.searchMusicRealtime(this.searchTerm, (results) => {
      this.musics = results;
    });
  }
}
