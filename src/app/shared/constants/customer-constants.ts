export const ADD_CUSTOMER_MODAL_TITLE = 'Add Customer';

export const ADD_CUSTOMER_BUTTON_TEXT = 'Add New Customer';

export const ADD_CUSTOMER_FORM: {
  [key: string]: {
    label: string;
    errorMessage: string;
    control: string;
    id: string;
    placeholder: string;
  };
} = {
  name: {
    label: 'Name',
    errorMessage: 'Please enter a valid name.',
    control: 'name',
    id: 'Name',
    placeholder: 'Enter Customer Name',
  },
  email: {
    label: 'Email',
    errorMessage: 'Please enter a valid email.',
    control: 'email',
    id: 'email',
    placeholder: 'Enter Customer Email ',
  },
  region: {
    label: 'Regions',
    errorMessage: 'Please enter a valid regions.',
    control: 'region',
    id: 'region',
    placeholder: 'Select Customer Region',
  },
  country: {
    label: 'Country',
    errorMessage: 'Please enter a valid country.',
    control: 'country',
    id: 'Country',
    placeholder: 'Select Customer Country',
  },
};

export const ADD_CUSTOMER_LOCAL_STORAGE_KEY = 'Customer Details';
