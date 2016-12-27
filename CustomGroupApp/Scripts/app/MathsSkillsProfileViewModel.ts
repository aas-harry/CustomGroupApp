class MathsSkillsProfileViewModel extends StudentPortfolio
implements IStudentPortfolio {
    constructor(elementName: string) {
        super(elementName);
    }

    private reports = [
        new ReportItem("Maths Skills Profile", "MathsSkillsProfileView", ReportType.StudentMathsSkillsProfile, this),
    ];

    getReports = (): Array<ReportItem> => {
        return this.reports;
    }

    initReport = (reportType: ReportType) => {
        this.getData();
     
        this.isViewReady = true;
    }

    private getData = () => {
        const self = this;
        $.ajax({
            type: "POST",
            url: "Home\\GetMathProfileData",
            data: JSON.stringify({ 'testnum': self.testFile.fileNumber }),
            contentType: "application/json",
            success(data) {
               // self.testFile.setNaplanResults(data);
            },
            error(e) {

            }
        });
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