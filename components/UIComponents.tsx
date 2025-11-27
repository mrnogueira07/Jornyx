import React from 'react';

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'small';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 transition-all duration-200 ease-out font-medium touch-manipulation focus:outline-none";
  
  const variants = {
    primary: "bg-orange-500 text-[#111] hover:bg-orange-400 active:transform active:scale-95 shadow-lg shadow-orange-500/20 rounded-full px-6 py-3 text-base",
    ghost: "bg-transparent text-gray-300 border border-gray-600 hover:bg-white/5 hover:text-white hover:border-gray-500 rounded-full px-6 py-3 text-base",
    small: "bg-transparent text-gray-300 border border-gray-700 hover:bg-white/10 hover:text-white rounded-full px-3 py-1 text-xs"
  };

  const disabledStyles = "opacity-50 cursor-not-allowed shadow-none active:scale-100";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${props.disabled ? disabledStyles : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Radio Option ---
interface RadioOptionProps {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (val: string) => void;
  label: string;
}

export const RadioOption: React.FC<RadioOptionProps> = ({ id, name, value, checked, onChange, label }) => {
  return (
    <div className="relative w-full group">
      <input
        type="radio"
        name={name}
        id={id}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="peer sr-only"
      />
      <label
        htmlFor={id}
        className={`
          flex items-center gap-3 w-full p-4 rounded-full border cursor-pointer transition-all duration-200
          bg-white/5 text-gray-100
          hover:bg-white/10
          peer-checked:border-orange-500 peer-checked:bg-gradient-to-r peer-checked:from-orange-500/20 peer-checked:to-transparent
          peer-checked:shadow-[0_0_0_1px_rgba(249,115,22,0.6)]
          ${checked ? 'border-orange-500' : 'border-neutral-700'}
        `}
      >
        <div className={`
          w-5 h-5 rounded-full border-2 flex-shrink-0 box-border transition-all duration-200
          ${checked ? 'border-orange-500 shadow-[inset_0_0_0_4px_#f97316]' : 'border-gray-500 bg-transparent'}
        `} />
        <span className="text-base font-normal">{label}</span>
      </label>
    </div>
  );
};

// --- Text Input ---
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="text-sm text-gray-400 ml-1">{label}</label>}
      <input
        className={`
          w-full px-5 py-4 rounded-2xl border bg-white/5 text-gray-100 text-lg placeholder-gray-500 outline-none
          border-neutral-700
          focus:border-orange-500 focus:bg-[#0f0f0f] focus:shadow-[0_0_0_1px_rgba(249,115,22,0.5)]
          transition-all duration-200
          ${className}
        `}
        {...props}
      />
    </div>
  );
};
