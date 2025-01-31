import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const futureDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
        return null; // Let the required validator handle empty values
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to avoid time differences

    const selectedDate = new Date(control.value);

    return selectedDate > today ? null : { futureDate: true };
};