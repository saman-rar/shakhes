import * as jalaali from 'jalaali-js';

export const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export const JALALI_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

export const JALALI_WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

export interface JalaliDate {
  jy: number;
  jm: number;
  jd: number;
}

export function toFa(value: number | string): string {
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

export function todayJalali(): JalaliDate {
  const now = new Date();
  return jalaali.toJalaali(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
  );
}

export function daysInJalaliMonth(jy: number, jm: number): number {
  return jalaali.jalaaliMonthLength(jy, jm);
}

export function isValidJalali(jy: number, jm: number, jd: number): boolean {
  return jalaali.isValidJalaaliDate(jy, jm, jd);
}

export function firstWeekdayOfMonth(jy: number, jm: number): number {
  const g = jalaali.toGregorian(jy, jm, 1);
  const jsDay = new Date(g.gy, g.gm - 1, g.gd).getDay();
  return (jsDay + 1) % 7;
}

export function formatJalali(date: JalaliDate): string {
  const yy = String(date.jy).padStart(4, '0');
  const mm = String(date.jm).padStart(2, '0');
  const dd = String(date.jd).padStart(2, '0');
  return toFa(`${yy}/${mm}/${dd}`);
}

export function parseJalali(value?: string | null): JalaliDate | null {
  if (!value) return null;
  const ascii = value.replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)));
  const match = ascii.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
  if (!match) return null;
  const jy = Number(match[1]);
  const jm = Number(match[2]);
  const jd = Number(match[3]);
  return isValidJalali(jy, jm, jd) ? { jy, jm, jd } : null;
}

export function currentJalaliMonthName(): string {
  return JALALI_MONTHS[todayJalali().jm - 1];
}

export function jalaliMonthsAround(center: number, range = 2): number[] {
  const out: number[] = [];
  for (let y = center - range; y <= center + range; y++) out.push(y);
  return out;
}
