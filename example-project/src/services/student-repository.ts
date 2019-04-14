import { IStudent } from "../interfaces/student-interface";
import { IStudentRepository } from "../interfaces/student-repository-interface";
import { Student } from "../models/student";

export class StudentRepository implements IStudentRepository {
	private _students: Map<number, Student>;

	constructor() {
		this._students = new Map<number, Student>();
	}

	public async get(studentId: number): Promise<IStudent> {
		return this._students.get(studentId);
	}

	public async create(firstName: string, lastName: string): Promise<IStudent> {
		const id = 0;
		const student = new Student(id, firstName, lastName);
		this._students.set(id, student);
		return student
	}

	public async update(student: IStudent): Promise<IStudent> {
		if (!this._students.has(student.id)) {
			throw new Error(`No student with ID ${student.id} exists.`);
		}

		const newStudent = new Student(student.id, student.firstName, student.lastName);

		this._students.set(student.id, newStudent);

		return newStudent;
	}

	public async remove(student: IStudent): Promise<void> {
		if (!this._students.has(student.id)) {
			throw new Error(`No student with ID ${student.id} exists.`);
		}

		this._students.delete(student.id);
	}
}
