export interface Employee {
  id: string;
  fullName: string;
  personnelCode: string;
  department: string;
  createdAt: string;
}

export interface Referral {
  id: string;
  employeeId: string;
  letterId: string;
  title: string;
  type: string;
  priority: string;
  status: string;
  referralDate: string;
  deadline: string;
  returnDate: string | null;
  effectiveDelay: number;
  quality: number;
  knowledge: number;
  innovation: number;
  correctionCount: number;
  extraCurricular: boolean;
  feedback: string | null;
  evaluationMonth: string | null;
  score: number;
  createdAt: string;
}

export interface Correspondence {
  id: string;
  correspondenceType: string;
  employeeId: string;
  relatedReferralId: string | null;
  letterNumber: string;
  subject: string;
  senderReceiver: string;
  date: string;
  status: string;
  description: string | null;
  attachments: string[];
  createdAt: string;
}

export interface MonthlyEvaluation {
  id: string;
  employeeId: string;
  month: string;
  year: string;
  accuracy: number;
  knowledge: number;
  knowledgeSharing: number;
  convergence: number;
  participation: number;
  extraCurricular: number;
  orgSystem: number;
  innovation: number;
  total: number;
  percent: number;
  createdAt: string;
}
