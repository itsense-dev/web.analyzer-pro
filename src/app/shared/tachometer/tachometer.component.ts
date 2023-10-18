import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tachometer',
  templateUrl: './tachometer.component.html',
  styleUrls: ['./tachometer.component.scss'],
})
export class TachometerComponent implements OnInit {
  tachometroImageName: string = 'tachometer-0.svg';
  animationCounter: number = 0;
  animationTotal: number = 0;

  @Input() plan: string = '';
  @Input() queriesAvailable: number = 0;
  @Input() queriesAssigned: number = 0;
  @Input() active: boolean = false;

  constructor() {}

  ngOnInit(): void {
    let tens =
      this.queriesAssigned > 0
        ? Math.round((this.queriesAvailable / this.queriesAssigned) * 10) * 10
        : 0;

    this.animationTotal = tens;
    const animationTimer = setInterval(() => {
      if (this.animationCounter < this.animationTotal) {
        this.animationCounter += 10;
        this.tachometroImageName = `tachometer-${this.animationCounter}.svg`;
      } else {
        clearInterval(animationTimer);
      }
    }, 100);
  }
}
