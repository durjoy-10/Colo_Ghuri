import React from 'react';

const Input = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    onBlur,
    error,
    touched,
    required = false,
    placeholder,
    icon: Icon,
    className = '',
    ...props
}) => {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-gray-700 font-medium mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className={`
                        w-full px-3 py-2 border rounded-lg 
                        focus:outline-none focus:ring-2 transition-all duration-200
                        disabled:bg-gray-100 disabled:cursor-not-allowed
                        ${Icon ? 'pl-10' : 'pl-3'}
                        ${error && touched 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-primary-500'
                        }
                        ${className}
                    `}
                    {...props}
                />
            </div>
            {error && touched && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};

export default Input;