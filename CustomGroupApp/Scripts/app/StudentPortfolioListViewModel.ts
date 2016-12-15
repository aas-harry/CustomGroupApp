class StudentPortfolioListViewModel extends kendo.data.ObservableObject {
    constructor(testFile: TestFile) {
        super();

        this.testFile = testFile;
        this.studentPortfolioViewModel = new StudentPortfolioViewModel(testFile);
    }

    
    studentPortfolioViewModel: StudentPortfolioViewModel;
    private testFile: TestFile;


    setDatasource = (testFile: TestFile) => {
        this.testFile = testFile;
        this.studentPortfolioViewModel.setDatasource(testFile);
    }

   showStudentReport = (student: Student) => {
       this.studentPortfolioViewModel.showStudentReport(student);
   }
  
}