class StudentPortfolioListViewModel extends kendo.data.ObservableObject {
    constructor() {
        super();
        
        this.studentPortfolioViewModel = new StudentPortfolioViewModel("student-portfolio-details");
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