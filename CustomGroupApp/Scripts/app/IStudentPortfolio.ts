interface IStudentPortfolio {
    // Url link defined in the ReportController
    urlLink: string;

    // Report description
    reportName: string;

    // Called when a new test file is selected
    setDatasource(testFile: TestFile);

    // Called when a new student is selected
    setStudent(student: Student);

    // Flag to indicate whether testFile property has been set
    isTestFileSet: boolean;

    // Report content in html text
    content: string;

    reset();
}

class StudentPortfolio extends kendo.data.ObservableObject
    implements IStudentPortfolio {
    constructor(public elementName: string) {
        super();
        this.elementName = elementName;

    }

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
}

