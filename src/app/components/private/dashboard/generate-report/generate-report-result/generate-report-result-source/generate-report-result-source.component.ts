import { Component, Input, OnInit } from '@angular/core';
import { TranformTextService } from 'src/app/services/tranform-text.service';
import { StatusCode } from 'src/enum/status-code.enum';
import { TypeLists } from 'src/enum/type-lists.enum';
import { ImageRendering } from 'src/models/imageRending.model';

@Component({
  selector: 'app-generate-report-result-source',
  templateUrl: './generate-report-result-source.component.html',
  styleUrls: ['./generate-report-result-source.component.scss'],
})
export class GenerateReportResultSourceComponent implements OnInit {
  @Input() source?: any;
  @Input() url?: string;
  typeList = TypeLists;
  statusCode = StatusCode;
  isStringArray: boolean = false;
  secondLevel?: any = [];
  constructor(public tranformText: TranformTextService) {}

  tempSecondLevel: any = [];
  renderImages?: ImageRendering[];
  ngOnInit(): void {
    if (Object.entries(this.source).length > 0) {
      try {
        this.source.message = this.getDataObject(this.source.message);
        let temp = [];
        for (const element of Object.values(this.source.message)) {
          if (
            Array.isArray(element) &&
            Array.isArray(element[1]) &&
            typeof element[1][0] === 'object' &&
            element[0] !== this.typeList.PDF &&
            element[0] !== this.typeList.IMAGE
          ) {
            // Es un array , es un array data , es un array de objetos
            let arrayTemp = this.getDataObject(element[1][0]);
            temp.push([element[0], arrayTemp]);
          } else {
            temp.push(element);
            const key: any = element;
            if (key[0] === this.typeList.IMAGE) {
              const url: any[] = key;
              const filterByUrlImage = url.filter((item) => item !== this.typeList.IMAGE);
              this.renderImages = filterByUrlImage[0];
            }
          }
        }
        this.source.message = temp;
      } catch (error) {
        this.source.message = '';
      }
    }

    if (this.secondLevel) {
      let temp = [];
      for (const key in this.secondLevel) {
        if (Object.prototype.hasOwnProperty.call(this.secondLevel, key)) {
          for (const subObj in this.secondLevel[key]) {
            temp.push(this.getDataObject(this.secondLevel[key][subObj]));
          }
          this.tempSecondLevel.push(temp);
        }
      }
    }
  }

  getDataObject(message: any): any[] {
    if (!message) return [];
    if (typeof message === 'string') {
      message = JSON.parse(message);
    }
    return Object.entries(message);
  }

  validateArray(message: any): boolean {
    if (!Array.isArray(message) || message.length === 0) {
      return false;
    }
    const uniqueTypes = new Set(message.map((element) => typeof element));
    if (uniqueTypes.size === 1 && uniqueTypes.has('string')) {
      return true;
    }
    return false;
  }

  analyzeArray(input: any): number {
    if (!Array.isArray(input)) {
      return 0; //'El valor proporcionado no es un array.';
    }
    if (input.length === 0) {
      return 0; //'El array está vacío.';
    }
    const firstElement = input[0];
    if (Array.isArray(firstElement)) {
      return 1; //'El array contiene arrays.';
    } else if (typeof firstElement === 'string') {
      return 2; //'El array contiene una lista de strings.';
    } else {
      return 0; //'El array no contiene objetos ni una lista de strings.';
    }
  }

  messageIsArray(message: any) {
    this.validateArray(message);
    return Array.isArray(message);
  }

  downloadPdf(base64String: string, fileName: string) {
    const source = `data:application/pdf;base64,${base64String}`;
    const link = document.createElement('a');
    link.href = source;
    link.download = `${fileName}.pdf`;
    link.click();
  }
  onClickDownloadPdf(pdf: any) {
    let base64String = pdf[0].b64bytes;
    this.downloadPdf(base64String, 'Report');
  }

  redirectPdfUrl(urlPdf: string) {
    window.open(urlPdf, '_blank');
  }

  getObjKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
