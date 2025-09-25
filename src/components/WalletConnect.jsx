import React from 'react';
import { Wallet, LogOut } from 'lucide-react';
import { formatAddress } from '../utils/contract';

const WalletConnect = ({ 
  account, 
  isConnecting, 
  connectWallet, 
  disconnectWallet 
}) => {
  return (
    <div className="flex items-center gap-4">
      {account ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">{formatAddress(account)}</span>
          </div>
          <button
            onClick={disconnectWallet}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title="Disconnect Wallet"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Disconnect</span>
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
        >
          <Wallet className="w-4 h-4" />
          <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
        </button>
      )}
    </div>
  );
};

export default WalletConnect;