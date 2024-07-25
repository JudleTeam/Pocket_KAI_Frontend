import { create } from 'zustand';
import { ScheduleParams } from './types';
import { scheduleService } from './schedule.service';
import {
  Nullable,
  Schedule,
  WeekParity,
  FetchStatus,
  FullWeekSchedule,
} from '@/shared';
import { generateDateSchedule } from '../lib/generateDateSchedule';

type StoreState = {
  schedule: Schedule;
  weekSchedule: Nullable<FullWeekSchedule>;
  examsSchedule: null;
  parity: Nullable<WeekParity>;
  scheduleStatus: FetchStatus;
  weekScheduleStatus: FetchStatus;
  error: Nullable<unknown>;
};
type StoreActions = {
  getFullWeekScheduleByName: (name: string) => Promise<void>;
  addToCurrentSchedule: (params: ScheduleParams, isNextWeek?: boolean) => void;
  getSchedule: (params: ScheduleParams) => void;
  getWeekParity: (params?: WeekParity) => Promise<void>;
  resetScheduleState: () => void;
};

const initialState: StoreState = {
  schedule: { parsed_at: '', days: [] },
  weekSchedule: null,
  examsSchedule: null,
  parity: null,
  scheduleStatus: 'idle',
  weekScheduleStatus: 'idle',
  error: null,
};

export const useSchedule = create<StoreState & StoreActions>((set, get) => ({
  ...initialState,
  getFullWeekScheduleByName: async (name) => {
    set({ weekScheduleStatus: 'loading' });
    try {
      const oddWeek = await scheduleService.getWeekScheduleByGroupName(name, {
        week_parity: 'odd',
      });
      const evenWeek = await scheduleService.getWeekScheduleByGroupName(name, {
        week_parity: 'even',
      });
      set({
        weekSchedule: { odd: oddWeek.data, even: evenWeek.data },
        weekScheduleStatus: 'success',
      });
    } catch (error) {
      set({ error, weekScheduleStatus: 'error' });
    }
  },
  addToCurrentSchedule: (params: ScheduleParams, isNextWeek = false) => {
    const response = generateDateSchedule(get().weekSchedule, params);
    set({
      schedule: {
        parsed_at: response.parsed_at,
        days: isNextWeek
          ? [...get().schedule.days, ...response.days]
          : [...response.days, ...get().schedule.days],
      },
    });
  },
  getSchedule: (params: ScheduleParams) => {
    const response = generateDateSchedule(get().weekSchedule, params);
    set({
      schedule: {
        parsed_at: response.parsed_at,
        days: response.days,
      },
    });
  },
  getWeekParity: async (params?: WeekParity) => {
    const response = await scheduleService.getWeekParity(params);
    set({ parity: response.data });
  },
  resetScheduleState: () => set(initialState),
}));
