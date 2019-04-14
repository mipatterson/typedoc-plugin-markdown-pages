import { IStudent } from "../interfaces/student-interface";

export class Student implements IStudent {
	private _id: number;
	private _firstName: string;
	private _lastName: string;

	constructor(id: number, firstName: string, lastName: string) {
		this._id = id;
		this._firstName = firstName;
		this._lastName = lastName;
	}

	public get id(): number {
		return this._id;
	}

	public get firstName(): string {
		return this._firstName;
	}

	public get lastName(): string {
		return this._lastName;
	}
}
