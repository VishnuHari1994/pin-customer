export interface PinListModel {
  id: string;
  title: string;
  pinImage: { fileUrl: string; filename: string };
  collaboratory: string[];
  privacy: string;
}

export interface AddPinModalModel {
  addTitle: string;
  editTitle: string;
  pinFormFields: FormFieldsModel[];
  addButtonText: string;
  editButtonText: string;
}

export interface FormFieldsModel {
  label: string;
  type: string;
  errorMessage: string;
  placeholder?: string;
  radioButtons?: string[];
  multiSelect?: boolean;
  id: string;
  control: string;
  required: boolean;
}
