import { createContext, useContext, useState, ReactNode } from "react";

// הגדרת סוג הנתונים שיישמרו בקונטקסט
interface RegistrationContextType {
  hasStartedRegistration: boolean;
  registrationStartTime: number | null;
  setHasStartedRegistration: (value: boolean) => void;
}

// יצירת הקונטקסט עם ערכי ברירת מחדל
const RegistrationContext = createContext<RegistrationContextType>({
  hasStartedRegistration: false,
  registrationStartTime: null,
  setHasStartedRegistration: () => {},
});

// הוק נוח לשימוש בקונטקסט
export const useRegistration = () => useContext(RegistrationContext);

interface RegistrationProviderProps {
  children: ReactNode;
}

export const RegistrationProvider = ({ children }: RegistrationProviderProps) => {
  const [hasStartedRegistration, setHasStartedRegistrationState] = useState(false);
  const [registrationStartTime, setRegistrationStartTime] = useState<number | null>(null);

  // פונקציה לעדכון מצב ההרשמה
  const setHasStartedRegistration = (value: boolean) => {
    setHasStartedRegistrationState(value);
    if (value) {
      setRegistrationStartTime(Date.now());
    }
  };

  const value = {
    hasStartedRegistration,
    registrationStartTime,
    setHasStartedRegistration
  };

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
};
