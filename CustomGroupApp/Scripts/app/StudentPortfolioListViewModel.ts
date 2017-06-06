class StudentPortfolioListViewModel extends kendo.data.ObservableObject {
    constructor(testFile: TestFile, user: {userId: number, email: string}) {
        super();

        this.testFile = testFile;
        this.studentPortfolioViewModel = new StudentPortfolioViewModel(testFile, user);
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