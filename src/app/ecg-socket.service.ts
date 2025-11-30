import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface VitalsData {
  heartRate: number;
  spo2: number;
}

@Injectable({
  providedIn: 'root'
})
export class EcgSocketService implements OnDestroy {
  private vitalsSubject = new Subject<VitalsData>();
  private ecgSubject = new Subject<number>();
  private socket?: WebSocket;

  // Default URL; callers may pass a different url to connect()
  private readonly defaultUrl = 'ws://192.168.1.25:8080';

  /**
   * Connect to the WebSocket. If `url` is provided it overrides the default.
   * Only a single socket instance is used; repeated calls when already open do nothing.
   */
  connect(url?: string): void {
    const wsUrl = url ?? this.defaultUrl;
    if (this.socket && this.socket.readyState === WebSocket.OPEN) return;

    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connected to', wsUrl);
    };

    this.socket.onmessage = (ev: MessageEvent) => {
      try {
        const data = JSON.parse(ev.data);

        // Route by explicit type if available:
        if (data?.type === 'ecg' && typeof data.value === 'number') {
          this.ecgSubject.next(data.value);
          return;
        }
        if (data?.type === 'vitals' && typeof data.heartRate === 'number') {
          // cast/validate a bit and emit
          const payload: VitalsData = {
            heartRate: Number(data.heartRate),
            spo2: Number(data.spo2 ?? 0)
          };
          this.vitalsSubject.next(payload);
          return;
        }

        // Fallback: if message already matches VitalsData shape
        if (typeof data.heartRate === 'number' && typeof data.spo2 === 'number') {
          this.vitalsSubject.next({ heartRate: data.heartRate, spo2: data.spo2 });
          return;
        }

        // otherwise ignore/unrecognized message
      } catch (err) {
        console.warn('WS parse error:', err);
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket closed');
      this.socket = undefined;
    };

    this.socket.onerror = (err) => {
      console.error('WebSocket error:', err);
    };
  }

  getVitalsStream(): Observable<VitalsData> {
    return this.vitalsSubject.asObservable();
  }

  getEcgStream(): Observable<number> {
    return this.ecgSubject.asObservable();
  }

  disconnect(): void {
    this.socket?.close();
    this.socket = undefined;
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}