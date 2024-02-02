import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { AnalyzerProService } from 'src/app/services/apis/analyzer-pro/analyzer-pro.service';
import { ListResponse } from 'src/enum/list-response.enum';
import { Messages } from 'src/enum/messages.enum';
import { Routes } from 'src/enum/routes.enum';
import { CountryProducts, NewPlan, Packages, ResponseGlobal } from 'src/models/clientes.interface';
import { PackageRecord } from 'src/models/package.model';
import { CryptsService } from 'src/services/utils/crypts.service';

@Component({
  selector: 'app-create-plan',
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.scss'],
})
export class CreatePlanComponent implements OnInit {
  packages: PackageRecord[] = [];
  //countries: { country_name: string; country_id: string }[] = [];
  //selectedCountryId?: string;
  selectedPackageIds: number[] = [];
  selectedPackages: PackageRecord[] = [];

  planName?: string;
  planDescription?: string;

  constructor(
    private readonly router: Router,
    private readonly cryptsService: CryptsService,
    private readonly analyzerProService: AnalyzerProService,
    private readonly spinnerService: NgxSpinnerService,
    private readonly notificationService: NzNotificationService
  ) {}

  ngOnInit(): void {
    //this.getCountries();
    this.getPackages();
  }

  /*
  getCountries() {
    let user = this.cryptsService.decryptData(ListResponse.USER);
    this.countries = user?.countries;

    this.getPackages();
  }
  */

  onPackagesSelected(event: any) {
    this.selectedPackages = this.packages.filter((packageItem) =>
      this.selectedPackageIds.includes(packageItem.id)
    );
  }

  removeSelectedPackage(packageId: number) {
    this.selectedPackageIds = this.selectedPackageIds.filter(
      (selectedPackageId) => selectedPackageId !== packageId
    );
    this.onPackagesSelected(this.selectedPackageIds);
  }

  getPackages() {
    this.spinnerService.show();
    this.analyzerProService.getPackages().subscribe({
      next: (response) => {
        this.packages = <Array<PackageRecord>>(<any>response.data);
      },
      error: (error) => {
        this.spinnerService.hide();
        this.notificationService.error(
          Messages.SYSTEM_NOT_AVAILABLE,
          Messages.SYSTEM_NOT_AVAILABLE_MESSAGE
        );
      },
      complete: () => {
        this.spinnerService.hide();
      },
    });
  }

  onCreatePlanClick() {
    if (this.planName == undefined || this.planDescription == undefined) return;

    this.spinnerService.show();
    const payload: NewPlan = {
      name: this.planName,
      description: this.planDescription,
      user_numer: 10,
      products: this.selectedPackageIds,
    };
    this.analyzerProService.createPlan(payload).subscribe({
      next: () => {
        this.spinnerService.hide();
        this.notificationService.success(
          Messages.CREATION_SUCCESS,
          Messages.CREATION_SUCCESS_MESSAGE
        );
        this.router.navigate([Routes.DASHBOARD]);
      },
      error: () => {
        this.spinnerService.hide();
        this.notificationService.error(
          Messages.SYSTEM_NOT_AVAILABLE,
          Messages.SYSTEM_NOT_AVAILABLE_MESSAGE
        );
      },
    });
  }
}
