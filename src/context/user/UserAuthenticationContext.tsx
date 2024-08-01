import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutFc, signInFc, signUpFc } from '@psycron/api/auth';
import type { ISignInForm } from '@psycron/components/form/SignIn/SignIn.types';
import type { ISignUpForm } from '@psycron/components/form/SignUp/SignUp.types';
import { HOMEPAGE } from '@psycron/pages/urls';
import { useMutation } from '@tanstack/react-query';

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
  signIn: (data: ISignInForm) => void;
  signUp: (data: ISignUpForm) => void;
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
		onSuccess: () => {
			setIsAuthenticated(true);
			navigate(HOMEPAGE);
		},
		onError: () => {},
	});

	const signUpMutation = useMutation({
		mutationFn: signUpFc,
		onSuccess: () => {
			setIsAuthenticated(true);
		},
		onError: () => {},
	});

	const logoutMutation = useMutation({
		mutationFn: logoutFc,
		onSuccess: () => {
			setIsAuthenticated(false);
			navigate(HOMEPAGE);
		},
		onError: () => {},
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
