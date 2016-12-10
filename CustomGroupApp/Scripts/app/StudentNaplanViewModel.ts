class StudentNaplanViewModel extends StudentPortfolio
    implements IStudentPortfolio {
    constructor(elementName: string) {
        super(elementName);
    }

    private reports = [
        new ReportItem("Student Naplan Report", "StudentNaplanView", ReportType.NationalProgressIndex, this)
    ];

    setAdditionalProperties = (student: Student) => {
    }

    getReports = (): Array<ReportItem> => {
        return this.reports;
    }

}

