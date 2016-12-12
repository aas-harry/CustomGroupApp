class MathsSkillsProfileViewModel extends StudentPortfolio
implements IStudentPortfolio {
    constructor(elementName: string) {
        super(elementName);
    }

    private reports = [
        new ReportItem("Maths Skills Profile - List", "MathsSkillsProfileListView", ReportType.StudentMathsSkillsProfileList, this),
        new ReportItem("Maths Skills Profile - Table", "MathsSkillsProfileTableView", ReportType.StudentMathsSkillsProfileTable, this)
    ];

    getReports = (): Array<ReportItem> => {
        return this.reports;
    }
}

class CareerProfileViewModel extends StudentPortfolio
    implements IStudentPortfolio {
    constructor(elementName: string) {
        super(elementName);
    }

    private reports = [
        new ReportItem("Career Profile", "CareerProfileView", ReportType.StudentCareerProfile, this),

    ];

    getReports = (): Array<ReportItem> => {
        return this.reports;
    }
}