import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })


export class AiService {
  private readonly API_URL = environment.chatEndpoint;


  constructor(private http: HttpClient) {}

  chat(userMessage: string, tasks: Task[]): Observable<any> {


    const today = new Date().toISOString().split('T')[0];
    const taskSummary = tasks.map(t =>
      `[ID:${t.id}] "${t.title}" | Status: ${t.status} | Priority: ${t.priority} | Assignee: ${t.assignee} | Due: ${t.dueDate}`
    ).join('\n');

    const systemPrompt = `You are a helpful task management assistant. Today is ${today}.
You have access to the following tasks:
${taskSummary}

You can help users:
- Search and filter tasks ("Show high priority tasks", "What's overdue?")
- Suggest priority levels for new tasks based on description
- Summarize overdue or upcoming tasks
- Answer questions about task assignments and statuses

Keep responses concise, friendly, and actionable. Use bullet points when listing tasks.
Never make up tasks that aren't in the list above.`;

    const body = {
      model: environment.openaiModel,
      max_tokens: 1000,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7
    };

    return this.http.post<{ content: string }>(this.API_URL, body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });


  }
}
