import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../../app.service';
import { NgxSelectModule } from 'ngx-select-ex';
import {
  ADD_CUSTOMER_FORM,
  ADD_CUSTOMER_BUTTON_TEXT,
  ADD_CUSTOMER_MODAL_TITLE,
} from '../../constants/customer-constants';
import { CustomerService } from '../../../services/customer.service';
import { Subject, takeUntil } from 'rxjs';
import {
  RegionAndCountryModel,
  RegionListModel,
} from '../../models/country.model';
import { AddCustomerDetailsModel } from '../../models/customer.model';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxSelectModule],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.scss',
})
export class AddCustomerComponent implements OnInit, OnDestroy {
  public modalService = inject(NgbModal);
  title: string = ADD_CUSTOMER_MODAL_TITLE;
  addCustomer = ADD_CUSTOMER_FORM;
  buttonText: string = ADD_CUSTOMER_BUTTON_TEXT;

  regionAndCountry: RegionAndCountryModel = {};
  regionsList: string[] = [];
  countryList: string[] = [];
  destroyed$ = new Subject();

  constructor(
    private addCustomerService: CustomerService,
    private appService: AppService
  ) {}

  /**
 * Initializes the component by fetching the list of regions and countries,
 * setting the country list, and populating the regions list.
 */
ngOnInit(): void {
  this.getListOfRegionAndCountry();
  this.setCountryList();
  this.setRegionFromList();
  this.setCountryList();
}

/**
* Form group for customer details with validators for each field.
*/
customerForm: FormGroup = new FormGroup({
  name: new FormControl('', Validators.required),
  email: new FormControl('', [Validators.required, Validators.email]),
  region: new FormControl('', Validators.required),
  country: new FormControl('', Validators.required),
});

/**
* Checks the validity of a form control.
* @param key The key of the form control to check.
* @returns True if the control is invalid and touched, otherwise false.
*/
checkValidaty(key: string): boolean {
  return (this.customerForm.get(key)?.invalid &&
    this.customerForm.get(key)?.touched)!;
}

/**
* Populates the regions list from the region and country data.
* Ensures no duplicate regions are added.
*/
setRegionFromList() {
  for (const key in this.regionAndCountry) {
    if (!this.regionsList.includes(this.regionAndCountry[key].region)) {
      this.regionsList.push(this.regionAndCountry[key].region);
    }
  }
}

/**
* Sets the country list based on the selected region.
* Updates the country list whenever the region value changes.
*/
setCountryList() {
  this.customerForm
    .get(this.addCustomer['region'].control)
    ?.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe((res: string) => {
      this.customerForm
        .get(this.addCustomer['country'].control)
        ?.setValue('');
      this.countryList = [];
      for (const key in this.regionAndCountry) {
        if (this.regionAndCountry[key].region === res) {
          this.countryList.push(this.regionAndCountry[key].country);
        }
      }
    });
}

/**
* Fetches the list of regions and countries from the server.
* Populates the regionAndCountry and regionsList properties.
*/
getListOfRegionAndCountry() {
  this.appService.getRegionList().pipe(takeUntil(this.destroyed$)).subscribe((res: RegionListModel) => {
    if (res && res.status) {
      this.regionAndCountry = res.data;
      for (const key in res.data) {
        if (!this.regionsList.includes(res.data[key].region)) {
          this.regionsList.push(res.data[key].region);
        }
      }
    }
  });
}

/**
* Submits the form after marking all controls as touched and validating them.
* Adds the customer details to the existing list and saves them.
* Closes the modal after saving the details.
*/
submitForm() {
  this.customerForm.markAllAsTouched();
  if (this.customerForm.invalid) return;
  let data: AddCustomerDetailsModel[] =
    this.addCustomerService.getCustomerDetails();
  const pinData = {
    ...this.customerForm.getRawValue(),
    id: self.crypto.randomUUID(),
  };
  this.addCustomerService.saveCustomerDetails(data.concat(pinData));
  this.closeModal();
}

/**
* Closes the modal dialog.
*/
closeModal() {
  this.modalService.dismissAll();
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
export { AddCustomerDetailsModel };
