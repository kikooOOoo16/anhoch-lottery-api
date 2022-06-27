import { Injectable } from '@nestjs/common';
import {DuplicateValueException} from "../../exceptions/general/duplicate-value.exception";
import {MissingRequestDataException} from "../../exceptions/general/missing-request-data.exception";

@Injectable()
export class HelperService {

    public static handleDuplicateKeyErr(e: any): void {
        const DUPLICATE_ERROR_CODE = 11000;
        let duplicateValues: String[] = [];

        if (e.code === DUPLICATE_ERROR_CODE) {

            for ( let prop in e.keyValue ) {
                duplicateValues.push(prop);
            }

            throw new DuplicateValueException(duplicateValues);
        }
    }

    public static checkIfObjectIsEmpty(obj: Object): void {
        if (Object.keys(obj).length === 0) {
            throw new MissingRequestDataException();
        }
    }

    public static convertToTimestamp(day: number, month: number, year: number): number {
        return new Date(year, month-1, day).getTime();
    }
}
