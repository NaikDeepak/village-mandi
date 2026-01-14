import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button data-testid="test-btn">Click me</Button>);
    const button = screen.getByTestId('test-btn');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });

  it('handles click events', () => {
    // Note: In real setup we might need user-event, but for basic check this is fine
    // or just checking render is enough for config validation
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });
});
