export interface IDashboarcCardItemProps {
    appointmentInfo: {
        appointmentId?: string,
        appointments?: number;
        currency?: string;
        duration: number;
        next: string;
        value?: string;
    };
    firstName: string;
    isPatientCard?: boolean,
    lastName: string;
    patientId: string;
}