import { Injectable } from '@angular/core';
import { WorkSettings } from '../interfaces/staff';

@Injectable({
  providedIn: 'root',
})
export class WorkSetting {
  private readonly SETTINGS_KEY = 'workSettings';

  // Default settings
  private defaultSettings: WorkSettings = {
    expectedArrivalTime: '08:00',
    gracePeriodMinutes: 5,
    lateDeductionAmount: 500,
    workingHoursPerDay: 8,
  };

  constructor() {
    if (!this.getSettings()) {
      this.saveSettings(this.defaultSettings);
    }
  }

  getSettings(): WorkSettings {
    try {
      const settings = localStorage.getItem(this.SETTINGS_KEY);
      return settings ? JSON.parse(settings) : this.defaultSettings;
    } catch (error) {
      console.error('Error loading settings:', error);
      return this.defaultSettings;
    }
  }

  saveSettings(settings: WorkSettings): void {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  // Check if arrival time is late
  isLate(dateTimeString: string): { isLate: boolean; minutesLate: number; deduction: number } {
    const settings = this.getSettings();

    // Extract time from datetime-local input (format: YYYY-MM-DDTHH:mm)
    const timeIn = dateTimeString.split('T')[1]; // Gets HH:mm

    const expected = this.parseTime(settings.expectedArrivalTime);
    const arrival = this.parseTime(timeIn);

    // Calculate difference in minutes
    const diffMinutes = Math.floor((arrival.getTime() - expected.getTime()) / (1000 * 60));

    // Apply grace period
    const effectiveLateness = diffMinutes - settings.gracePeriodMinutes;

    if (effectiveLateness > 0) {
      return {
        isLate: true,
        minutesLate: effectiveLateness,
        deduction: settings.lateDeductionAmount,
      };
    }

    return {
      isLate: false,
      minutesLate: 0,
      deduction: 0,
    };
  }

  // Parse time string (HH:mm) to Date object
  private parseTime(timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  // Format minutes to readable string
  formatLateTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours} hour${hours > 1 ? 's' : ''}`;
  }
}