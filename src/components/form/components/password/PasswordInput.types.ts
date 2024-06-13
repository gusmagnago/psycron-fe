
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import type { ISignInForm } from '../../SignIn/SignIn.types';
import type { ISignUpForm } from '../../SignUp/SignUp.types';

export interface PasswordInputProps {
  errors: FieldErrors<ISignUpForm>;
  hasToConfirm?: boolean;
  register: UseFormRegister<ISignUpForm | ISignInForm>;
}
