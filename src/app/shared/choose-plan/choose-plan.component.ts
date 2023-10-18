import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AdminService } from 'src/app/services/apis/admin/admin.service';
import { ListResponse } from 'src/enum/list-response.enum';
import { Plan } from 'src/models/plan.model';
import { CryptsService } from 'src/services/utils/crypts.service';

@Component({
  selector: 'app-choose-plan',
  templateUrl: './choose-plan.component.html',
  styleUrls: ['./choose-plan.component.scss'],
})
export class ChoosePlanComponent implements OnInit {
  tachometroImageName: string = 'tachometer-0.svg';
  animationCounter: number = 0;
  animationTotal: number = 0;
  enabledButton: boolean = false;

  @Input() plan?: string;
  @Input() queriesAvailable: number = 0;
  @Input() queriesAssigned: number = 0;
  @Input() expires?: Date;
  @Output() customClick: EventEmitter<MouseEvent> = new EventEmitter();

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

    const now = new Date();
    this.enabledButton =
      this.queriesAvailable > 0 && this.expires && new Date(this.expires) > now ? true : false;
  }

  buttonClickEvent(event: MouseEvent) {
    this.customClick.emit(event);
  }
}
