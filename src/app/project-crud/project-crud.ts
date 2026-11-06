
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

interface Project {
  _id?: string;
  projectName: string;
  description: string;
  projectManager: string;
  startDate: string;
  endDate: string;
  status: string;
  priority: string;
  budget: number;
}

@Component({
  selector: 'app-project-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './project-crud.html',
  styleUrl: './project-crud.css'
})
export class ProjectCrud implements OnInit {

  private apiUrl = 'http://localhost:8000/projects';

  projects: Project[] = [];
  selectedProject: Project | null = null;
  editingId: string | null = null;

  message = '';
  errorMessage = '';

  projectForm;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.projectForm = this.fb.nonNullable.group({
      projectName: ['', Validators.required],
      description: ['', Validators.required],
      projectManager: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['Not Started', Validators.required],
      priority: ['Medium', Validators.required],
      budget: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  // READ: Retrieve all projects.
  loadProjects(): void {
    this.http.get<Project[]>(this.apiUrl).subscribe({
      next: data => {
        this.projects = data;
        this.errorMessage = '';
      },
      error: err => {
        this.errorMessage = 'Unable to retrieve projects.';
        console.error(err);
      }
    });
  }

  // CREATE or UPDATE a project.
  saveProject(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    const project = this.projectForm.getRawValue();

    if (this.editingId) {
      this.http.put(
        `${this.apiUrl}/${this.editingId}`,
        project
      ).subscribe({
        next: () => {
          this.resetForm();
          this.message = 'Project updated successfully!';
          this.loadProjects();
        },
        error: err => {
          this.errorMessage = 'Unable to update project.';
          console.error(err);
        }
      });
    } else {
      this.http.post(this.apiUrl, project).subscribe({
        next: () => {
          this.resetForm();
          this.message = 'Project created successfully!';
          this.loadProjects();
        },
        error: err => {
          this.errorMessage = 'Unable to create project.';
          console.error(err);
        }
      });
    }
  }

  // READ: Retrieve one project.
  viewProject(id: string): void {
    this.http.get<Project>(`${this.apiUrl}/${id}`).subscribe({
      next: project => {
        this.selectedProject = project;
        this.errorMessage = '';
      },
      error: err => {
        this.errorMessage = 'Unable to retrieve project details.';
        console.error(err);
      }
    });
  }

  // Populate form with existing project information.
  editProject(project: Project): void {
    this.editingId = project._id || null;
    this.projectForm.patchValue(project);
    this.message = '';
    this.errorMessage = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // DELETE a project.
  deleteProject(id: string): void {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.message = 'Project deleted successfully!';
        this.errorMessage = '';

        if (this.selectedProject?._id === id) {
          this.selectedProject = null;
        }

        if (this.editingId === id) {
          this.resetForm();
        }

        this.loadProjects();
      },
      error: err => {
        this.errorMessage = 'Unable to delete project.';
        console.error(err);
      }
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.projectForm.reset({
      projectName: '',
      description: '',
      projectManager: '',
      startDate: '',
      endDate: '',
      status: 'Not Started',
      priority: 'Medium',
      budget: 0
    });
  }
}
