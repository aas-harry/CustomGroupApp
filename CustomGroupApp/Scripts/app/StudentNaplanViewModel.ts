class StudentNaplanViewModel extends StudentPortfolio
    implements IStudentPortfolio {
    constructor(elementName: string) {
        super(elementName);

        this.urlLink = "StudentNaplanView";
        this.reportName = "Student Naplan Report";

    }

    setAdditionalProperties = (student: Student) => {
    }
}

