export interface IStaff {
  id: number;
  name: string;
  username: string;
  email: string;
  address: IAddress;
  phone: string;
  website: string;
  company: ICompany;
}

export interface IAddress {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: IGeo;
}
export interface IGeo {
  lat: string;
  lng: string;
}
export interface ICompany {
  name: string;
  catchPhrase: string;
  bs: string;
}

// export interface SignInRecord {
//   date: string;
//   timeIn: string;
//   timeOut?: string;
//   isLate: boolean;
//   deduction?: number;
//   status: 'Present' | 'Late' | 'Absent';
//   lateBy?: string;
// }

export interface IStaffRegistration {
  staffName: string;
  staffId: string;
  department: string;
  dateTime: string;
  signInCount?: number;
  latenessCount?: number;
  totalDeductions?: number;
  isLate?: boolean;
  lateBy?: string;
  deduction?: number;
  status?: 'Present' | 'Late';
  lastSignIn?: string;
  signInHistory?: SignInRecord[];
}


export interface SignInRecord {
  id: string;
  date: string;
  timeIn: string;
  timeOut: string | null;
  isLate: boolean;
  lateBy?: string;
  deduction: number;
  status: 'Present' | 'Late' | 'Absent';
  notes?: string;
}

export interface WorkSettings {
  expectedArrivalTime: string;
  gracePeriodMinutes: number;
  lateDeductionAmount: number;
  workingHoursPerDay: number;
}

