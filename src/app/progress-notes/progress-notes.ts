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
    projectCode: new FormControl(''),
    projectName: new FormControl(''),
    date: new FormControl(''),
    currentStatus: new FormControl(''),
    teamMember: new FormControl(''),
    progressNote: new FormControl('')
  });

projectCodeMessage = '';

updateProjectName() {
  const code = this.progressNotesForm.get('projectCode')?.value?.toUpperCase();

  const projectCodes: { [key: string]: string } = {
    PPT101: 'Project Progress Tracker',
    WEB202: 'Website Redesign',
    APP303: 'Mobile Application Development',
    DATA404: 'Data Analytics Dashboard'
  };

  if (code && projectCodes[code]) {
    this.progressNotesForm
      .get('projectName')
      ?.setValue(projectCodes[code]);

    this.projectCodeMessage = '';
  } else {
    this.progressNotesForm
      .get('projectName')
      ?.setValue('');

    this.projectCodeMessage = 'Project code not found.';
  }
}

}
