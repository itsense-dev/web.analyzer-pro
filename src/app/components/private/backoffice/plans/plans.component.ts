import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { AnalyzerProService } from 'src/app/services/apis/analyzer-pro/analyzer-pro.service';
import { Messages } from 'src/enum/messages.enum';
import { NewPlan, Packages, ResponseGlobal, ResponseGlobal2 } from 'src/models/clientes.interface';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
})
export class PlansComponent implements OnInit {
  planForm: FormGroup;
  packageList: Packages[] = [];
  selectedRows: Packages[] = [];
  selectedIds: number[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private AnalyzerProService: AnalyzerProService,
    private spinnerService: NgxSpinnerService,
    private notificationService: NzNotificationService
  ) {
    this.planForm = this.fb.group({
      planName: ['', [Validators.required]],
      planDescription: ['', [Validators.required]],
      userCount: ['', [Validators.required]],
      products: [[], [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getProductsList();
  }

  getProductsList() {
    this.spinnerService.show();
    this.AnalyzerProService.getPackages().subscribe({
      next: (response: ResponseGlobal<Packages[]>) => {
        this.packageList = response.data;
      },
      error: (error) => {
        this.spinnerService.hide();
      },
      complete: () => {
        this.spinnerService.hide();
      },
    });
  }

  savePlan() {
    if (this.planForm.invalid || this.selectedIds.length < 1)
      this.notificationService.error(Messages.INPUT_REQUIRED, Messages.INPUT_REQUIRED_MESSAGE);

    const payload: NewPlan = {
      name: this.planForm.controls['planName'].value || '',
      description: this.planForm.controls['planDescription'].value || '',
      user_numer: this.planForm.controls['userCount'].value || '',
      products: this.selectedIds,
    };

    this.spinnerService.show();
    this.AnalyzerProService.createPlan(payload).subscribe({
      next: (response: ResponseGlobal2<string>) => {
        if (response.code != 200) {
          this.notificationService.error(
            Messages.SYSTEM_NOT_AVAILABLE,
            Messages.SYSTEM_NOT_AVAILABLE_MESSAGE
          );
        }
        this.notificationService.success(
          Messages.CREATION_SUCCESS,
          Messages.CREATION_SUCCESS_MESSAGE
        );
      },
      error: (error) => {
        this.spinnerService.hide();
        this.resetComponent();
        this.notificationService.error(
          Messages.SYSTEM_NOT_AVAILABLE,
          Messages.SYSTEM_NOT_AVAILABLE_MESSAGE
        );
      },
      complete: () => {
        this.spinnerService.hide();
        this.resetComponent();
      },
    });
  }

  onModelChange(packageIds: Packages[]) {
    this.selectedRows = packageIds;
    this.selectedIds = this.selectedRows.map((row) => row.package_id);
  }

  resetComponent() {
    this.planForm.get('planName')?.reset();
    this.planForm.get('planDescription')?.reset();
    this.planForm.get('userCount')?.reset();
    this.planForm.get('products')?.setValue([]);
    this.selectedRows = [];
    this.selectedIds = [];
  }
}
