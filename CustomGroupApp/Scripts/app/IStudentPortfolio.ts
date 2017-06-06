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
    setStudent(student: Student, refresh: boolean);

    getReports(): Array<ReportItem>;

    // Flag to indicate whether testFile property has been set
    isTestFileSet: boolean;
    isViewReady: boolean;

    // Report content in html text
    getContent(reportType: ReportType): string;

    getUrlLink(reportType: ReportType): string;

    setContent(reportType: ReportType, content: string);

    setAdditionalData(callback: (status) => any);

    initReport(reportType: ReportType, width: number, height: number);

    resizeContent(width: number, height: number);

    reset();
}

class StudentPortfolio extends kendo.data.ObservableObject
    implements IStudentPortfolio {
    constructor(public elementName: string) {
        super();
        this.elementName = elementName;

        this.sex = "M";
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
    sex: string;
    speak: string;
    liveInAus: string;
    studentInfo: string;
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

    setStudent(student: Student, refresh: boolean = false) {
        if (!student) {
            return;
        }

        if (! refresh && this.student && student.studentId === this.student.studentId) {
            return;
        }

        this.student = student;
        this.set("name", student.name);
        this.set("dob", student.dobString);
        const year = Math.floor(student.ca);
        const month = Math.round((student.ca - year) * 100);
        this.set("age", `${year} Years` + (month <= 0 ? "" : ` ${month} Month` + (month > 1 ? "s" : "")) );
        this.set("sex", student.sex === "M" ? "Male" : "Female");
        this.set("speak", student.speak);
        this.set("liveInAus", student.liveInAus);

        this.set("schoolStudentId", student.schoolStudentId);
        this.set("hasSchoolStudentId", student.hasSchoolStudentId);
        if (this.hasSchoolStudentId) {
            this.set("studentInfo", `Dob: ${this.dob},  Student ID: ${this.schoolStudentId}`);
        } else {
            this.set("studentInfo", `Dob: ${this.dob}`);
        }

        this.set("yearLevel", this.testFile.yearLevel);
        this.set("schoolName", this.testFile.school.name);

        this.setAdditionalProperties(student);
    }

    // Use this function to set other properties in the subclasses
    setAdditionalProperties = (student: Student) => {
    }

    // Overwrite this function if the report needs to get addtional data.
    // Testfile data does not have enough data to produce the report
    setAdditionalData = (callback: (status) => any) => {
        if (callback) {
            callback(true);
        }
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

    initReport = (reportType: ReportType, width: number, height: number) => {
        this.isViewReady = true;
    };

    resizeContent = (width: number, height: number) => {
        var container = document.getElementById(this.elementName);
        if (!container) {
            return;
        }
        container.setAttribute("style", "overflow: auto; height: " + height + "px");

        this.resizeOtherContent(width, height);
    };

    resizeOtherContent = (width: number, height: number) => {
        // overwrite this in subclass
    }
}