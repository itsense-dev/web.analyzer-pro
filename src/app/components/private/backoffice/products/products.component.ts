import { ɵNullViewportScroller } from '@angular/common';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { AnalyzerProService } from 'src/app/services/apis/analyzer-pro/analyzer-pro.service';
import { Messages } from 'src/enum/messages.enum';
import { Routes } from 'src/enum/routes.enum';
import {
  Clients,
  CountryProducts,
  Item,
  NewProduct,
  PackageRange,
  Person,
  PersonType,
  ResponseGlobal,
  ResponseGlobal2,
} from 'src/models/clientes.interface';
import { Countries } from 'src/models/response-api-analyzer.interface';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  checkboxIndividual: boolean = false;
  checkboxMassive: boolean = false;
  productListId: CountryProducts[] = [];
  personTypeList: PersonType[] = [];
  editRangeId: number = -1;
  filename?: string;
  fileContent?: string;
  selectedRows: CountryProducts[] = [];
  selectedIds: number[] = [];
  validateForm: FormGroup;
  rangeForm: FormGroup;
  countryList: Countries[] = [];
  countryId: string = '';
  personTypeId: number = 0;
  countryName: string = '';
  setRange: PackageRange[] = [];
  initialFormValues: FormGroup;

  submitForm(): void {}

  resetForm(event: MouseEvent): void {
    event.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsPristine();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
    this.router.navigateByUrl(Routes.CLIENTS);
  }

  constructor(
    private AnalyzerProService: AnalyzerProService,
    private fb: FormBuilder,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    private notificationService: NzNotificationService
  ) {
    this.validateForm = this.fb.group({
      productName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      country: ['', [Validators.required]],
      personType: ['', [Validators.required]],
      productList: [[], [Validators.required]],
    });
    this.rangeForm = this.fb.group({
      minimumRange: ['', [Validators.required, Validators.min(0)]],
      maximumRange: ['', [Validators.required, Validators.min(0)]],
      price: ['', [Validators.required, Validators.min(0)]],
    });
    this.initialFormValues = this.validateForm;
  }
  ngOnInit() {
    this.getAllCountries();
  }

  getAllCountries() {
    this.spinnerService.show();
    this.AnalyzerProService.getCountriesWithProducts().subscribe({
      next: (response: ResponseGlobal<Countries[]>) => {
        this.countryList = response.data;
      },
      error: (error) => {
        this.spinnerService.hide();
      },
      complete: () => {
        this.spinnerService.hide();
      },
    });
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

  @ViewChild('fileInput') fileInput?: ElementRef;
  attachFile() {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  getProductsByCountry() {
    this.spinnerService.show();
    this.AnalyzerProService.getProductByCountry(this.countryId).subscribe({
      next: (response: ResponseGlobal<CountryProducts[]>) => {
        this.productListId = response.data;
      },
      error: (error) => {
        this.spinnerService.hide();
      },
      complete: () => {
        this.spinnerService.hide();
      },
    });
  }

  getPersonTypeByCountry() {
    this.AnalyzerProService.getPersonTypeByCountry(this.countryId).subscribe({
      next: (response: ResponseGlobal<PersonType[]>) => {
        this.personTypeList = response.data;
      },
    });
  }

  submitProduct() {
    if (this.validateForm.invalid)
      this.notificationService.error(Messages.INPUT_REQUIRED, Messages.INPUT_REQUIRED_MESSAGE);

    const payload: NewProduct = {
      name: this.validateForm.controls['productName'].value || '',
      description: this.validateForm.controls['description'].value || '',
      country_id: this.countryId,
      person_type: this.validateForm.controls['personType'].value || '',
      lists: this.selectedIds,
      ranges: this.setRange.length > 0 ? this.setRange : null,
      file: this.fileContent === undefined ? null : btoa(this.fileContent),
      is_load_massive: this.checkboxMassive,
    };

    this.spinnerService.show();
    this.AnalyzerProService.createProduct(payload).subscribe({
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
        this.rangeForm.reset();
        this.resetComponent();
      },
    });
  }

  checkboxIndividualChanged(checked: boolean): void {
    this.checkboxIndividual = checked;
    this.checkboxMassive = !checked;
    this.fileContent = undefined;
  }

  checkboxMassiveChanged(checked: boolean): void {
    this.checkboxIndividual = !checked;
    this.checkboxMassive = checked;
    this.setRange = [];
    this.rangeForm.get('minimumRange')?.setValue('');
    this.rangeForm.controls['minimumRange'].enable();
  }

  onModelChange(productIds: CountryProducts[]) {
    this.selectedRows = productIds;
    this.selectedIds = this.selectedRows.map((row) => row.product_id);
  }

  addRange() {
    if (!this.rangeForm.valid) return;

    const ranges: PackageRange = {
      min_range: Number(this.rangeForm.controls['minimumRange'].value),
      max_range: Number(this.rangeForm.controls['maximumRange'].value),
      price: Number(this.rangeForm.controls['price'].value),
    };

    this.setRange.push(ranges);
    this.rangeForm.reset();
    this.rangeForm.get('minimumRange')?.setValue(Number(ranges.max_range) + 1);
    if (this.setRange.length > 0) this.rangeForm.controls['minimumRange'].disable();
  }

  editRange(index: number) {
    this.editRangeId = index;
    this.rangeForm.get('minimumRange')?.setValue(Number(this.setRange[index].min_range));
    this.rangeForm.get('maximumRange')?.setValue(Number(this.setRange[index].max_range));
    this.rangeForm.get('price')?.setValue(Number(this.setRange[index].price));
  }

  deleteRange(index: number) {
    this.setRange.splice(index, 1);
    if (this.setRange.length == 0) {
      this.rangeForm.controls['minimumRange'].enable();
      this.rangeForm.get('minimumRange')?.setValue('');
    }
  }

  updateRange() {
    const ranges: PackageRange = {
      min_range: Number(this.rangeForm.controls['minimumRange'].value),
      max_range: Number(this.rangeForm.controls['maximumRange'].value),
      price: Number(this.rangeForm.controls['price'].value),
    };
    this.setRange[this.editRangeId] = ranges;
    this.rangeForm.reset();
    this.rangeForm
      .get('minimumRange')
      ?.setValue(Number(this.setRange[this.setRange.length - 1].max_range) + 1);
    if (this.setRange.length > 0) this.rangeForm.controls['minimumRange'].disable();
    this.editRangeId = -1;
  }

  validRange(): boolean {
    const minRange = this.rangeForm.controls['minimumRange'].value;
    const maxRange = this.rangeForm.controls['maximumRange'].value;
    return minRange !== null && maxRange !== null && maxRange > minRange;
  }

  onCountryModelChange() {
    this.countryId = this.validateForm.controls['country'].value.country_id || '';
    this.countryName = this.validateForm.controls['country'].value.country_name || '';
    if (this.countryId != '') {
      this.getProductsByCountry();
      this.getPersonTypeByCountry();
    }
  }

  onPersonTypeModelChange() {
    if (this.countryId != '')
      this.personTypeId = this.validateForm.controls['personType'].value || '';
  }

  resetComponent() {
    this.rangeForm.controls['minimumRange'].enable();
    this.setRange = [];
    this.validateForm.controls['productName'].reset();
    this.validateForm.controls['description'].reset();
    this.productListId = [];
    this.selectedRows = [];
    this.selectedIds = [];
    this.validateForm.get('country')?.setValue('');
    this.validateForm.get('personType')?.setValue('');
    this.validateForm.get('productList')?.setValue([]);
    this.checkboxIndividual = false;
    this.checkboxMassive = false;
  }
}
