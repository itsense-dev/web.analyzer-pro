import { CatalogsService } from './../../../../../services/catalogs/catalogs.service';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { AnalyzerProService } from 'src/app/services/apis/analyzer-pro/analyzer-pro.service';
import { Messages } from 'src/enum/messages.enum';
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
  subscriptionTimes: { name: string; month: number }[] = [];

  enableDiscountInput: boolean = false;
  subscriptionDiscount: number = 0;

  constructor(
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
    const discount = this.packagesDiscounts[index];
    const n = packagePriced.n_bought_queries;
    return totalValue && n ? ((1 - (discount ?? 0) / 100) * totalValue) / n : undefined;
  }

  getTotalPackagePrice(index: number) {
    const packageTotalPriced = this.packagesPriced[index].final_total_price;
    const discount = this.packagesDiscounts[index];
    return packageTotalPriced ? (1 - (discount ?? 0) / 100) * packageTotalPriced : undefined;
  }

  getSubtotalSubscription() {
    let accumulated = 0;
    for (let i = 0; i < this.packagesPriced.length; i++) {
      accumulated += this.getTotalPackagePrice(i) ?? 0;
    }
    return accumulated;
  }
}
