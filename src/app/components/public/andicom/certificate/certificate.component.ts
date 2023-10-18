import { Component, OnInit } from '@angular/core';
import { AndicomService } from 'src/app/services/andicom/andicom.service';
import { GenerateCertificateLinkedIn } from '../models/andicom.interface';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { CryptsService } from 'src/services/utils/crypts.service';
import { ListResponse } from 'src/enum/list-response.enum';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss'],
})
export class CertificateComponent implements OnInit {
  shareWithLinkedInUrl: string = 'https://www.linkedin.com/sharing/share-offsite/?url=';
  imageUrl: string = '';
  dataToGenerateCertificate?: any;
  constructor(
    private andicomService: AndicomService,
    private notification: NzNotificationService,
    private router: Router,
    private cryptsService: CryptsService
  ) {}

  ngOnInit() {
    this.dataToGenerateCertificate = this.cryptsService.decryptData(ListResponse.SHARE);
    if (!this.dataToGenerateCertificate) {
      this.router.navigateByUrl('/');
      return;
    }
    this.getCertificate(this.dataToGenerateCertificate?.name);
  }

  getCertificate(name: string) {
    const payload: GenerateCertificateLinkedIn = {
      name: name.toUpperCase(),
    };
    this.andicomService.getCertificate(payload).subscribe((response) => {
      if (response.statusCode === 200) {
        this.imageUrl = response?.body?.jpgLink;
      } else {
        this.notification.error(
          'Error generando certificado',
          'Lo sentimos no se pudo generar certificado'
        );
        setTimeout(() => {
          this.router.navigateByUrl('/');
        }, 2000);
      }
    });
  }

  shareWithLinkedIn() {
    window.open(`${this.shareWithLinkedInUrl}${this.imageUrl}`, '_blank');
  }
}
