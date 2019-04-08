import React from 'react';
import ReactDOM from 'react-dom';
import WalletApp from './wallet-app';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<WalletApp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
