import { AddPinModalModel } from '../models/pin.model';

export const PIN_MODAL_DETAIL: AddPinModalModel = {
  addTitle: 'Add Pin',
  editTitle: 'Edit Title',
  pinFormFields: [
    {
      type: 'input',
      label: 'Title',
      placeholder: 'Enter Title',
      id: 'title',
      control: 'title',
      errorMessage: 'Please provide a valide title.',
      required: true,
    },
    {
      type: 'image',
      label: 'Select Image',
      placeholder: 'Choose or Drag & Drop image file here',
      id: 'image',
      control: 'pinImage',
      multiSelect: false,
      errorMessage: 'Please select image.',
      required: false,
    },
    {
      type: 'select',
      label: 'Select Collaboratory',
      placeholder: 'Select Collaboratory',
      id: 'collaboratory',
      multiSelect: true,
      control: 'collaboratory',
      errorMessage: 'Please select Collaboratory from list.',
      required: true,
    },
    {
      type: 'radio',
      label: 'Privacy',
      id: 'privacy',
      control: 'privacy',
      radioButtons: ['Private', 'Public'],
      errorMessage: 'Select any one of them.',
      required: true,
    },
  ],
  addButtonText: 'Create Pin',
  editButtonText: 'Update Pin',
};

export const ADD_PIN_DETAILS_LOCAL_STORAGE_KEY = 'Pin Details';
