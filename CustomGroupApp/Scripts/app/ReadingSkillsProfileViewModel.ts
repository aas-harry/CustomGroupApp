class ReadingSkillsProfileViewModel extends StudentPortfolio
implements IStudentPortfolio {
    constructor(elementName: string) {
        super(elementName);
    }

    private reports = [
        new ReportItem("Reading Skills Profile - List", "ReadingSkillsProfileListView", ReportType.StudentReadingSkillsProfileList, this),
        new ReportItem("Reading Skills Profile - Table", "ReadingMathsSkillsProfileTableView", ReportType.StudentReadingSkillsProfileTable, this)
    ];

    getReports = (): Array<ReportItem> => {
        return this.reports;
    }
}