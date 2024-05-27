import { Inject, Injectable } from '@angular/core';
import { ADD_PIN_DETAILS_LOCAL_STORAGE_KEY } from '../shared/constants/pin-constants';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { PinListModel } from '../shared/models/pin.model';

@Injectable({
  providedIn: 'root',
})
export class PinService {
  localStorage;
  pinObserbable: BehaviorSubject<PinListModel[]> = new BehaviorSubject<
    PinListModel[]
  >([]);
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.localStorage = document.defaultView?.localStorage;
  }
 /**
 * Saves the pin details to local storage and notifies observers.
 * @param payload The array of PinListModel objects to be saved
 */
savePinDetails(payload: PinListModel[]) {
  if (this.localStorage) {
      this.localStorage.setItem(
          ADD_PIN_DETAILS_LOCAL_STORAGE_KEY,
          JSON.stringify(payload),
      );
  }
  this.pinObserbable.next(payload);
}

  /**
 * Updates the details of an existing pin.
 * Replaces the old pin data with the new payload data in the pin list.
 * Updates the local storage and notifies subscribers of the pin list changes.
 * 
 * @param payload The new pin details to update.
 */
updatePinDetails(payload: PinListModel) {
  const pinList = this.getPinDetails();
  pinList.splice(
    pinList.findIndex(pin => pin.id === payload.id),
    1,
    payload,
  );
  if (this.localStorage) {
    this.localStorage.setItem(
      ADD_PIN_DETAILS_LOCAL_STORAGE_KEY,
      JSON.stringify(pinList),
    );
  }
  this.pinObserbable.next(pinList);
}

/**
* Deletes a pin by its ID.
* Removes the pin from the pin list, updates the local storage, and notifies subscribers of the pin list changes.
* 
* @param id The ID of the pin to delete.
*/
deletePinDetails(id: string) {
  const pinList = this.getPinDetails();
  pinList.splice(
    pinList.findIndex(pin => pin.id === id),
    1,
  );
  if (this.localStorage) {
    this.localStorage.setItem(
      ADD_PIN_DETAILS_LOCAL_STORAGE_KEY,
      JSON.stringify(pinList),
    );
  }
  this.pinObserbable.next(pinList);
}

/**
* Retrieves the list of pin details from local storage.
* Parses the JSON string from local storage and returns the pin list.
* If local storage is not available, returns an empty array.
* 
* @returns The list of pin details.
*/
getPinDetails(): PinListModel[] {
  if (this.localStorage) {
    return (
      JSON.parse(localStorage.getItem(ADD_PIN_DETAILS_LOCAL_STORAGE_KEY)!) ||
      []
    );
  }
  return [];
}

}
