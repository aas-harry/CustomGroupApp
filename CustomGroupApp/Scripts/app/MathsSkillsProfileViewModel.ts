class MathsSkillsProfileViewModel extends StudentPortfolio
implements IStudentPortfolio {
    constructor(elementName: string) {
        super(elementName);
    }

    private reports = [
        new ReportItem("Maths Skills Profile", "MathsSkillsProfileListView", ReportType.StudentMathsSkillsProfile, this),
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