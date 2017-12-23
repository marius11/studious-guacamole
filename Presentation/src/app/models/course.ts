import { Student } from "app/models/student";

export class Course {
    public Id: number;
    public Name: string;
    public Students: Student[];

    constructor(name: string)
    // tslint:disable-next-line:one-line
    {
        this.Name = name;
    }
}
