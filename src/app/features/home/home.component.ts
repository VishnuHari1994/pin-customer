import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ADD_CUSTOMER_MODAL_TITLE } from '../../shared/constants/customer-constants';
import { PIN_MODAL_DETAIL } from '../../shared/constants/pin-constants';
import { AddCustomerComponent } from '../../shared/components/add-customer/add-customer.component';
import { AddPinComponent } from '../../shared/components/add-pin/add-pin.component';
import { PinService } from '../../services/pin.service';
import {
  COLLABORATORY,
  HOME_PAGE_TABLE_DETAIL,
  PRIVACY,
} from '../../shared/constants/home-constants';
import { AppService } from '../../app.service';
import {
  RegionAndCountryModel,
  RegionListModel,
} from '../../shared/models/country.model';
import { AddPinModalModel, PinListModel } from '../../shared/models/pin.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private modalService = inject(NgbModal);
  private destroyed$ = new Subject();
  title: string = ADD_CUSTOMER_MODAL_TITLE;
  addPinModalDetails: AddPinModalModel = PIN_MODAL_DETAIL;

  tableDetails = HOME_PAGE_TABLE_DETAIL;
  privacy: string = PRIVACY;
  collaboratory: string = COLLABORATORY;

  regionAndCountry: RegionAndCountryModel = {};

  pinList: PinListModel[] = [];
  constructor(
    private pinService: PinService,
    private appService: AppService,
  ) {}

 /**
 * Initializes the component by fetching the list of pins and the list of regions and countries.
 */
ngOnInit(): void {
  this.getPinList();
  this.getListOfRegionAndCountry();
}

/**
* Fetches the list of regions and countries from the server.
* Populates the regionAndCountry property with the fetched data.
*/
getListOfRegionAndCountry() {
  this.appService
    .getRegionList()
    .pipe(takeUntil(this.destroyed$))
    .subscribe((res: RegionListModel) => {
      if (res && res.status) {
        this.regionAndCountry = res.data;
      }
    });
}

/**
* Fetches the list of pins and subscribes to pin updates.
* Populates the pinList property with the fetched pin details.
*/
getPinList() {
  this.pinService.pinObserbable.next(this.pinService.getPinDetails());
  this.pinService.pinObserbable
    .pipe(takeUntil(this.destroyed$))
    .subscribe(res => {
      this.pinList = res;
    });
}

/**
* Opens a modal dialog for adding a customer or pin.
* @param type The type of modal to open ('CUSTOMER' or 'PIN').
*/
openModal(type: string) {
  switch (type) {
    case 'CUSTOMER':
      let modalRef = this.modalService.open(AddCustomerComponent, {
        centered: true,
      });
      modalRef.componentInstance.regionAndCountry = this.regionAndCountry;
      break;
    case 'PIN':
      this.modalService.open(AddPinComponent, { centered: true });
      break;
    default:
      return;
  }
}

/**
* Opens a modal dialog for editing a pin.
* @param type The type of modal to open (should be 'PIN' for this method).
* @param id The ID of the pin to edit.
*/
openeditModal(type: string, id: string) {
  let modalRef = this.modalService.open(AddPinComponent, { centered: true });
  modalRef.componentInstance.id = id;
}

/**
* Deletes a pin with the given ID.
* @param id The ID of the pin to delete.
*/
deletePin(id: string) {
  this.pinService.deletePinDetails(id);
}

/**
* Cleans up subscriptions to avoid memory leaks.
* Completes the destroyed$ subject.
*/
ngOnDestroy(): void {
  this.destroyed$.next(true);
  this.destroyed$.complete();
}

}
