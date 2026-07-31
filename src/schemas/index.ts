import { z } from 'zod';

export const employeeSchema = z.object({
  fullName: z.string().min(3, 'نام و نام خانوادگی الزامی است'),
  personnelCode: z.string().min(1, 'کد پرسنلی الزامی است'),
  department: z.string().min(1, 'واحد / معاونت الزامی است'),
});
export type EmployeeForm = z.infer<typeof employeeSchema>;

export const referralSchema = z.object({
  employee: z.string().min(1, 'کارمند الزامی است'),
  letterId: z.string().min(1, 'شناسه نامه / ارجاع الزامی است'),
  title: z.string().min(1, 'عنوان ارجاع الزامی است'),
  type: z.string().min(1, 'نوع را انتخاب کنید'),
  priority: z.string().min(1, 'اولویت را انتخاب کنید'),
  status: z.string().min(1, 'وضعیت را انتخاب کنید'),
  referralDate: z.string().min(1, 'تاریخ ارجاع الزامی است'),
  deadline: z.string().min(1, 'مهلت انجام الزامی است'),
  returnDate: z.string().optional(),
  effectiveDelay: z.number().min(0, 'تأخیر مؤثر نامعتبر است'),
  quality: z.number().min(0).max(100, 'حداکثر ۱۰۰'),
  knowledge: z.number().min(0).max(100, 'حداکثر ۱۰۰'),
  innovation: z.number().min(0).max(100, 'حداکثر ۱۰۰'),
  correctionCount: z.number().min(0, 'تعداد اصلاح نامعتبر است'),
  extraCurricular: z.boolean(),
  feedback: z.string().optional(),
  evaluationMonth: z.string().min(1, 'ماه ارزیابی الزامی است'),
});
export type ReferralForm = z.infer<typeof referralSchema>;

export const correspondenceSchema = z.object({
  correspondenceType: z.string().min(1, 'نوع مکاتبه را انتخاب کنید'),
  employee: z.string().min(1, 'کارمند الزامی است'),
  relatedReferral: z.string().optional(),
  letterNumber: z.string().min(1, 'شماره نامه الزامی است'),
  subject: z.string().min(1, 'موضوع الزامی است'),
  senderReceiver: z.string().min(1, 'فرستنده / گیرنده الزامی است'),
  date: z.string().min(1, 'تاریخ الزامی است'),
  status: z.string().min(1, 'وضعیت را انتخاب کنید'),
  description: z.string().optional(),
});
export type CorrespondenceForm = z.infer<typeof correspondenceSchema>;

export const monthlySchema = z.object({
  accuracy: z.number().min(0).max(300, 'حداکثر ۳۰۰'),
  knowledge: z.number().min(0).max(400, 'حداکثر ۴۰۰'),
  knowledgeSharing: z.number().min(0).max(250, 'حداکثر ۲۵۰'),
  convergence: z.number().min(0).max(200, 'حداکثر ۲۰۰'),
  participation: z.number().min(0).max(150, 'حداکثر ۱۵۰'),
  extraCurricular: z.number().min(0).max(150, 'حداکثر ۱۵۰'),
  orgSystem: z.number().min(0).max(100, 'حداکثر ۱۰۰'),
  innovation: z.number().min(0).max(100, 'حداکثر ۱۰۰'),
});
export type MonthlyForm = z.infer<typeof monthlySchema>;

export const dashboardSchema = z.object({
  employee: z.string().min(1, 'کارمند الزامی است'),
  date: z.string().min(1, 'تاریخ الزامی است'),
});
export type DashboardForm = z.infer<typeof dashboardSchema>;
