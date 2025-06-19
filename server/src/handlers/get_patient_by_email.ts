
import { type GetPatientByEmailInput, type Patient } from '../schema';

export declare function getPatientByEmail(input: GetPatientByEmailInput): Promise<Patient | null>;
