export class Student {
    public Id: number;
    public FirstName: string;
    public LastName: string;

    constructor(firstName: string, lastName: string)
    // tslint:disable-next-line:one-line
    {
        this.FirstName = firstName;
        this.LastName = lastName;
    }
}
