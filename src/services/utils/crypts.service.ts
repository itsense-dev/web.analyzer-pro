import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CryptsService {
  constructor() {}

  cryptData(key: string, data: any) {
    const crypt = CryptoJS.AES.encrypt(JSON.stringify(data), environment.cryptToken).toString();
    sessionStorage.setItem(key, crypt);
  }

  decryptData(key: string) {
    const data = sessionStorage.getItem(key);
    if (!data) return;
    const decrypt = CryptoJS.AES.decrypt(data, environment.cryptToken).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypt);
  }

  clearListByKey(key: string) {
    sessionStorage.removeItem(key);
  }

  getString(key: string) {
    const data = sessionStorage.getItem(key);
    if (!data) return;
    return CryptoJS.AES.decrypt(data, environment.cryptToken).toString(CryptoJS.enc.Utf8);
  }

  decryptString(data: any) {
    if (!data) return;
    return CryptoJS.AES.decrypt(data, environment.cryptToken).toString(CryptoJS.enc.Utf8);
  }
}
