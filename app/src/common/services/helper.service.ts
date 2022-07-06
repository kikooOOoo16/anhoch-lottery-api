import { Injectable } from '@nestjs/common';
import { DuplicateValueException } from '../../exceptions/general/duplicate-value.exception';
import { MissingRequestDataException } from '../../exceptions/general/missing-request-data.exception';

@Injectable()
export class HelperService {
  public static handleDuplicateKeyErr(e: any): void {
    const DUPLICATE_ERROR_CODE = 11000;
    const duplicateValues: string[] = [];

    if (e.code === DUPLICATE_ERROR_CODE) {
      for (const prop in e.keyValue) {
        duplicateValues.push(prop);
      }

      throw new DuplicateValueException(duplicateValues);
    }
  }

  public static checkIfObjectIsEmpty(obj: Record<string, unknown>): void {
    if (Object.keys(obj).length === 0) {
      throw new MissingRequestDataException();
    }
  }

  public static convertToTimestamp(
    day: number,
    month: number,
    year: number,
  ): number {
    return new Date(year, month - 1, day).getTime();
  }

  public static getCurrentDateTimestamp(): number {
    // return is 28.6.2022, 11:00:25 string
    const macedoniaTime = new Date().toLocaleString('de-DE', {
      timeZone: 'Europe/Belgrade',
    });

    const justDate: string = macedoniaTime.split(',')[0];

    const dateArr: string[] = justDate.split('.');

    const day = dateArr[0];
    const month = dateArr[1];
    const year = dateArr[2];

    return new Date(+year, +month - 1, +day).getTime();
  }

  public static formatTimestamp(timestamp: number): string {
    let seconds: number | string = Math.floor((timestamp / 1000) % 60);
    let minutes: number | string = Math.floor((timestamp / (1000 * 60)) % 60);
    let hours: number | string = Math.floor(
      (timestamp / (1000 * 60 * 60)) % 24,
    );

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return `${hours}:${minutes}:${seconds}`;
  }
}
