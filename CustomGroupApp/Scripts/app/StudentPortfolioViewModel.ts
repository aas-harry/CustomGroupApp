class StudentPortfolioViewModel extends kendo.data.ObservableObject {
    constructor(elementName: string) {
        super();

        this.registerReports();
        this.selectedReportViewModel = this.studentReports[0];
    }
    private kendoHelper = new KendoHelper();
    private registerReports = () => {
        this.studentReports.push(new SchoolStudentRecordViewModel("school-student-record"));
        this.studentReports.push(new StudentNaplanViewModel("student-naplan-report"));
    }

    private reportControls: kendo.ui.DropDownList;
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

    createReportList = (element: string) => {
        $(`#${element}`)
            .kendoDropDownList({
                dataSource: this.studentReports,
                dataTextField: "reportName",
                change: (e: kendo.ui.DropDownListChangeEvent) => {
                    const control = e.sender as kendo.ui.DropDownList;
                    const report = control.dataItem() as IStudentPortfolio;
                    if (report) {
                        this.setReport(report);
                    }
                }
            } as kendo.ui.DropDownListOptions);

        this.reportControls = $(`#${element}`).data("kendoDropDownList");

        this.reportControls.trigger("change");
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