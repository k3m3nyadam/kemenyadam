import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Alert, AlertType } from '@app/_models/alert';
import { AlertService } from '@app/_services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})

export class AlertComponent implements OnInit, OnDestroy{
  @Input() id = 'default-alert';
  @Input() fade = true;

  alerts: Alert[] = [];
  alertSubscription: Subscription; 
  routeSubscription: Subscription; 

  constructor (private router: Router, private alertservice: AlertService){}

  ngOnInit(): void {
    this.alertSubscription = this.alertservice.onAlert(this.id)
      .subscribe(alert =>{
        if(!alert.message){
          this.alerts = this.alerts.filter(x => x.keepAfterRootChange);
          this.alerts.forEach(x => delete x.keepAfterRootChange);

          return;
        }

        this.alerts.push(alert);

        if(alert.autoClose){
          setTimeout(() => this.removeAlert(alert), 3000);
        }
      });

      this.routeSubscription = this.router.events.subscribe(event => {
        if(event instanceof NavigationStart){
          this.alertservice.clear(this.id);
        }
      });
  }

  ngOnDestroy(): void {
    this.alertSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  removeAlert(alert: Alert){
    if(!this.alerts.includes(alert)) return;

    if(this.fade){
      alert.fade = true;

      setTimeout(() =>{
        this.alerts = this.alerts.filter(x => x !== alert)
      }, 250);
    }else{
      this.alerts = this.alerts.filter(x => x !== alert);
    }
  }

  cssClass(alert: Alert){
    if(!alert) return "";

    const alertClass = ['alert', 'alert-dismissible', 'mt-4', 'container'];
    const alertClassType = {
      [AlertType.Succes]: 'alert-succes',
      [AlertType.Info]: 'alert-info',
      [AlertType.Warning]: 'alert-warning',
      [AlertType.Error]: 'alert-danger'
    }

    if(alert.type !== undefined){
      alertClass.push(alertClassType[alert.type]);
    }

    if(alert.fade){alertClass.push('fade');}
    return alertClass.join(' ');
  }
}
