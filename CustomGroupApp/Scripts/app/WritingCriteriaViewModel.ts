class WritingCriteriaViewModel extends StudentPortfolio
implements IStudentPortfolio {
    constructor(elementName: string) {
        super(elementName);
    }

    private reports = [
        new ReportItem("Writing Criteria", "WritingCriteriaView", ReportType.StudentWritingCriteria, this),
        new ReportItem("Marked Writing Script", "MarkedWritingCriteriaView", ReportType.StudentMarkedWritingScript, this)
    ];

    getReports = (): Array<ReportItem> => {
        return this.reports;
    }
}