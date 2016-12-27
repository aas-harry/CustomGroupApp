class WritingCriteriaViewModel extends StudentPortfolio
implements IStudentPortfolio {
    constructor(elementName: string) {
        super(elementName);
    }

    private reports = [
        new ReportItem("Writing Criteria", "WritingCriteriaView", ReportType.WritingCriteria, this)
    ];

    getReports = (): Array<ReportItem> => {
        return this.reports;
    }
}