import { CatalogsService } from './../../../../../services/catalogs/catalogs.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { AnalyzerProService } from 'src/app/services/apis/analyzer-pro/analyzer-pro.service';
import { Messages } from 'src/enum/messages.enum';
import { Routes } from 'src/enum/routes.enum';
import { Clients, Plan } from 'src/models/clientes.interface';
import { CalculatePackagePrice, PlanPackage, PlanPackagePriced } from 'src/models/package.model';

@Component({
  selector: 'app-create-subscription',
  templateUrl: './create-subscription.component.html',
  styleUrls: ['./create-subscription.component.scss'],
})
export class CreateSubscriptionComponent implements OnInit {
  clients: Clients[] = [];
  plans: Plan[] = [];
  selectedClient?: Clients;
  selectedPlan?: Plan;

  packagesByPlan: PlanPackage[] = [];
  packagesPriced: PlanPackagePriced[] = [];
  packagesDiscounts: (number | undefined)[] = [];

  subscriptionTypes: { id: number; name: string }[] = [];
  selectedSubscriptionTypeId?: number;
  subscriptionTimes: { name: string; months: number }[] = [];
  selectedSubscriptionTime?: { name: string; months: number };

  enableDiscountInput: boolean = false;
  subscriptionDiscount: number = 0;
  activationDate?: Date;
  endDate?: Date;

  constructor(
    private readonly router: Router,
    private readonly analyzerProService: AnalyzerProService,
    private readonly notificationService: NzNotificationService,
    private readonly spinnerService: NgxSpinnerService,
    private readonly catalogsService: CatalogsService
  ) {}

  ngOnInit() {
    this.getAllClientsList();
    this.getAllPlans();
    this.getSubscriptionType();
    this.getSubscriptionTime();
  }

  calculateEndDate() {
    if (!this.activationDate || !this.selectedSubscriptionTime) return;

    const fromDate = this.activationDate;
    const months = this.selectedSubscriptionTime.months;
    let endDate = new Date(fromDate);
    endDate.setMonth(fromDate.getMonth() + months);
    this.endDate = endDate;
  }

  getAllClientsList() {
    this.spinnerService.show();
    this.analyzerProService.getClientsList().subscribe({
      next: (response) => {
        this.spinnerService.hide();
        this.clients = response.data;
      },
      error: (error) => {
        this.spinnerService.hide();
        this.notificationService.error(
          Messages.SYSTEM_NOT_AVAILABLE,
          Messages.SYSTEM_NOT_AVAILABLE_MESSAGE
        );
      },
    });
  }

  getAllPlans() {
    this.spinnerService.show();
    this.analyzerProService.getAllPlans().subscribe({
      next: (response) => {
        this.spinnerService.hide();
        this.plans = response.data;
      },
      error: (error) => {
        this.spinnerService.hide();
        this.notificationService.error(
          Messages.SYSTEM_NOT_AVAILABLE,
          Messages.SYSTEM_NOT_AVAILABLE_MESSAGE
        );
      },
    });
  }

  getPackagesByPlan(planId: number) {
    this.spinnerService.show();
    this.analyzerProService.getPackagesByPlan(planId).subscribe({
      next: (response) => {
        this.spinnerService.hide();
        this.packagesByPlan = response.data;
        this.packagesPriced = this.packagesByPlan.map((packageByPlan) => ({
          package_id: packageByPlan.package_id,
          n_bought_queries: undefined,
          final_total_price: undefined,
        }));
        this.packagesDiscounts = new Array<undefined>(this.packagesByPlan.length);
      },
      error: (error) => {
        this.spinnerService.hide();
        this.notificationService.error(
          Messages.SYSTEM_NOT_AVAILABLE,
          Messages.SYSTEM_NOT_AVAILABLE_MESSAGE
        );
      },
    });
  }

  createPlan(priceData: any) {
    this.spinnerService.show();
    let packagesData = this.packagesPriced.map((pkg) => ({
      package_id: pkg.package_id,
      n_bought_queries: pkg.n_bought_queries,
      final_total_price: pkg.final_total_price,
    }));
    for (let i = 0; i < packagesData.length; i++) {
      const packageDiscount = 1 - (this.packagesDiscounts[i] ?? 0) / 100;
      const subscriptionDiscount = 1 - (this.subscriptionDiscount ?? 0) / 100;

      let totalPrice = packagesData[i].final_total_price;
      if (totalPrice) totalPrice *= packageDiscount * subscriptionDiscount;
      else totalPrice = 0;

      packagesData[i].final_total_price = totalPrice;
    }

    const payload = {
      client_id: this.selectedClient!,
      plan_id: this.selectedPlan!,
      activation_date: this.activationDate!.toLocaleString('sv').split(' ')[0],
      expiration_date: this.endDate!.toLocaleString('sv').split(' ')[0],
      subscription_type: this.selectedSubscriptionTypeId!,
      packages_data: packagesData,
    };

    this.analyzerProService.createSubscription(payload).subscribe({
      next: (response) => {
        this.spinnerService.hide();
        this.notificationService.success(
          Messages.CREATION_SUCCESS,
          Messages.CREATION_SUCCESS_MESSAGE
        );
        this.router.navigate([Routes.DASHBOARD]);
      },
      error: (error) => {
        this.spinnerService.hide();
        this.notificationService.error(
          Messages.SYSTEM_NOT_AVAILABLE,
          Messages.SYSTEM_NOT_AVAILABLE_MESSAGE
        );
      },
    });
  }

  onSelectPlan(plan: Plan) {
    this.getPackagesByPlan(plan.plan_id);
  }

  getSubscriptionType() {
    this.spinnerService.show();
    this.catalogsService.getSubscriptionType().subscribe({
      next: (response) => {
        this.spinnerService.hide();
        this.subscriptionTypes = response.data;
      },
      error: (error) => {
        this.spinnerService.hide();
        this.notificationService.error(
          Messages.SYSTEM_NOT_AVAILABLE,
          Messages.SYSTEM_NOT_AVAILABLE_MESSAGE
        );
      },
    });
  }
  getSubscriptionTime() {
    this.spinnerService.show();
    this.catalogsService.getsubscriptionTime().subscribe({
      next: (response) => {
        this.spinnerService.hide();
        this.subscriptionTimes = response.data;
      },
      error: (error) => {
        this.spinnerService.hide();
        this.notificationService.error(
          Messages.SYSTEM_NOT_AVAILABLE,
          Messages.SYSTEM_NOT_AVAILABLE_MESSAGE
        );
      },
    });
  }

  calculatePricePackages() {
    this.spinnerService.show();
    const payload: CalculatePackagePrice[] = this.packagesPriced.map((packagePriced) => ({
      package_id: packagePriced.package_id,
      number_queries: packagePriced.n_bought_queries ?? 0,
    }));
    this.analyzerProService.calculatePricePackages(payload).subscribe({
      next: (response) => {
        this.spinnerService.hide();
        const prices = <any[]>response.data;
        for (let packagePriced of this.packagesPriced) {
          packagePriced.final_total_price = prices.find(
            (item) => item.package_id === packagePriced.package_id
          )?.total_price;
        }
      },
      error: (error) => {
        this.spinnerService.hide();
        this.notificationService.error(
          Messages.SYSTEM_NOT_AVAILABLE,
          Messages.SYSTEM_NOT_AVAILABLE_MESSAGE
        );
      },
    });
  }

  getPartialPackagePrice(index: number) {
    const packagePriced = this.packagesPriced[index];
    const totalValue = packagePriced.final_total_price;
    const n = packagePriced.n_bought_queries;
    return totalValue && n ? totalValue / n : undefined;
  }

  getTotalPackagePrice(index: number) {}

  getPriceData() {
    let subtotal = 0;
    let discounts = 0;
    for (let i = 0; i < this.packagesPriced.length; i++) {
      subtotal += this.packagesPriced[i].final_total_price ?? 0;

      discounts +=
        ((this.packagesPriced[i].final_total_price ?? 0) * (this.packagesDiscounts[i] ?? 0)) /
          100 ?? 0;
    }
    discounts += (subtotal - discounts) * (this.subscriptionDiscount / 100);

    return { subtotal, discounts, total: subtotal - discounts };
  }
}
