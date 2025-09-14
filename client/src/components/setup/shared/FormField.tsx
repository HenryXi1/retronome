import React from 'react';
import { Input, InputProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface FormFieldProps extends InputProps {
  label: string;
  name?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, name, ...inputProps }) => {
  return (
    <div>
      <label style={{
        display: 'block',
        marginBottom: '8px',
        color: '#ffffff',
        fontWeight: '600'
      }}>
        {label}
      </label>
      <Input
        size="large"
        prefix={<UserOutlined />}
        className="custom-input"
        {...inputProps}
      />
    </div>
  );
};

export default FormField;
