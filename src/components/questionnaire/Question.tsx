import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Option {
  value: string;
  label: string;
}

interface QuestionProps {
  id: string;
  title: string;
  options: Option[];
  selectedValue?: string;
  onChange: (id: string, value: string) => void;
}

const Question: React.FC<QuestionProps> = ({ 
  id, 
  title, 
  options, 
  selectedValue,
  onChange 
}) => {
  return (
    <Card className="mb-6 border-blue-200 shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-blue-50 to-slate-50">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-slate-100 border-b border-blue-200">
        <CardTitle className="text-lg text-blue-900 font-medium text-right">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 bg-opacity-50">
        <RadioGroup
          value={selectedValue}
          onValueChange={(value) => onChange(id, value)}
          className="space-y-3"
          dir="rtl"
          name={id}
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2 space-x-reverse hover:bg-blue-50 p-2 rounded-lg transition-colors">
              <RadioGroupItem value={option.value} id={`${id}-${option.value}`} className="text-blue-600" />
              <Label 
                htmlFor={`${id}-${option.value}`} 
                className="text-gray-700 mr-2 cursor-pointer text-right flex-1"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default Question; 