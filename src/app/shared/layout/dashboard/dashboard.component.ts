import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { filter } from 'rxjs';
import { SessionService } from 'src/app/services/session/session.service';
import { ListResponse } from 'src/enum/list-response.enum';
import { Routes } from 'src/enum/routes.enum';
import { Titles } from 'src/enum/titles.enum';
import { environment } from 'src/environments/environment';
import { Menus } from 'src/models/menus.interface';
import { ResponseApiAnalyzer } from 'src/models/response-api-analyzer.interface';
import { SafetyMesh } from 'src/models/safety-mesh.model';
import { CryptsService } from 'src/services/utils/crypts.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isCollapsed = false;
  titlesEnum: any = Titles;
  country = environment.country.code;
  title? = '';
  name = '';
  session?: ResponseApiAnalyzer;
  menus: Menus[] = [];
  screenWidth: number = 0;
  rolId: number = -1;
  constructor(
    private router: Router,
    private sessionService: SessionService,
    private transloco: TranslocoService,
    private crypt: CryptsService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const currentRoute = event.url.split('/');
        const titleSlug = currentRoute[currentRoute.length - 1];
        const title = titleSlug.replace('-', '_').toUpperCase();
        this.title = this.titlesEnum[title];
      });
  }

  async ngOnInit() {
    this.menu();
    this.screenWidth = await window.innerWidth;
    this.onResize(this.screenWidth);
    this.getSession();
  }

  menu() {
    const decriptSession = this.crypt.decryptData(ListResponse.USER);
    this.rolId = decriptSession?.user_info?.rol_id;
    const menu: SafetyMesh[] = decriptSession.safety_mesh;

    for (const iterator of menu) {
      this.menus.push({
        title: iterator.module_name,
        icon: iterator.icon,
        url: iterator.url,
        children: [],
        active: iterator.has_view,
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: number) {
    this.screenWidth = window.innerWidth;
    this.isSmallMenu();
  }

  isSmallMenu() {
    if (this.screenWidth < 992) {
      this.isCollapsed = true;
    } else {
      this.isCollapsed = false;
    }
  }

  getSession() {
    this.session = this.sessionService.getSession();
    const splitSession = this.session?.user_info.user_name.split(' ');
    if (splitSession) {
      this.name = `${splitSession[0].substring(0, 1).toUpperCase()}${splitSession[1]
        .substring(0, 1)
        .toUpperCase()}`;
    }
  }
  logout() {
    this.sessionService.logout();
  }

  goToHome() {
    this.router.navigateByUrl(Routes.DASHBOARD);
  }
}
