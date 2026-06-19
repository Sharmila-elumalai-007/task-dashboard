import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatToggleService {
  private readonly _toggle$ = new Subject<void>();

  readonly toggle$ = this._toggle$.asObservable();

  toggle(): void {
    this._toggle$.next();
  }
}

