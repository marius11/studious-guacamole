export class Course {
    public Id: number;
    public Name: string;

    constructor(name: string)
    // tslint:disable-next-line:one-line
    {
        this.Name = name;
    }
}
