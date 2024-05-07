import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  http1Host = "https://localhost:8080"
  http2Host = "https://localhost:8082"

  constructor() {
  }

  getConnections(): Observable<string> {
    return new Observable<string>(observer => {
      const eventSource = this.getEventSource(this.http1Host + "/connections");
      eventSource.onmessage = event => {
        console.log(event);
        observer.next(event.data as string);
      };
      eventSource.onerror = error => {
        console.log("ERROR")
        observer.next("ERROR");
      };
    });
  }

  getHttp2Connections(): Observable<string> {
    return new Observable<string>(observer => {
      const eventSource = this.getEventSource(this.http2Host + "/connections");
      eventSource.onmessage = event => {
        console.log(event);
        observer.next(event.data as string);
      };
      eventSource.onerror = error => {
        console.log("ERROR")
        observer.next("ERROR");
      };
    });
  }


  getServerSentEvent(): Observable<string> {
    return new Observable<string>(observer => {
      const eventSource = this.getEventSource(this.http1Host + "/sse");
      eventSource.onmessage = event => {
        console.log(event);
        observer.next(event.data);
      };
      eventSource.onerror = error => {
        console.log("ERROR")
        observer.next("ERROR");
      };
    });
  }

  getHttp2ServerSentEvent(): Observable<string> {
    return new Observable<string>(observer => {
      const eventSource = this.getEventSource(this.http2Host + "/sse");
      eventSource.onmessage = event => {
        console.log(event);
        observer.next(event.data);
      };
      eventSource.onerror = error => {
        console.log("ERROR")
        observer.next("ERROR");
      };
    });
  }

  private getEventSource(url: string): EventSource {
    return new EventSource(url);
  }
}
