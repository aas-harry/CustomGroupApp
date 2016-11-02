class StudentPortfolioViewModel extends kendo.data.ObservableObject {
    constructor(elementName: string) {
        super();

        this.registerReports();
        this.selectedReportViewModel = this.studentReports[0];
    }

    private registerReports = () => {
        this.studentReports.push(new SchoolStudentRecordViewModel("school-student-record"));
        this.studentReports.push(new StudentNaplanViewModel("student-naplan-report"));
    }

    private selectedReportViewModel: IStudentPortfolio;
    studentReports = new Array<IStudentPortfolio>();
    private student: Student;

    testFile: TestFile;

    setDatasource = (testFile: TestFile) => {
        this.testFile = testFile;
        
        for (let report of this.studentReports) {
            report.setDatasource(testFile);
        }
    }

    setReport = (reportViewModel: IStudentPortfolio) => {
        var self = this;
        this.selectedReportViewModel = reportViewModel;
        if (this.selectedReportViewModel.content) {
            this.setReportContent(this.selectedReportViewModel.content);
            return;
        }

        $.ajax({
            type: "POST",
            url: `Report\\${reportViewModel.urlLink}`,
            contentType: "application/json",    
            success(html) {
                reportViewModel.content = html;
                self.setReportContent(reportViewModel.content);
            },
            error(e) {

            }
        });
    }

    private setReportContent = (content: string) => {
        var container = document.getElementById("student-report");

        if (container.childElementCount > 0) {
            while (container.hasChildNodes()) {
                container.removeChild(container.lastChild);
            }
        }

        var reportContainer = document.createElement("div");
        reportContainer.id = "report-container";
        container.appendChild(reportContainer);
        $("#report-container").html(content);

        kendo.unbind("#student-report");
        kendo.bind($("#student-report"), this.selectedReportViewModel);

        this.showStudentReport();
    }

    showStudentReport = (student: Student = null) => {
        if (student) {
            this.student = student;
        }
        if (this.selectedReportViewModel) {
            this.selectedReportViewModel.setStudent(this.student);
        }
    }
}