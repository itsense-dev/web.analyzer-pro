import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Cities,
  Countries,
  Idtypes,
  NewClient,
  Person,
  ResponseGlobal,
  States,
} from 'src/models/clientes.interface';
import { Routes } from 'src/enum/routes.enum';
import { AllowImagesTypes } from 'src/enum/images.enum';
import { Messages } from 'src/enum/messages.enum';
import { AnalyzerProService } from 'src/app/services/apis/analyzer-pro/analyzer-pro.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss'],
})
export class CreateClientComponent implements OnInit {
  loading = false;
  avatarUrl?: string;
  idShow?: string;
  client?: NewClient;
  validateForm: FormGroup;
  clientsList: Person[] = [];
  countryList: Countries[] = [];
  idTypesList: Idtypes[] = [];
  statesList: States[] = [];
  citiesList: Cities[] = [];
  selectedValue = null;
  selectedValue2 = null;
  editForm: boolean = false;
  base64DefaultURL: string = '';
  isClose: boolean = false;

  filename?: string;
  fileContent?: string;

  constructor(
    private analyzerProService: AnalyzerProService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private readonly notificationService: NzNotificationService,
    private modalService: NzModalService,
    private translocoService: TranslocoService
  ) {
    this.validateForm = this.fb.group({
      country_id: [null, [Validators.required]],
      identification_type: [null, [Validators.required]],
      document_number: [null, [Validators.required]],
      name: [null, [Validators.required]],
      state_id: [null, [Validators.required]],
      city_id: [null, [Validators.required]],
      zip_code: [null, [Validators.required]],
      address: [null, [Validators.required]],
      contact_phone_number: [null, [Validators.required]],
      contact_email: [null, [Validators.email, Validators.required]],
      website_url: [null],
      business_type: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });
  }

  async ngOnInit() {
    this.getAllCountries();
    await this.route.queryParams.subscribe((params) => {
      this.idShow = params['id'];
    });
    this.getReportById();
  }
  getReportById() {
    if (!this.idShow) return;
    this.analyzerProService.getClientById(Number(this.idShow)).subscribe({
      next: (response) => {
        this.client = response.data;
        this.avatarUrl = this.client.logo;
        this.updateForm();
      },
    });
  }

  async updateForm() {
    if (!this.client) return;
    await this.validateForm.patchValue(this.client);
    this.getAllIdType();
  }

  resetForm() {
    this.isClose = true;
    this.validateForm.reset();
    this.router.navigateByUrl(Routes.CLIENTS);
  }

  getAllCountries() {
    this.analyzerProService.getCountries().subscribe({
      next: (response: any) => {
        this.countryList = response.data;
      },
    });
  }
  getAllIdType() {
    if (this.isClose) return;
    const countrySelected = this.validateForm.controls['country_id'].value || '';
    this.getAllDepartmentsByCountry();
    this.analyzerProService.getIdTypes(countrySelected).subscribe({
      next: (response: ResponseGlobal<Idtypes[]>) => {
        if (response) {
          this.idTypesList = response.data;
          if (this.idTypesList.length === 0) {
            this.validateForm.controls['identification_type'].setValue('');
            this.validateForm.controls['state_id'].setValue('');
          }
        }
      },
      error: (error) => {},
      complete: () => {},
    });
  }
  getAllDepartmentsByCountry() {
    const countrySelected = this.validateForm.controls['country_id'].value || '';
    this.analyzerProService.getDepartmentsByCountry(countrySelected).subscribe({
      next: (response: any) => {
        this.statesList = response?.data;
        if (this.idShow) {
          this.getAllCities();
        }
      },
    });
  }
  getAllCities() {
    if (this.isClose) return;
    this.validateForm.controls['city_id'].setValue('');
    this.validateForm.controls['zip_code'].setValue('');
    const stateSelected = this.validateForm.value.state_id;
    this.analyzerProService.getCityByDepartment(stateSelected).subscribe({
      next: (response: any) => {
        this.citiesList = response.data;
        if (this.idShow) {
          this.validateForm.controls['city_id'].setValue(this.client?.city_id);
        }
      },
      error: (error) => {},
      complete: () => {},
    });
  }
  setZipCodeValue(state: any) {
    if (this.isClose) return;
    const zipCode = this.citiesList.find((item) => item.city_id === state);
    this.validateForm.controls['zip_code'].setValue(zipCode?.cod_dane);
  }

  saveChanges() {
    if (this.idShow) {
      this.updateClient();
    } else {
      this.createClient();
    }
  }

  createClient() {
    const payload: NewClient = this.validateForm.value;
    //payload.logo = this.fileContent;
    payload.logo = 'data:image/png;base64,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';
    this.analyzerProService.setNewClient(payload).subscribe({
      next: (response: any) => {},
      error: (error) => {},
      complete: () => {
        this.modalService.success({
          nzTitle: Messages.CREATION_SUCCESS,
          nzContent: Messages.CREATION_SUCCESS_MESSAGE,
        });
        this.router.navigateByUrl(Routes.CLIENTS);
      },
    });
  }

  updateClient() {
    const payloadUpdate: NewClient = this.validateForm.value;
    payloadUpdate.logo = this.avatarUrl;
    payloadUpdate.active_record = '1';
    this.analyzerProService.updateClient(Number(this.idShow), payloadUpdate).subscribe({
      next: (response: ResponseGlobal<string>) => {},
      complete: () => {
        this.modalService.success({
          nzTitle: Messages.UPDATE_SUCCESS,
          nzContent: Messages.UPDATE_SUCCESS_MESSAGE,
        });
        this.router.navigateByUrl(Routes.CLIENTS);
      },
    });
  }

  containsAnyValue(str: string, values: string[]): boolean {
    return values.some((value) => str.includes(value));
  }

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = this.containsAnyValue(
        file.type!.toLowerCase(),
        AllowImagesTypes.map((val) => val.toLowerCase())
      );
      if (!isJpgOrPng) {
        observer.complete();
        this.notificationService.error(
          Messages.FORMAT_NOT_VALID,
          Messages.FORMAT_NOT_VALID_MESSAGE
        );
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        observer.complete();
        this.notificationService.error(Messages.SIZE_NOT_VALID, Messages.SIZE_NOT_VALID_MESSAGE);
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

  @ViewChild('fileInput') fileInput?: ElementRef;
  attachFile() {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  loadFile(event: any) {
    const target = <HTMLInputElement>event.target;
    const files = <FileList>target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      this.filename = selectedFile.name;

      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        const content = <string>fileReader.result;
      };
      fileReader.readAsDataURL(selectedFile);
    }
  }

  utf8ToBase64(str: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const base64 = btoa(String.fromCharCode(...data));
    return base64;
  }
}