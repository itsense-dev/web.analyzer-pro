import { environment } from './../../../../../environments/environment';
import { TranslocoService } from '@ngneat/transloco';
import { StatusCode } from './../../../../../enum/status-code.enum';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Event, Router } from '@angular/router';
import { ClientService } from 'src/app/services/apis/client/client.service';
import { ListResponse } from 'src/enum/list-response.enum';
import { TypeOfPerson } from 'src/enum/type-of-person.enum';
import { QueryLoadMassive } from 'src/models/load-massive.model';
import { Package } from 'src/models/package.model';
import { Plan } from 'src/models/plan.model';
import { CryptsService } from 'src/services/utils/crypts.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Messages } from 'src/enum/messages.enum';
import { Routes } from 'src/enum/routes.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { Mimetypes } from 'src/enum/mimetypes.enum';

@Component({
  selector: 'app-generate-massive-report',
  templateUrl: './generate-massive-report.component.html',
  styleUrls: ['./generate-massive-report.component.scss'],
})
export class GenerateMassiveReportComponent implements OnInit {
  TypeOfPerson = TypeOfPerson;

  selectedPersonType?: TypeOfPerson;
  packages: Package[] = [];
  packagesFiltered: Package[] = [];
  selectedPackages: { packageId: number; selected: boolean }[] = [];

  selectedPlan?: Plan;

  personTypes = [
    { text: 'naturalPerson', value: TypeOfPerson.NATURAL },
    { text: 'legalPerson', value: TypeOfPerson.LEGAL },
  ];

  filename?: string;
  fileContent?: string;
  countries?: any;

  loadMassiveTemplateFilename: string = environment.loadMassiveTemplateFilename;

  constructor(
    private readonly spinnerService: NgxSpinnerService,
    private readonly cryptsService: CryptsService,
    private readonly clientService: ClientService,
    private readonly notificationService: NzNotificationService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.getSelectedPlan();
    this.getCountry();

    if (this.selectedPlan) {
      this.getPackagesBySubscription(this.selectedPlan.subscription_id);
    }
  }

  getCountry() {
    let user = this.cryptsService.decryptData(ListResponse.USER);
    this.countries = user?.countries;
  }

  getSelectedPlan() {
    this.selectedPlan = this.cryptsService.decryptData(ListResponse.PLAN);
  }

  getPackagesBySubscription(subscriptionId: string) {
    this.clientService.getPackagesBySubscription(subscriptionId).subscribe({
      next: (response) => {
        this.packages = <Array<Package>>response.data;

        for (const packageItem of this.packages) {
          packageItem.checked = packageItem.checked ? true : false;
        }
      },
    });
  }

  selectPersonType(personType: number) {
    this.selectedPersonType = <TypeOfPerson>(<unknown>personType);
    this.packagesFiltered = this.packages.filter(
      (packageItem) =>
        this.selectedPersonType === packageItem.person_type ||
        packageItem.person_type === TypeOfPerson.HYBRID
    );
    this.selectedPackages = this.packagesFiltered.map((item) => ({
      packageId: item.package_id,
      selected: item.checked,
    }));
  }

  @ViewChild('fileInput') fileInput?: ElementRef;
  attachFile() {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  get checkSelectedPackages() {
    return this.selectedPackages.find((item) => item.selected) ? true : false;
  }

  loadFile(event: any) {
    const target = <HTMLInputElement>event.target;
    const files = <FileList>target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      this.filename = selectedFile.name;

      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        const content = event.target?.result;
        this.fileContent = <string>content;
      };
      fileReader.readAsText(selectedFile);
    }
  }

  makeDownloadable(content: string, filename: string) {
    const blob = new Blob([content], { type: Mimetypes.TEXT_PLAIN });
    const link = document.createElement('a');

    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);

    link.click();
  }

  downloadTemplate() {
    this.spinnerService.show();
    const countryId = this.getCurrentCountry()?.country_id;
    const personType = this.selectedPersonType;
    if (personType && countryId)
      this.clientService.getMassiveQueryTemplate(personType, countryId).subscribe({
        next: (response) => {
          this.spinnerService.hide();
          if (response.code == StatusCode.OK) {
            let filename = this.loadMassiveTemplateFilename;
            filename = filename.replace('{country}', countryId.toLowerCase());
            this.makeDownloadable(response.data, filename);
          } else {
            this.notificationService.error(
              Messages.SYSTEM_NOT_AVAILABLE,
              Messages.SYSTEM_NOT_AVAILABLE_MESSAGE
            );
          }
        },
        error: (error) => this.spinnerService.hide(),
      });
  }

  utf8ToBase64(str: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const base64 = btoa(String.fromCharCode(...data));
    return base64;
  }

  createQueryLoadMassive() {
    if (!this.fileContent) return;
    this.spinnerService.show();

    const selectedPackages = this.selectedPackages
      .filter((item) => item.selected)
      .map((item) => item.packageId);

    const fileBase64 = this.utf8ToBase64(this.fileContent);

    const payload: QueryLoadMassive = {
      license: '',
      file_name: this.filename!,
      country_code: this.getCurrentCountry(),
      packages: selectedPackages,
      file: fileBase64,
      connection_id: '',
    };
    this.clientService.createQueryLoadMassive(payload).subscribe({
      next: (response) => {
        if (response.code == StatusCode.OK) {
          this.notificationService.success(Messages.MASSIVE_QUERY, Messages.MASSIVE_QUERY_MESSAGE, {
            nzDuration: 10000,
          });
          this.router.navigate([Routes.MASSIVE_REPORT_DETAIL]);

          this.spinnerService.hide();
        } else {
          this.notificationService.error(
            Messages.SYSTEM_NOT_AVAILABLE,
            Messages.SYSTEM_NOT_AVAILABLE_MESSAGE
          );
        }
      },
    });
  }

  getCurrentCountry() {
    return this.countries.find((country: any) => country.country_id == 'CO');
  }
}
