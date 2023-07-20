import {Injectable} from '@angular/core';
import {ValidationMessage} from '../model/validation-message';
import {ServerErrors} from '../model/server-errors';

@Injectable({
  providedIn: 'root'
})
export class ServerErrorService {

  composeServerErrors(serverErrorCodes: string[],
                      serverErrorMapping: Record<string, ValidationMessage>): ServerErrors {

    let serverErrors: ServerErrors = {};
    for (const code of serverErrorCodes) {
      const validationMessage: ValidationMessage = serverErrorMapping[code];
      if (validationMessage) {
        let fieldErrors: string[] = serverErrors[validationMessage.controlName];
        if (!fieldErrors) {
          fieldErrors = [validationMessage.errorMessage];
        } else {
          fieldErrors.push(validationMessage.errorMessage);
        }
        serverErrors[validationMessage.controlName] = fieldErrors;
      }
    }
    return serverErrors;
  }
}
