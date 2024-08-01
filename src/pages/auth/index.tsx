import { Box } from '@mui/material';
import { SignIn as SignInForm } from '@psycron/components/form/SignIn/SignIn';
import { ISignInForm } from '@psycron/components/form/SignIn/SignIn.types';
import { SignUp } from '@psycron/components/form/SignUp/SignUp';
import { ISignUpForm } from '@psycron/components/form/SignUp/SignUp.types';
import { useAuth } from '@psycron/context/user/UserAuthenticationContext';

import { useForm, SubmitHandler } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

export const AuthPage = () => {
  const { signIn, signUp } = useAuth();
  let { pathname } = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignInForm>();

  const onSubmitSignIn: SubmitHandler<ISignInForm> = (data) => {
    console.log('03 ===>', data);
    signIn(data);
  };

  const onSubmitSignUp: SubmitHandler<ISignUpForm> = (data) => {
    console.log('🚀 ~ SignUp ~ data:', data);
    signUp(data);
  };

  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      height='100%'
    >
      {pathname.includes('sign-in') ? (
        <SignInForm
          errors={errors}
          handleSubmit={handleSubmit}
          onSubmit={onSubmitSignIn}
          register={register}
        />
      ) : (
        <SignUp
          errors={errors}
          handleSubmit={handleSubmit}
          onSubmit={onSubmitSignUp}
          register={register}
        />
      )}
    </Box>
  );
};
