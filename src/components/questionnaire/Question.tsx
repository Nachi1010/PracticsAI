import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface QuestionOption {
  value: string;
  label: string;
}

interface QuestionProps {
  id: string;
  title: string;
  options: QuestionOption[];
  selectedValue: string;
  onChange: (id: string, value: string) => void;
}

const Question: React.FC<QuestionProps> = ({
  id,
  title,
  options,
  selectedValue,
  onChange
}) => {
  const handleChange = (value: string) => {
    onChange(id, value);
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
      <h3 className="text-xl font-medium text-blue-900 mb-4 text-right">{title}</h3>
      <RadioGroup
        value={selectedValue}
        onValueChange={handleChange}
        className="space-y-2"
      >
        {options.map((option, index) => (
          <div key={option.value} className="flex items-center justify-end space-x-2 space-x-reverse p-2 rounded-md hover:bg-gray-50">
            <Label
              htmlFor={`${id}-${option.value}`}
              className="flex-grow text-right cursor-pointer text-lg font-normal text-gray-700"
            >
              {option.label}
            </Label>
            <RadioGroupItem
              value={option.value}
              id={`${id}-${option.value}`}
              className="border-gray-400"
            />
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default Question;