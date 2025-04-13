import React from "react";

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="mt-1 w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500 focus:ring"
        required
      />
    </div>
  );
};

export default InputField;
