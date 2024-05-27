import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSelectModule } from 'ngx-select-ex';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FileItem, FileUploader, FileUploadModule } from 'ng2-file-upload';
import { PIN_MODAL_DETAIL } from '@app/shared/constants/pin-constants';
import { CustomerService } from '@app/services/customer.service';
import { AddCustomerDetailsModel } from '@app/shared/components/add-customer/add-customer.component';
import { PinService } from '@app/services/pin.service';
import {
  AddPinModalModel,
  FormFieldsModel,
  PinListModel,
} from '@app/shared/models/pin.model';
import { dataURLtoFile } from '../../utils/file-upload';

@Component({
  selector: 'app-add-pin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgxSelectModule,
    CommonModule,
    FileUploadModule,
  ],
  templateUrl: './add-pin.component.html',
  styleUrl: './add-pin.component.scss',
})
export class AddPinComponent implements OnInit {
  //   public modalService = inject(NgbModal);
  @Input() public id: string = '';
  addPinModalDetails: AddPinModalModel = PIN_MODAL_DETAIL;
  URL = 'http://localhost:3000/upload/';
  collaboratoryList: string[] = [];
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  filtered: any;
  addPinForm: FormGroup = new FormGroup({});
  imageSrc:
    | { fileUrl?: string | ArrayBuffer; filename: string }
    | null
    | undefined;
  hasError: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private customerService: CustomerService,
    private pinService: PinService,
    private modalService: NgbModal,
  ) {
    this.uploader = new FileUploader({
      url: this.URL,
      disableMultipart: true,
      method: 'post',
      itemAlias: 'attachment',
      allowedFileType: ['image'],
    });

    // this.uploader.onAfterAddingFile = (fileItem: FileItem) => {

    // };

    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;
  }

  /* Read image and convert it to  data string  */
  readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        this.imageSrc = { fileUrl: e.target?.result, filename: file.name };
      }
    };
    reader.readAsDataURL(file);
    this.addPinForm.get('pinImage')?.setValue(file);
    this.addPinForm.get('pinImage')?.updateValueAndValidity();
  }

  /**
 * Initializes the component by getting the list of collaboratories,
 * creating the form, setting the ID value, and setting up editing and file error subscriptions.
 */
ngOnInit(): void {
  this.getListOfCollaboratory();
  this.createForm();
  this.setidValue();
  this.edit();
  this.subscribeFileErrors();
}

/**
* Subscribes to file upload errors and handles file addition events.
* Sets the error flag if the file type is invalid and reads the file if added successfully.
*/
subscribeFileErrors() {
  this.uploader.onWhenAddingFileFailed = (item, filter, options) => {
    if (filter.name === 'fileType') {
      this.hasError = true;
    }
  };

  this.uploader.onAfterAddingFile = (fileItem) => {
    this.hasError = false;
    this.readFile(fileItem._file);
  };
}

/**
* Resets the form and populates it with existing data if an ID is present.
* If the ID is not empty, it retrieves the pin details and sets form values.
*/
edit() {
  this.addPinForm.reset();
  if (this.id != '') {
    let data: PinListModel[] = this.pinService.getPinDetails();
    this.filtered = data.filter(item => item.id == this.id);
    this.addPinModalDetails.pinFormFields.forEach((data: FormFieldsModel) => {
      if (data.type === 'image') {
        const { fileUrl, filename } = this.filtered[0][data.control];
        this.imageSrc = { fileUrl, filename };
        const file = dataURLtoFile(fileUrl, filename);
        this.uploader.addToQueue([file]);
        this.addPinForm
          .get(data.control)
          ?.setValue(file);
      } else {
        this.addPinForm
          .get(data.control)
          ?.setValue(this.filtered[0][data.control]);
      }
    });
  } else {
    this.filtered = undefined;
  }
}

/**
* Retrieves a list of collaboratories and maps their names to the collaboratoryList property.
*/
getListOfCollaboratory() {
  this.collaboratoryList = this.customerService
    .getCustomerDetails()
    .map((data: AddCustomerDetailsModel) => {
      return data.name;
    });
}

/**
* Checks the validity of a form control.
* @param key The key of the form control to check.
* @returns True if the control is invalid and touched, otherwise false.
*/
checkValidaty(key: string): boolean {
  return (this.addPinForm.get(key)?.invalid &&
    this.addPinForm.get(key)?.touched)!;
}

/**
* Handles file change events, checking the file type and setting the error flag if the type is invalid.
* @param event The file change event.
*/
onFileChange(event: any): void {
  const file = event.target.files[0];
  if (file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      this.hasError = true;
    } else {
      this.hasError = false;
    }
  }
}

/**
* Custom validator for file types.
* @param control The form control to validate.
* @returns An object indicating the file type validity or null if valid.
*/
fileValidator(control: any) {
  const file = control.value;

  if (file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return { fileType: true };
    } else {
      return { fileType: false };
    }
  }
  return null;
}

/**
* Creates the form with controls based on pinFormFields.
* Adds validators if required and adds an ID control.
*/
createForm() {
  this.addPinModalDetails.pinFormFields.forEach((data: FormFieldsModel) => {
    const validators = [];
    if (data.required) {
      validators.push(Validators.required);
    }
    let control = this._fb.control(
      '',
      validators,
    );
    this.addPinForm.addControl(data.control, control);
  });
  this.addPinForm.addControl('id', this._fb.control('', []));
}

/**
* Handles the event when a file is dragged over the base drop zone.
* @param e The event indicating the drag over action.
*/
public fileOverBase(e: any): void {
  this.hasBaseDropZoneOver = e;
}

/**
* Handles the event when a file is dropped.
* Resets the error flag and reads the dropped file.
* @param event The drop event containing the file.
*/
dropped(event: any) {
  this.hasError = false;
  this.readFile(event[0]);
}

/**
* Handles the event when a file is dragged over another drop zone.
* @param e The event indicating the drag over action.
*/
public fileOverAnother(e: any): void {
  this.hasAnotherDropZoneOver = e;
}

/**
* Generates a random ID and sets it to the form control.
*/
setidValue() {
  var id = Math.random().toString(16).slice(2);
  this.addPinForm.get('id')?.setValue(id);
}

/**
* Sets the value of a radio button control in the form.
* @param value The value to set.
* @param control The control to set the value for.
*/
setRadioButtonValue(value: string, control: string) {
  this.addPinForm.get(control)?.setValue(value);
}

/**
* Submits the form, uploads files if necessary, and saves the pin details.
* Marks all form controls as touched and validates the form.
* Updates or saves the pin details based on the presence of an ID.
*/
submitForm() {
  this.addPinForm.markAllAsTouched();
  if (this.addPinForm.invalid) return;
  if (
    !this.id ||
    this.filtered[0].pinImage.fileUrl !== this.imageSrc?.fileUrl
  ) {
    this.uploader.uploadAll();
  }
  let data: PinListModel[] = this.pinService.getPinDetails();
  const pinData = {
    ...this.addPinForm.getRawValue(),
    id: this.id || self.crypto.randomUUID(),
    pinImage: this.imageSrc,
  };
  if (this.id) {
    this.pinService.updatePinDetails(pinData);
  } else {
    this.pinService.savePinDetails(data.concat(pinData));
  }
  this.closeModal();
}

/**
* Closes the modal dialog.
*/
closeModal() {
  this.modalService.dismissAll();
}

/**
* Opens the file input dialog to choose an image file.
* @param uploadInpt The file input element.
*/
chooseImage(uploadInpt: any) {
  uploadInpt.click();
}


}
