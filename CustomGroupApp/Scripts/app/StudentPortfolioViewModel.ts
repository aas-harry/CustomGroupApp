class StudentPortfolioViewModel extends kendo.data.ObservableObject {
    constructor(public testFile: TestFile, user: { userId: number, email: string }) {
        super();

        this.printViewModel = new StudentPortfolioPrintViewModel(testFile, user);
        this.registerReportViewModels();
        this.setDatasource(this.testFile);
        this.selectedReportItem = this.studentReports[0];
        if (user) {
            this.loginUser = user;
        }
    }

    private width: number;
    private height: number;
    private loginUser: { email: string, userId: number };
    private kendoHelper = new KendoHelper();
    private popupWindow: kendo.ui.Window;

    private registerReportViewModels = () => {
        this.reportViewModels.push(new StudentDetailsViewModel("student-details-container"));
        this.reportViewModels.push(new SchoolStudentRecordViewModel("school-student-record-container"));
        this.reportViewModels.push(new StudentNaplanViewModel("student-naplan-container"));
        this.reportViewModels.push(new StudentMathsSkillsProfileViewModel("student-maths-profile-container"));
        this.reportViewModels.push(new StudentReadingSkillsProfileViewModel("student-reading-profile-container"));
        this.reportViewModels.push(new StudentWritingCriteriaViewModel("student-writing-criteria-container"));
        if (this.testFile.grade === 10) {
            this.reportViewModels.push(new StudentCareerProfileViewModel("student-career-profile-container"));
        }


        this.studentReports = [];
        Enumerable.From(this.reportViewModels).SelectMany(s => s.getReports()).ForEach(s => this.studentReports.push(s));

    }

    private printViewModel: StudentPortfolioPrintViewModel;
    private reportControls: kendo.ui.DropDownList;
    private reportMenuItems: kendo.ui.ListView;
    private selectedReportItem: ReportItem;
    private reportViewModels = new Array<IStudentPortfolio>();
    studentReports = new Array<ReportItem>();
    private student: Student;

    setDatasource = (testFile: TestFile) => {
        this.testFile = testFile;
        for (let report of this.reportViewModels) {
            report.setDatasource(this.testFile);
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

    setReportByType = (reportType: ReportType): boolean => {

        var reportItem = Enumerable.From(this.studentReports).FirstOrDefault(null, r => r.reportType === reportType);
        if (!reportItem) {
            return false;
        }
        this.setReport(reportItem);
        return true;
    }

    setReport = (reportItem: ReportItem) => {
        if (!reportItem) {
            reportItem = this.studentReports[0];
        }
        var self = this;
        this.selectedReportItem = reportItem;
        const content = reportItem.content;
        if (content) {
            this.setReportContent(content);
            return;
        }

        this.loadingContent("loading report...");

        $.ajax({
            type: "POST",
            url: `..\\Report\\${reportItem.urlLink}`,
            contentType: "application/json",
            success(html) {
                reportItem.content = html;
                self.setReportContent(html);
            },
            error(e) {

            }
        });
    }

    showStudentReport = (student: Student = null) => {
        if (student) {
            this.student = student;
        }
        if (!this.selectedReportItem.reportViewModel.isViewReady) {
            return;
        }
        if (this.selectedReportItem) {
            this.selectedReportItem.reportViewModel.setStudent(this.student, true);
        }
    }

    printReports = () => {
        const self = this;
        $.ajax({
            type: "POST",
            url: "..\\Report\\StudentPortfolioPrintDialog",
            success(html) {
                self.openDialog(html);
            }
        });
    }

    resizeWindow = (width: number, height: number) => {
        this.width = width;
        this.height = height;

        if (!this.selectedReportItem || !this.selectedReportItem.reportViewModel) {
            return;
        }
        this.selectedReportItem.reportViewModel.resizeContent(width, height);
    }

    openDialog = (html: string) => {
        // create window content
        const window = document.getElementById("popup-window-container");

        if (window.childElementCount > 0) {
            while (window.hasChildNodes()) {
                window.removeChild(window.lastChild);
            }
        }

        const container = document.createElement("div");
        container.id = "container-id";

        $("#popup-window-container").append(html);

        this.popupWindow = $(`#${window.id}`)
            .kendoWindow({
                width: "700px",
                height: "625px",
                modal: true,
                scrollable: true,
                actions: ["Close"],
                resizable: false,
                title: "Export Student Reports"
            })
            .data("kendoWindow");


        $(`#${window.id}`).parent().addClass("h-window-caption");
        this.popupWindow.center().open();
    }

    private loadingContent = (message: string) => {
        const container = this.clearContent();
        if (container) {
            this.addContent(container, "<div style='margin: 20px'>" + message + "</div>");
        }
    }

    private clearContent = (): HTMLElement => {
        var container = document.getElementById("student-report");
        if (!container) {
            return null;
        }

        // Remove previous report 
        if (container.childElementCount > 0) {
            while (container.hasChildNodes()) {
                container.removeChild(container.lastChild);
            }
        }
        return container;
    }

    private addContent = (container: HTMLElement, content: string) => {
        var reportContainer = document.createElement("div");
        reportContainer.id = "report-container";
        container.appendChild(reportContainer);
        $("#report-container").html(content);
    }

    private setReportContent = (content: string) => {
        const self = this;
        this.selectedReportItem.reportViewModel.setAdditionalData(status => {
            if (!status) {
                self.loadingContent("Failed to load report.");
                return;
            }
            const container = this.clearContent();
            self.addContent(container, content);

            // initialise report elements
            self.selectedReportItem.reportViewModel.initReport(self.selectedReportItem.reportType, self.width, self.height);

            kendo.unbind("#student-report");
            kendo.bind($("#student-report"), self.selectedReportItem.reportViewModel);

            self.showStudentReport();

            $(window).trigger("resize");
        });
    }

}