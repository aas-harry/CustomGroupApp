class StudentPortfolioViewModel extends kendo.data.ObservableObject {
    constructor(elementName: string) {
        super();
       
    }

    testFile: TestFile;
    private student: Student;
    schoolStudentRecordViewModel = new SchoolStudentRecordViewModel("school-student-record");

    setDatasource = (testFile: TestFile) => {
        this.testFile = testFile;

        this.schoolStudentRecordViewModel.setDatasource(testFile);
    }

    showStudentReport = (student: Student) => {
        this.student = student;
        this.schoolStudentRecordViewModel.setStudent(student);
    }
}