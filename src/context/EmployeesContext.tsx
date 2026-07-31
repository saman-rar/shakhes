import {
  createEmployee,
  deleteEmployee,
  listEmployees,
  NewEmployee,
} from '@/db/repositories';
import { Employee } from '@/db/types';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface EmployeeOption {
  label: string;
  value: string;
}

interface EmployeesContextValue {
  employees: Employee[];
  employeeOptions: EmployeeOption[];
  addEmployee: (data: NewEmployee) => Promise<Employee>;
  removeEmployee: (id: string) => Promise<void>;
  getEmployeeName: (id: string) => string;
  refresh: () => Promise<void>;
}

const EmployeesContext = createContext<EmployeesContextValue | undefined>(
  undefined,
);

export function EmployeesProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const refresh = useCallback(async () => {
    const rows = await listEmployees();
    setEmployees(rows);
  }, []);

  useEffect(() => {
    refresh().catch(() => undefined);
  }, [refresh]);

  const addEmployee = useCallback(async (data: NewEmployee) => {
    const created = await createEmployee(data);
    setEmployees((prev) => [created, ...prev]);
    return created;
  }, []);

  const removeEmployee = useCallback(async (id: string) => {
    await deleteEmployee(id);
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const getEmployeeName = useCallback(
    (id: string) => employees.find((e) => e.id === id)?.fullName ?? '',
    [employees],
  );

  const employeeOptions = useMemo<EmployeeOption[]>(
    () => employees.map((e) => ({ label: e.fullName, value: e.id })),
    [employees],
  );

  const value = useMemo<EmployeesContextValue>(
    () => ({
      employees,
      employeeOptions,
      addEmployee,
      removeEmployee,
      getEmployeeName,
      refresh,
    }),
    [
      employees,
      employeeOptions,
      addEmployee,
      removeEmployee,
      getEmployeeName,
      refresh,
    ],
  );

  return (
    <EmployeesContext.Provider value={value}>
      {children}
    </EmployeesContext.Provider>
  );
}

export function useEmployees(): EmployeesContextValue {
  const ctx = useContext(EmployeesContext);
  if (!ctx) {
    throw new Error('useEmployees must be used within an EmployeesProvider');
  }
  return ctx;
}

export type { Employee };
