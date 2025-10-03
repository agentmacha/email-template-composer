import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppState {
  clientId: string;
  tenantId: string;
  orgTenantId?: string;
  orgId?: string;
  clientInfo?: {
    clientId: string;
    tenantId: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private stateSubject = new BehaviorSubject<AppState>({
    clientId: 'demo-client-123',
    tenantId: 'demo-tenant-456',
    orgTenantId: 'demo-tenant-456',
    orgId: 'demo-org-789',
    clientInfo: {
      clientId: 'demo-client-123',
      tenantId: 'demo-tenant-456'
    }
  });

  constructor() {}

  getState(): AppState {
    return this.stateSubject.value;
  }

  setState(newState: Partial<AppState>): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({ ...currentState, ...newState });
  }

  getStateObservable() {
    return this.stateSubject.asObservable();
  }
}




