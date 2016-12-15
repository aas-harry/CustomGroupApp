class ReadingSkillsProfileViewModel extends StudentPortfolio
implements IStudentPortfolio {
    constructor(elementName: string) {
        super(elementName);
    }

    private reports = [
        new ReportItem("Reading Skills Profile", "ReadingSkillsProfileView", ReportType.StudentReadingSkillsProfile, this),
    ];

    getReports = (): Array<ReportItem> => {
        return this.reports;
    }
}