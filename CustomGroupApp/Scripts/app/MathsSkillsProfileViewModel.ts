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
