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
    payload.logo = this.fileContent;
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
