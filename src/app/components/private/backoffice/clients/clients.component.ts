import { Component, OnInit } from '@angular/core';
import { AnalyzerProService } from '../../../../services/apis/analyzer-pro/analyzer-pro.service';
import { Router } from '@angular/router';
import { Clients, NewClient, Plan } from 'src/models/clientes.interface';
import { Routes } from 'src/enum/routes.enum';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnInit {
  filter: string = '';
  clientsList: Clients[] = [];
  plansList: Plan[] = [];
  isVisible = false;

  constructor(private analyzerProService: AnalyzerProService, private router: Router) {}
  ngOnInit() {
    this.getAllClientsList();
  }

  showModal(client_id: number): void {
    this.getPlansByClient(client_id);
    this.isVisible = true;
  }

  closeModal(): void {
    this.isVisible = false;
    this.ngOnInit();
  }

  getAllClientsList() {
    this.analyzerProService.getClientsList().subscribe({
      next: (response: any) => {
        if (response) {
          this.clientsList = response.data;
        }
      },
      error: (error) => {},
      complete: () => {},
    });
  }
  getPlansByClient(client_id: number) {
    this.analyzerProService.getPlansByClient(client_id).subscribe({
      next: (response: any) => {
        if (response) {
          this.plansList = response.data;
        }
      },
      error: (error) => {},
      complete: () => {},
    });
  }

  changeClientState(client: Clients) {
    this.analyzerProService
      .setClientState(client.client_id, client.active_record == '1' ? '0' : '1')
      .subscribe({
        next: (response: any) => {
          if (response) {
            this.clientsList = response.data;
          }
        },
        error: (error) => {},
        complete: () => {
          this.ngOnInit();
        },
      });
  }
  createClient() {
    this.router.navigateByUrl(Routes.CREATE_CLIENT);
  }
  redirectView(id: number) {
    this.router.navigateByUrl(Routes.CREATE_CLIENT + '?id=' + id);
  }

  deleteClientById(clientId: number) {
    this.analyzerProService.deleteClientById(clientId).subscribe({
      next: (response: any) => {},
      error: (error) => {},
      complete: () => {
        this.ngOnInit();
      },
    });
  }
}
