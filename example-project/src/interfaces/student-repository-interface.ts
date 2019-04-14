import { IStudent } from "./student-interface";

export interface IStudentRepository {
	get(studentId: number): Promise<IStudent>;
	create(firstName: string, lastName: string): Promise<IStudent>;
	update(student: IStudent): Promise<IStudent>;
	remove(student: IStudent): Promise<void>;
}
