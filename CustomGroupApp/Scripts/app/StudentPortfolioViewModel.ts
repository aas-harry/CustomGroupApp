class StudentPortfolioViewModel extends kendo.data.ObservableObject {
    constructor(elementName: string) {
        super();

        this.registerReportViewModels();
        this.selectedReportItem = this.studentReports[0];
    }
    private kendoHelper = new KendoHelper();
    private registerReportViewModels = () => {
        this.reportViewModels.push(new SchoolStudentRecordViewModel("school-student-record"));
        this.reportViewModels.push(new StudentNaplanViewModel("student-naplan-report"));
        this.reportViewModels.push(new MathsSkillsProfileViewModel("maths-skills-profile"));
        this.reportViewModels.push(new ReadingSkillsProfileViewModel("reading-skills-profile"));
        this.reportViewModels.push(new WritingCriteriaViewModel("writing-criteria-reports"));
        this.reportViewModels.push(new CareerProfileViewModel("student-career-profile"));

        this.studentReports = [];
        Enumerable.From(this.reportViewModels).SelectMany(s=> s.getReports()).ForEach(s=> this.studentReports.push(s));
       
    }

    private reportControls: kendo.ui.DropDownList;
    private selectedReportItem: ReportItem;
    private reportViewModels = new Array<IStudentPortfolio>();
    studentReports = new Array<ReportItem>();
    private student: Student;

    testFile: TestFile;

    setDatasource = (testFile: TestFile) => {
        this.testFile = testFile;
        
        for (let report of this.reportViewModels) {
            report.setDatasource(testFile);
        }
    }

    createReportList = (elementName: string) => {

        const container = document.getElementById(elementName);
        const reportElementName = "report-list";

        const label = document.createElement("span");
        label.textContent = "Reports:";
        label.setAttribute("style", "margin: 0 0 0 5px");
        container.appendChild(label);

        const customGroupComboBox = document.createElement("div");
        customGroupComboBox.id = reportElementName;
        customGroupComboBox.setAttribute("style", "width: 270px");
        container.appendChild(customGroupComboBox);

        $(`#${reportElementName}`)
            .kendoDropDownList({
                dataSource: this.studentReports,
                dataTextField: "name",
                change: (e: kendo.ui.DropDownListChangeEvent) => {
                    const control = e.sender as kendo.ui.DropDownList;
                    const report = control.dataItem() as ReportItem;
                    if (report) {
                        this.setReport(report);
                    }
                }
            } as kendo.ui.DropDownListOptions);

        this.reportControls = $(`#${reportElementName}`).data("kendoDropDownList");
        this.reportControls.list.width(350);

        this.reportControls.trigger("change");
    }
    
    setReport = (reportItem: ReportItem) => {
        var self = this;
        this.selectedReportItem = reportItem;
        const content = reportItem.content;
        if (content) {
            this.setReportContent(content);
            return;
        }

        $.ajax({
            type: "POST",
            url: `Report\\${reportItem.urlLink}`,
            contentType: "application/json",    
            success(html) {
                reportItem.content = html;
                self.setReportContent(html);
            },
            error(e) {

            }
        });
    }

    private setReportContent = (content: string) => {
        var container = document.getElementById("student-report");

        // Remove previous report 
        if (container.childElementCount > 0) {
            while (container.hasChildNodes()) {
                container.removeChild(container.lastChild);
            }
        }

        var reportContainer = document.createElement("div");
        reportContainer.id = "report-container";
        container.appendChild(reportContainer);
        $("#report-container").html(content);

        // initialise report elements
        this.selectedReportItem.reportViewModel.initReport(this.selectedReportItem.reportType);

        kendo.unbind("#student-report");
        kendo.bind($("#student-report"), this.selectedReportItem.reportViewModel);

        this.showStudentReport();
    }

    showStudentReport = (student: Student = null) => {
        if (student) {
            this.student = student;
        }
        if (this.selectedReportItem) {
            this.selectedReportItem.reportViewModel.setStudent(this.student);
        }
    }
}