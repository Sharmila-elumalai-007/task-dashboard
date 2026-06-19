import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TaskService } from '../../services/task.service';
import { Observable } from 'rxjs';







@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isDark$!: Observable<boolean>;

  constructor(private taskService: TaskService) {}




  ngOnInit(): void {
    this.isDark$ = this.taskService.isDarkMode$;
  }

  toggleTheme(): void {
    this.taskService.toggleDarkMode();
  }

}


