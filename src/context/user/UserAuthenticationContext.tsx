import { createContext, ReactNode, useContext, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ISignInForm } from '@psycron/components/form/SignIn/SignIn.types';
import { ISignUpForm } from '@psycron/components/form/SignUp/SignUp.types';
import { logoutFc, signInFc, signUpFc } from '@psycron/api/auth';
import { useNavigate } from 'react-router-dom';
import { HOMEPAGE } from '@psycron/pages/urls';

interface AuthContextType {
  signIn: (data: ISignInForm) => void;
  signUp: (data: ISignUpForm) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signInMutation = useMutation({
    mutationFn: signInFc,
    onSuccess: (data) => {
      console.log('sign-in data:', data);
      setIsAuthenticated(true);
      navigate(HOMEPAGE);
    },
    onError: (error) => {
      console.error('sign-in error: ==>', error);
    },
  });

  const signUpMutation = useMutation({
    mutationFn: signUpFc,
    onSuccess: (data) => {
      console.log('sign-up data:', data);
      setIsAuthenticated(true);
    },
    onError: (error) => {
      console.error('Sign-up error: ==>', error);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutFc,
    onSuccess: () => {
      console.log('Logout successful');
      setIsAuthenticated(false);
      navigate(HOMEPAGE);
    },
    onError: (error) => {
      console.error('Logout error: ==>', error);
    },
  });
  const signIn = (data: ISignInForm) => signInMutation.mutate(data);
  const signUp = (data: ISignUpForm) => signUpMutation.mutate(data);
  const logout = () => logoutMutation.mutate();

  return (
    <AuthContext.Provider value={{ signIn, signUp, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
