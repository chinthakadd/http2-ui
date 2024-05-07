import {Component, Directive, ElementRef, NgZone, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ClientService} from "./client.service";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {share} from "rxjs/operators";

/**
 * https://stackoverflow.com/questions/50519200/angular-6-view-is-not-updated-after-changing-a-variable-within-subscribe
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'minion-demo-ui-http2';

  h1ConnectionCount: string = "-1";
  h1ConnectionCount$ = new BehaviorSubject<string>(this.h1ConnectionCount);

  h2ConnectionCount: string = "-1";
  h2ConnectionCount$ = new BehaviorSubject<string>(this.h2ConnectionCount);

  h1StreamCount: number = 0
  h1StreamCount$ = new BehaviorSubject<number>(this.h1StreamCount);

  h2StreamCount: number = 0
  h2StreamCount$ = new BehaviorSubject<number>(this.h2StreamCount);

  @ViewChild("h1div", {static: false})
  h1Div: ElementRef;

  @ViewChild("h2div", {static: false})
  h2Div: ElementRef;

  constructor(private clientService: ClientService, private elementRef: ElementRef,
              private renderer: Renderer2,
              private ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.clientService.getConnections()
      .subscribe(
        count => {
          this.ngZone.run(() => {
            this.h1ConnectionCount = count;
            this.h1ConnectionCount$.next(this.h1ConnectionCount);


            this.h1StreamCount = document.querySelectorAll('.h1').length;
            this.h1StreamCount$.next(this.h1StreamCount);
          });
        }
      );

    this.clientService.getHttp2Connections()
      .subscribe(
        count => {
          this.ngZone.run(() => {
            this.h2ConnectionCount = count;
            this.h2ConnectionCount$.next(this.h2ConnectionCount);

            this.h2StreamCount = document.querySelectorAll('.h2').length;
            this.h2StreamCount$.next(this.h2StreamCount);
          });
        }
      );
  }


  addHttp1() {
    console.log("Clicked HTTP 1");
    // this.connectionCount$.next("TESSSS");
    const p: HTMLDivElement = this.renderer.createElement("div")
    p.setAttribute("class", "col-lg-1 cell-off");

    const text: HTMLParagraphElement = this.renderer.createElement('p');
    text.innerHTML = "PENDING";

    this.renderer.appendChild(this.h1Div.nativeElement, p);
    this.renderer.appendChild(p, text);

    this.clientService.getServerSentEvent()
      .subscribe(
        event => {
          if (event !== "ERROR") {
            p.setAttribute("class", "h1 col-lg-1 cell-good");
            text.innerHTML = event;
          } else {
            p.setAttribute("class", "col-lg-1 cell-bad");
            text.innerHTML = event;
          }
        }
      )
  }

  addHttp2() {
    console.log("Clicked HTTP 2");
    const p: HTMLDivElement = this.renderer.createElement("div")
    p.setAttribute("class", "col-lg-1 cell-off");

    const text: HTMLParagraphElement = this.renderer.createElement('p');
    text.innerHTML = "PENDING";

    this.renderer.appendChild(this.h2Div.nativeElement, p);
    this.renderer.appendChild(p, text);

    this.clientService.getHttp2ServerSentEvent()
      .subscribe(
        event => {
          if (event !== "ERROR") {
            p.setAttribute("class", "h2 col-lg-1 cell-good");
            text.innerHTML = event;
          } else {
            p.setAttribute("class", "col-lg-1 cell-bad");
            text.innerHTML = event;
          }
        }
      )
  }
}


