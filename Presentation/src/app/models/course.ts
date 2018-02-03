import { Student } from "app/models/student";

export class Course {
    public Id: number;
    public Name: string;
    public Students: Student[];

    constructor(name: string) {
        this.Name = name;
    }
}
