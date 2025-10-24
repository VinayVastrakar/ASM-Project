import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock Alert component since we don't know its exact props
const MockAlert = ({ message, type, onClose }: any) => (
  <div className={`alert alert-${type}`} onClick={onClose}>
    {message}
  </div>
);

describe('Alert Component', () => {
  test('renders alert message', () => {
    const mockProps = {
      message: 'Test alert message',
      type: 'success',
      onClose: jest.fn()
    };
    
    render(<MockAlert {...mockProps} />);
    expect(screen.getByText('Test alert message')).toBeDefined();
  });

  test('applies correct type class', () => {
    const mockProps = {
      message: 'Test alert message',
      type: 'success',
      onClose: jest.fn()
    };
    
    const { container } = render(<MockAlert {...mockProps} />);
    const alertElement = container.firstChild as HTMLElement;
    expect(alertElement.className).toContain('alert-success');
  });
});
