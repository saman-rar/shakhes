import { getDb, uid } from './client';
import {
  mapCorrespondenceRow,
  mapEmployeeRow,
  mapMonthlyRow,
  mapReferralRow,
  Row,
  rowsFrom,
} from './mappers';
import { Correspondence, Employee, MonthlyEvaluation, Referral } from './types';

export type NewEmployee = Omit<Employee, 'id' | 'createdAt'>;
export type NewReferral = Omit<Referral, 'id' | 'createdAt'>;
export type NewCorrespondence = Omit<Correspondence, 'id' | 'createdAt'>;
export type NewMonthlyEvaluation = Omit<MonthlyEvaluation, 'id' | 'createdAt'>;

export async function listEmployees(): Promise<Employee[]> {
  const db = await getDb();
  const rows = await db.getAllAsync(
    'SELECT * FROM employees ORDER BY created_at DESC',
  );
  return rowsFrom(rows).map(mapEmployeeRow);
}

export async function createEmployee(data: NewEmployee): Promise<Employee> {
  const db = await getDb();
  const id = uid();
  await db.runAsync(
    'INSERT INTO employees (id, full_name, personnel_code, department) VALUES (?, ?, ?, ?)',
    [id, data.fullName, data.personnelCode, data.department],
  );
  const created = await db.getFirstAsync(
    'SELECT * FROM employees WHERE id = ?',
    [id],
  );
  return mapEmployeeRow(created as Row);
}

export async function deleteEmployee(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM employees WHERE id = ?', [id]);
}

export async function listReferrals(): Promise<Referral[]> {
  const db = await getDb();
  const rows = await db.getAllAsync(
    'SELECT * FROM referrals ORDER BY created_at DESC',
  );
  return rowsFrom(rows).map(mapReferralRow);
}

export async function createReferral(data: NewReferral): Promise<Referral> {
  const db = await getDb();
  const id = uid();
  await db.runAsync(
    `INSERT INTO referrals (
      id, employee_id, letter_id, title, type, priority, status,
      referral_date, deadline, return_date, effective_delay,
      quality, knowledge, innovation, correction_count, extra_curricular,
      feedback, evaluation_month, score
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.employeeId,
      data.letterId,
      data.title,
      data.type,
      data.priority,
      data.status,
      data.referralDate,
      data.deadline,
      data.returnDate ?? null,
      data.effectiveDelay,
      data.quality,
      data.knowledge,
      data.innovation,
      data.correctionCount,
      data.extraCurricular ? 1 : 0,
      data.feedback ?? null,
      data.evaluationMonth ?? null,
      data.score,
    ],
  );
  const created = await db.getFirstAsync(
    'SELECT * FROM referrals WHERE id = ?',
    [id],
  );
  return mapReferralRow(created as Row);
}

export async function deleteReferral(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM referrals WHERE id = ?', [id]);
}

export async function listCorrespondence(): Promise<Correspondence[]> {
  const db = await getDb();
  const rows = await db.getAllAsync(
    'SELECT * FROM correspondence ORDER BY created_at DESC',
  );
  return rowsFrom(rows).map(mapCorrespondenceRow);
}

export async function createCorrespondence(
  data: NewCorrespondence,
): Promise<Correspondence> {
  const db = await getDb();
  const id = uid();
  await db.runAsync(
    `INSERT INTO correspondence (
      id, correspondence_type, employee_id, related_referral_id,
      letter_number, subject, sender_receiver, date, status, description, attachments
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.correspondenceType,
      data.employeeId,
      data.relatedReferralId ?? null,
      data.letterNumber,
      data.subject,
      data.senderReceiver,
      data.date,
      data.status,
      data.description ?? null,
      JSON.stringify(data.attachments),
    ],
  );
  const created = await db.getFirstAsync(
    'SELECT * FROM correspondence WHERE id = ?',
    [id],
  );
  return mapCorrespondenceRow(created as Row);
}

export async function deleteCorrespondence(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM correspondence WHERE id = ?', [id]);
}

export async function listMonthlyEvaluations(
  employeeId?: string,
): Promise<MonthlyEvaluation[]> {
  const db = await getDb();
  const rows = employeeId
    ? await db.getAllAsync(
        'SELECT * FROM monthly_evaluations WHERE employee_id = ? ORDER BY created_at DESC',
        [employeeId],
      )
    : await db.getAllAsync(
        'SELECT * FROM monthly_evaluations ORDER BY year DESC, month DESC',
      );
  return rowsFrom(rows).map(mapMonthlyRow);
}

export async function upsertMonthlyEvaluation(
  data: NewMonthlyEvaluation,
): Promise<MonthlyEvaluation> {
  const db = await getDb();
  const existing = await db.getFirstAsync(
    'SELECT id FROM monthly_evaluations WHERE employee_id = ? AND month = ? AND year = ?',
    [data.employeeId, data.month, data.year],
  );
  const id = existing ? (existing as { id: string }).id : uid();

  if (existing) {
    await db.runAsync(
      `UPDATE monthly_evaluations SET
        accuracy = ?, knowledge = ?, knowledge_sharing = ?, convergence = ?,
        participation = ?, extra_curricular = ?, org_system = ?, innovation = ?,
        total = ?, percent = ?
      WHERE id = ?`,
      [
        data.accuracy,
        data.knowledge,
        data.knowledgeSharing,
        data.convergence,
        data.participation,
        data.extraCurricular,
        data.orgSystem,
        data.innovation,
        data.total,
        data.percent,
        id,
      ],
    );
  } else {
    await db.runAsync(
      `INSERT INTO monthly_evaluations (
        id, employee_id, month, year,
        accuracy, knowledge, knowledge_sharing, convergence,
        participation, extra_curricular, org_system, innovation,
        total, percent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.employeeId,
        data.month,
        data.year,
        data.accuracy,
        data.knowledge,
        data.knowledgeSharing,
        data.convergence,
        data.participation,
        data.extraCurricular,
        data.orgSystem,
        data.innovation,
        data.total,
        data.percent,
      ],
    );
  }
  const saved = await db.getFirstAsync(
    'SELECT * FROM monthly_evaluations WHERE id = ?',
    [id],
  );
  return mapMonthlyRow(saved as Row);
}
