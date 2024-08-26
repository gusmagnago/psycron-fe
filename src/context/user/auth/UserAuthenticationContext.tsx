import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, logoutFc, signInFc, signUpFc } from '@psycron/api/auth';
import type { CustomError } from '@psycron/api/error';
import type { ISignInForm } from '@psycron/components/form/SignIn/SignIn.types';
import type { ISignUpForm } from '@psycron/components/form/SignUp/SignUp.types';
import { DASHBOARD, HOMEPAGE } from '@psycron/pages/urls';
import { useMutation, useQuery } from '@tanstack/react-query';

import type {
	AuthContextType,
	AuthProviderProps,
	ITherapist,
	IUserData,
} from './UserAuthenticationContext.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const navigate = useNavigate();
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [signInError, setSignInError] = useState<string | null>(null);
	const [signUpError, setSignUpError] = useState<string | null>(null);

	const [user, setUser] = useState<ITherapist | null>(null);

	const {
		data: sessionData,
		isLoading: isSessionLoading,
		isSuccess,
		isError,
	} = useQuery<IUserData>({
		queryKey: ['session'],
		queryFn: getSession,
	});

	useEffect(() => {
		if (isSuccess && sessionData?.isAuthenticated === true) {
			setIsAuthenticated(true);
			setUser(sessionData.user);
		} else if (isError) {
			setIsAuthenticated(false);
		}
	}, [isSuccess, isError, sessionData]);

	const signInMutation = useMutation({
		mutationFn: signInFc,
		onSuccess: () => {
			setIsAuthenticated(true);
			navigate(DASHBOARD);
		},
		onError: (error: CustomError) => {
			setSignInError(error.message);
		},
	});

	const signUpMutation = useMutation({
		mutationFn: signUpFc,
		onSuccess: () => {
			setIsAuthenticated(true);
			navigate(DASHBOARD);
		},
		onError: (error: CustomError) => {
			setSignUpError(error.message);
		},
	});

	const logoutMutation = useMutation({
		mutationFn: logoutFc,
		onSuccess: () => {
			setIsAuthenticated(false);
			navigate(HOMEPAGE);
		},
	});

	const signIn = (data: ISignInForm) => signInMutation.mutate(data);
	const signUp = (data: ISignUpForm) => signUpMutation.mutate(data);
	const logout = () => logoutMutation.mutate();

	if (isSessionLoading) {
		return null;
	}

	return (
		<AuthContext.Provider
			value={{
				signIn,
				signUp,
				logout,
				signInError,
				signUpError,
				isAuthenticated,
				isSessionLoading,
				user,
			}}
		>
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
