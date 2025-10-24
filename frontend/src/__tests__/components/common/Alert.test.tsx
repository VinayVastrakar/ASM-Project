import React from 'react';
import { render, screen } from '@testing-library/react';
import Alert from '../../components/common/Alert';

// Mock props for Alert component
const mockProps = {
  message: 'Test alert message',
  type: 'success' as const,
  onClose: jest.fn()
};

describe('Alert Component', () => {
  test('renders alert message', () => {
    render(<Alert {...mockProps} />);
    expect(screen.getByText('Test alert message')).toBeInTheDocument();
  });

  test('applies correct type class', () => {
    const { container } = render(<Alert {...mockProps} />);
    expect(container.firstChild).toHaveClass('alert-success');
  });
});
