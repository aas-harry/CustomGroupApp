class SchoolStudentRecordViewModel extends kendo.data.ObservableObject {
    constructor(elementName: string) {
        super();
        this.elementName = elementName;
    
    }
    testFile: TestFile;

    elementName: string;
    schoolName: string;
    yearLevel: string;

    name: string;
    dob: string;
    age: string;
    bornInAus: string;
    secondLanguage: string;
    schoolStudentId: string;
    hasSchoolStudentId: boolean;

    // ReSharper disable InconsistentNaming

    private student: Student;
    // ReSharper restore InconsistentNaming

    setDatasource = (testFile: TestFile) => {
        this.testFile = testFile;
    }

    setStudent(student: Student) {
        if (! student) {
            return;
        }

        if (this.student && student.studentId === this.student.studentId) {
            return;
        }

        this.student = student;
        this.set("name", student.name);
        this.set("dob", student.dobString);
        this.set("age", student.ca);
        this.set("bornInAus", student.liveInAus);
        this.set("secondLanguage", student.speak);
        this.set("hasSchoolStudentId", student.hasSchoolStudentId);
        this.set("yearLevel", this.testFile.yearLevel);
        this.set("schoolName", this.testFile.school.name);
    }

    updateStudentPersonalDetails = () => {
        
    }
}