import { Injectable } from '@angular/core';
import { AddCustomerDetailsModel } from '../shared/components/add-customer/add-customer.component';
import { ADD_CUSTOMER_LOCAL_STORAGE_KEY } from '../shared/constants/customer-constants';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  /**
 * Saves customer details to local storage.
 * Converts the payload to a JSON string and stores it under a specific key in local storage.
 * 
 * @param payload An array of customer details to save.
 */
saveCustomerDetails(payload: AddCustomerDetailsModel[]) {
  localStorage.setItem(
    ADD_CUSTOMER_LOCAL_STORAGE_KEY,
    JSON.stringify(payload),
  );
}

/**
* Retrieves customer details from local storage.
* Parses the JSON string stored under a specific key in local storage and returns the result.
* If no data is found, returns an empty array.
* 
* @returns An array of customer details.
*/
getCustomerDetails(): AddCustomerDetailsModel[] {
  return (
    JSON.parse(localStorage.getItem(ADD_CUSTOMER_LOCAL_STORAGE_KEY)!) || []
  );
}

}
