import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

@Component({
  selector: 'app-progress-notes',
  imports: [ReactiveFormsModule],
  templateUrl: './progress-notes.html',
  styleUrl: './progress-notes.css',
})
export class ProgressNotes {

  progressNotesForm = new FormGroup({
    projectName: new FormControl(''),
    date: new FormControl(''),
    currentStatus: new FormControl(''),
    teamMember: new FormControl(''),
    progressNote: new FormControl('')
  });

}
