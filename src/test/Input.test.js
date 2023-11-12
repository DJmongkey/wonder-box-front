import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../components/shared/Input';

describe('Input Component Tests', () => {
  it('renders text input correctly', () => {
    render(<Input type="text" id="testInput" label="Test Label" />);

    const inputElement = screen.getByLabelText(/Test Label/i);
    expect(inputElement).toBeInTheDocument();
  });

  it('renders textarea input correctly', () => {
    render(<Input type="textarea" id="testTextarea" label="Test Textarea" />);

    const textareaElement = screen.getByLabelText(/Test Textarea/i);
    expect(textareaElement).toBeInTheDocument();
  });

  it('handles text input change correctly', () => {
    const handleChange = jest.fn();
    render(
      <Input
        type="text"
        id="testInput"
        label="Test Label"
        onChange={handleChange}
      />,
    );

    const inputElement = screen.getByLabelText(/Test Label/i);
    fireEvent.change(inputElement, { target: { value: 'Hello, World!' } });

    expect(handleChange).toHaveBeenCalledWith(expect.anything());
    expect(inputElement.value).toBe('Hello, World!');
  });
  it('renders date input correctly', () => {
    render(<Input type="date" id="testDate" label="Test Date" />);

    const dateInput = screen.getByLabelText(/Test Date/i);
    expect(dateInput).toBeInTheDocument();
  });

  it('renders radio input correctly', () => {
    render(
      <Input type="radio" id="testRadio" label="Test Radio" value="option1" />,
    );

    const radioInput = screen.getByLabelText(/Test Radio/i);
    expect(radioInput).toBeInTheDocument();
  });

  it('renders file input correctly', () => {
    render(<Input type="file" id="testFile" label="Test File" />);

    const fileInput = screen.getByLabelText(/Test File/i);
    expect(fileInput).toBeInTheDocument();
  });

  it('renders color input correctly', () => {
    render(<Input type="color" id="testColor" value="#ff0000" />);

    const colorInput = screen.getByDisplayValue('#ff0000');
    expect(colorInput).toBeInTheDocument();
  });

  it('handles date input change correctly', () => {
    const handleChange = jest.fn();

    render(
      <Input
        type="date"
        id="testDate"
        label="Test Date"
        onChange={handleChange}
      />,
    );

    const dateInput = screen.getByLabelText(/Test Date/i);
    fireEvent.change(dateInput, { target: { value: '2023-11-03' } });

    expect(handleChange).toHaveBeenCalledWith(expect.anything());
    expect(dateInput.value).toBe('2023-11-03');
  });

  it('handles radio input change correctly', () => {
    const handleChange = jest.fn();
    render(
      <Input
        type="radio"
        id="testRadio"
        label="Test Radio"
        value="option1"
        onChange={handleChange}
      />,
    );

    const radioInput = screen.getByLabelText(/Test Radio/i);
    fireEvent.click(radioInput);

    expect(handleChange).toHaveBeenCalledWith(expect.anything());
    expect(radioInput.checked).toBe(true);
  });

  it('uploads an image file correctly', () => {
    render(<Input type="file" id="testFile" label="Test File" />);

    const fileInput = screen.getByLabelText(/Test File/i);

    const imageFile = new File(['(⌐□_□)'], 'image.png', { type: 'image/png' });
    const fileList = {
      0: imageFile,
      length: 1,
      item: (index) => imageFile,
    };

    Object.defineProperty(fileInput, 'files', {
      value: fileList,
    });

    userEvent.upload(fileInput, imageFile);

    expect(fileInput.files).toHaveLength(1);
    expect(fileInput.files[0]).toStrictEqual(imageFile);
  });

  it('handles color input change correctly', () => {
    const handleChange = jest.fn();
    render(
      <Input
        type="color"
        id="testColor"
        value="#ff0000"
        onChange={handleChange}
      />,
    );

    const colorInput = screen.getByDisplayValue('#ff0000');
    fireEvent.change(colorInput, { target: { value: '#00ff00' } });

    expect(handleChange).toHaveBeenCalledWith(expect.anything());
  });
});
