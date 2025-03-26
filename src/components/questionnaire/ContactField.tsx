import React from 'react';
import { ContactInfo } from '@/lib/types';

interface ContactFieldProps {
  contactInfo: ContactInfo;
  onChange: (contactInfo: ContactInfo) => void;
}

const ContactField: React.FC<ContactFieldProps> = ({ contactInfo, onChange }) => {
  // טיפול בשינוי שדות
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...contactInfo, email: e.target.value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...contactInfo, phone: e.target.value });
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...contactInfo, name: e.target.value });
  };

  const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...contactInfo, comments: e.target.value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-right">
            שם מלא (אופציונלי)
          </label>
          <input
            id="name"
            type="text"
            value={contactInfo.name || ''}
            onChange={handleNameChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
            dir="rtl"
            placeholder="הזן/י את שמך המלא"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-right">
            כתובת אימייל <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={contactInfo.email}
            onChange={handleEmailChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
            dir="ltr"
            placeholder="your.email@example.com"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 text-right">
            מספר טלפון <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={contactInfo.phone}
            onChange={handlePhoneChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
            dir="ltr"
            placeholder="050-0000000"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="comments" className="block text-sm font-medium text-gray-700 text-right">
            הערות נוספות (אופציונלי)
          </label>
          <textarea
            id="comments"
            value={contactInfo.comments || ''}
            onChange={handleCommentsChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
            dir="rtl"
            rows={4}
            placeholder="הערות, שאלות או כל מידע נוסף שתרצה/י לשתף..."
          />
        </div>
      </div>
    </div>
  );
};

export default ContactField; 