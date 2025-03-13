import React from 'react';
import { render, act } from '@testing-library/react';
import { CoreContextProvider } from '../core/CoreContext';
import { BrowserRouter } from 'react-router-dom';

describe('CoreContext', () => {
  test('provider renders without crashing', () => {
    const { container } = render(
      <BrowserRouter>
        <CoreContextProvider>
          <div>Test content</div>
        </CoreContextProvider>
      </BrowserRouter>
    );
    
    expect(container).toBeInTheDocument();
  });
});