import { useState } from 'react';

import { validateInput } from '../errors/validateInput';

export default function useFormInput(initialValues) {
  const [formData, setFormData] = useState(initialValues);
  const [formErrors, setFormErrors] = useState([]);

  function handleInputChange(e) {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (name === 'startDate' || name === 'endDate') {
      setFormErrors((prevFormErrors) => ({
        ...prevFormErrors,
        startDate: '',
        endDate: '',
      }));
    }

    const error = validateInput(name, value, { ...formData, [name]: value });

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [name]: error,
    }));
  }

  function validateForm() {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateInput(key, formData[key], formData);
      if (error) {
        isValid = false;
        newErrors[key] = error;
      }
    });

    setFormErrors(newErrors);

    return isValid;
  }

  function updateFormData(newData) {
    setFormData(newData);
  }

  return {
    formData,
    formErrors,
    handleInputChange,
    validateForm,
    updateFormData,
  };
}
