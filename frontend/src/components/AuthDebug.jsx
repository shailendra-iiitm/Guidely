import React from 'react';
import useUserStore from '../store/user';
import { getToken } from '../helper';

const AuthDebug = () => {
  const { user } = useUserStore();
  const token = getToken();

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: '#000', 
      color: '#fff', 
      padding: '10px', 
      fontSize: '12px',
      zIndex: 9999
    }}>
      <div><strong>Auth Debug:</strong></div>
      <div>User: {user ? user.name : 'Not logged in'}</div>
      <div>Role: {user ? user.role : 'N/A'}</div>
      <div>Token: {token ? 'Present' : 'Missing'}</div>
      <div>Token Length: {token ? token.length : 0}</div>
    </div>
  );
};

export default AuthDebug;