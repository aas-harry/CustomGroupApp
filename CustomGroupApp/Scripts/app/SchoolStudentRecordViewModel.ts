class SchoolStudentRecordViewModel extends StudentPortfolio
    implements IStudentPortfolio {
    constructor(elementName: string) {
        super(elementName);
    }

    private reports = [
        new ReportItem("School Student Record", "SchoolStudentRecordView", ReportType.SchoolStudentRecord, this)
    ];

    bornInAus: string;
    secondLanguage: string;
   
    setAdditionalProperties = (student: Student) => {
        this.set("bornInAus", student.liveInAus);
        this.set("secondLanguage", student.speak);
    }

    getReports = (): Array<ReportItem> => {
        return this.reports;
    }

    initReport = (reportType: ReportType): void => {
      
    }
}