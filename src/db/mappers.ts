import { Correspondence, Employee, MonthlyEvaluation, Referral } from './types';

export type Row = Record<string, unknown>;

export function rowsFrom(result: unknown[]): Row[] {
  return result as unknown as Row[];
}

const str = (v: unknown, fallback = ''): string =>
  typeof v === 'string' ? v : fallback;
const num = (v: unknown, fallback = 0): number =>
  typeof v === 'number' ? v : fallback;
const strOrNull = (v: unknown): string | null =>
  typeof v === 'string' ? v : null;

export function mapEmployeeRow(row: Row): Employee {
  return {
    id: str(row.id),
    fullName: str(row.full_name),
    personnelCode: str(row.personnel_code),
    department: str(row.department),
    createdAt: str(row.created_at),
  };
}

export function mapReferralRow(row: Row): Referral {
  return {
    id: str(row.id),
    employeeId: str(row.employee_id),
    letterId: str(row.letter_id),
    title: str(row.title),
    type: str(row.type),
    priority: str(row.priority),
    status: str(row.status),
    referralDate: str(row.referral_date),
    deadline: str(row.deadline),
    returnDate: strOrNull(row.return_date),
    effectiveDelay: num(row.effective_delay),
    quality: num(row.quality),
    knowledge: num(row.knowledge),
    innovation: num(row.innovation),
    correctionCount: num(row.correction_count),
    extraCurricular: num(row.extra_curricular) === 1,
    feedback: strOrNull(row.feedback),
    evaluationMonth: strOrNull(row.evaluation_month),
    score: num(row.score),
    createdAt: str(row.created_at),
  };
}

export function mapCorrespondenceRow(row: Row): Correspondence {
  let attachments: string[] = [];
  try {
    const parsed = JSON.parse(str(row.attachments, '[]'));
    if (Array.isArray(parsed)) attachments = parsed.map(String);
  } catch {
    attachments = [];
  }
  return {
    id: str(row.id),
    correspondenceType: str(row.correspondence_type),
    employeeId: str(row.employee_id),
    relatedReferralId: strOrNull(row.related_referral_id),
    letterNumber: str(row.letter_number),
    subject: str(row.subject),
    senderReceiver: str(row.sender_receiver),
    date: str(row.date),
    status: str(row.status),
    description: strOrNull(row.description),
    attachments,
    createdAt: str(row.created_at),
  };
}

export function mapMonthlyRow(row: Row): MonthlyEvaluation {
  return {
    id: str(row.id),
    employeeId: str(row.employee_id),
    month: str(row.month),
    year: str(row.year),
    accuracy: num(row.accuracy),
    knowledge: num(row.knowledge),
    knowledgeSharing: num(row.knowledge_sharing),
    convergence: num(row.convergence),
    participation: num(row.participation),
    extraCurricular: num(row.extra_curricular),
    orgSystem: num(row.org_system),
    innovation: num(row.innovation),
    total: num(row.total),
    percent: num(row.percent),
    createdAt: str(row.created_at),
  };
}
