import { Component, HostListener, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AiService } from '../../services/ai.service';
import { TaskService } from '../../services/task.service';
import { ChatMessage } from '../../models/task.model';


@Component({
  selector: 'app-ai-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
  templateUrl: './ai-chatbot.component.html',
  styleUrls: ['./ai-chatbot.component.scss']
})
export class AiChatbotComponent implements OnInit, OnDestroy {

  // Drag state for the floating chat button
  private dragStartX = 0;
  private dragStartY = 0;
  private startLeft = 0;
  private startTop = 0;

  chatPosLeft = 24; // px from left
  chatPosTop = 24; // px from top

  isDragging = false;
  @ViewChild('messagesEnd') messagesEnd!: ElementRef;

  isOpen = false;
  messages: ChatMessage[] = [];
  input = '';
  isLoading = false;

  suggestions = [
    'Show high priority tasks',
    'What tasks are overdue?',
    'Summarize pending tasks',
    'Who has the most tasks?'
  ];

  constructor(
    private aiService: AiService,
    private taskService: TaskService
  ) {}



  ngOnInit(): void {
    // Load persisted chat position (px) if available
    try {
      const raw = localStorage.getItem('ai_chat_fab_pos');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed?.left === 'number' && typeof parsed?.top === 'number') {
          this.chatPosLeft = parsed.left;
          this.chatPosTop = parsed.top;
        }
      }
    } catch {
      // ignore
    }

    this.messages = [{
      role: 'assistant',
      content: 'Hi! I\'m your Task AI assistant. Ask me about your tasks — I can find high priority items, summarize overdue tasks, suggest priorities, or answer questions about your team\'s workload.',
      timestamp: new Date()
    }];
  }


  // Start dragging
  onFabPointerDown(event: PointerEvent): void {
    // Only left click / primary touch
    if (event.button !== 0 && event.pointerType === 'mouse') return;

    this.isDragging = true;
    // If user starts a drag/click, don't also trigger the button's normal click.
    event.stopPropagation();

    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.startLeft = this.chatPosLeft;
    this.startTop = this.chatPosTop;

    (event.target as HTMLElement)?.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }

  onFabPointerMove(event: PointerEvent): void {
    if (!this.isDragging) return;

    const dx = event.clientX - this.dragStartX;
    const dy = event.clientY - this.dragStartY;

    this.chatPosLeft = Math.max(8, this.startLeft + dx);
    this.chatPosTop = Math.max(8, this.startTop + dy);
  }

  // Stop dragging + persist
  onFabPointerUp(): void {
    if (!this.isDragging) return;
    this.isDragging = false;

    try {
      localStorage.setItem('ai_chat_fab_pos', JSON.stringify({ left: this.chatPosLeft, top: this.chatPosTop }));
    } catch {
      // ignore
    }
  }

  // Ensure drag ends even if pointer leaves the element
  @HostListener('window:pointerup')
  onWindowPointerUp(): void {
    this.onFabPointerUp();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  private toggleFromHeader(): void {
    // Header button toggles the existing chat panel
    this.isOpen = !this.isOpen;
    if (this.isOpen) setTimeout(() => this.scrollToBottom(), 100);
  }

  toggle(): void {
    // Keep existing behavior for FAB + close button inside panel
    this.toggleFromHeader();
  }




  ngAfterViewInit(): void {
    // no-op (kept for future)
  }

  ngOnDestroy(): void {
    // No-op
  }

  sendSuggestion(text: string): void {

    this.input = text;
    this.send();
  }

  send(): void {
    const msg = this.input.trim();
    if (!msg || this.isLoading) return;

    this.messages.push({ role: 'user', content: msg, timestamp: new Date() });
    this.input = '';
    this.isLoading = true;
    this.scrollToBottom();

    const tasks = this.taskService.getSnapshot();

    this.aiService.chat(msg, tasks).subscribe({
      next: (res) => {
        const text = res?.content ?? 'Sorry, I couldn\'t understand that.';

        this.messages.push({ role: 'assistant', content: text, timestamp: new Date() });
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: () => {
        this.messages.push({
          role: 'assistant',
          content: 'Sorry, I had trouble connecting. Please check your API key in the environment config.',
          timestamp: new Date()
        });
        this.isLoading = false;
        this.scrollToBottom();
      }
    });
  }

  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.send();
    }
  }

}
