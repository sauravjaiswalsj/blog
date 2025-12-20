import React from 'react';
import DocRoot from '@theme-original/DocRoot';
import AuthWrapper from '../../components/AuthWrapper';

export default function DocRootWrapper(props) {
  return (
    <AuthWrapper>
      <DocRoot {...props} />
    </AuthWrapper>
  );
}
