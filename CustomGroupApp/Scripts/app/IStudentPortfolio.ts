/// <reference path="entities.ts" />
class ReportItem {
    content: string;
    constructor(
        public name: string,
        public urlLink: string,
        public reportType: ReportType,
        public reportViewModel: IStudentPortfolio) { }
}

interface IStudentPortfolio {
    // Called when a new test file is selected
    setDatasource(testFile: TestFile);

    // Called when a new student is selected
    setStudent(student: Student);

    getReports(): Array<ReportItem>;

    // Flag to indicate whether testFile property has been set
    isTestFileSet: boolean;
    isViewReady: boolean;

    // Report content in html text
    getContent(reportType: ReportType): string;

    getUrlLink(reportType: ReportType): string;

    setContent(reportType: ReportType, content: string);

    initReport(reportType: ReportType);

    reset();
}

class StudentPortfolio extends kendo.data.ObservableObject
    implements IStudentPortfolio {
    constructor(public elementName: string) {
        super();
        this.elementName = elementName;

    }

    isViewReady = false;
    urlLink: string;
    reportName: string;
    content: string;

    testFile: TestFile;
    isTestFileSet: boolean;

    schoolName: string;
    yearLevel: string;

    name: string;
    dob: string;
    age: string;
    schoolStudentId: string;
    hasSchoolStudentId: boolean;

    protected student: Student;

    reset = () => {
        this.testFile = null;
        this.student = null;
        this.isTestFileSet = false;
    }

    setDatasource = (testFile: TestFile) => {
        this.reset();
        this.testFile = testFile;
        this.isTestFileSet = true;
    }

    setStudent(student: Student) {
        if (!student) {
            return;
        }

        if (this.student && student.studentId === this.student.studentId) {
            return;
        }

        this.student = student;
        this.set("name", student.name);
        this.set("dob", student.dobString);
        this.set("age", student.ca);
        this.set("schoolStudentId", student.schoolStudentId);
        this.set("hasSchoolStudentId", student.hasSchoolStudentId);

        this.set("yearLevel", this.testFile.yearLevel);
        this.set("schoolName", this.testFile.school.name);

        this.setAdditionalProperties(student);
    }

    // Use this function to set other properties in the subclasses
    setAdditionalProperties = (student: Student) => {
    }

    getContent = (reportType: ReportType): string => {
        var report = Enumerable.From(this.getReports())
            .FirstOrDefault(null, x => x.reportType === reportType);
        return report ? report.content : null;
    }

    setContent = (reportType: ReportType, content: string) => {
        var report = Enumerable.From(this.getReports())
            .FirstOrDefault(null, x => x.reportType === reportType);
        if (report) {
            report.content = content;
        }
    }

    getReports = (): Array<ReportItem> => { return []; }

    getUrlLink = (reportType: ReportType): string => {
        var report = Enumerable.From(this.getReports())
            .FirstOrDefault(null, x => x.reportType === reportType);
        return report ? report.urlLink : "";
    }

    initReport = (reportType: ReportType) => { };
}