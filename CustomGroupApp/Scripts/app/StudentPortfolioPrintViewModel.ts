class StudentPortfolioPrintViewModel extends kendo.data.ObservableObject {
    constructor(public testFile: TestFile, public user: { userId: number, email: string }) {
        super();

        this.set("careerProfileFlag", this.testFile.grade === 10);
    }

    private messageService = new MessageBoxDialog();
    popupWindow: kendo.ui.Window;
    studentSelector = new StudentSelector();
    reportSelectorOption = false;
    studentSelectorOption = true;
    schoolStudentRecordOption = true;
    naplanProgressIndexOption = false;
    mathsSkillsProfileListOption = true;
    mathsSkillsProfileTableOption = false;
    readingSkillsProfileListOption = true;
    readingSkillsProfileTableOption = false;
    writingCriteriaOption = true;
    markedWritingCriteriaOption = true;
    careerProfileOption = false;
    careerProfileFlag = false;

    selectAllReports = () => {
        this.setAllReports(true);
    }

    clearAllReports = () => {
        this.setAllReports(false);
    }

    selectedStudents = 1;

    get reports(): Array<number> {
        const reportList = Array<number>();
        if (this.schoolStudentRecordOption) {
            reportList.push(13);
        }
        if (this.naplanProgressIndexOption) {
            reportList.push(35);
        }
        if (this.mathsSkillsProfileListOption) {
            reportList.push(46);
        }
        if (this.mathsSkillsProfileTableOption) {
            reportList.push(47);
        }
        if (this.readingSkillsProfileListOption) {
            reportList.push(48);
        }
        if (this.readingSkillsProfileTableOption) {
            reportList.push(49);
        }
        if (this.writingCriteriaOption) {
            reportList.push(27);
        }
        if (this.markedWritingCriteriaOption) {
            reportList.push(28);
        }
        if (this.careerProfileFlag && this.careerProfileOption) {
            reportList.push(21);
        }
        return reportList;

    }

    showReports = () => {
        this.set("reportSelectorOption", true);
        this.set("studentSelectorOption", false);
    }

    showStudents = () => {
        this.set("studentSelectorOption", true);
        this.set("reportSelectorOption", false);
    }

    initStudentList = () => {
        const self = this;
        const container = document.getElementById("student-list");
        const rows = Math.ceil(container.offsetHeight / 20);
        this.studentSelector.maxRows = Math.max(19, rows);
        this.studentSelector.createTable(container,
            Enumerable.From(this.testFile.students).Select(s => new StudentClass(s)).ToArray(),
            [],
            (count) => {
                self.set("selectedStudents", 2);
            });
    }

    selectedReportChanged = (e: any) => {
        this.set("selectedReports", 2);
        if (!e.target || !e.target.checked) {
            return;
        }
        if (this.mathsSkillsProfileListOption && e.target.id === "mathsSkillsProfileListOption") {
            this.set("mathsSkillsProfileTableOption", false);
        }
        if (this.mathsSkillsProfileTableOption && e.target.id === "mathsSkillsProfileTableOption") {
            this.set("mathsSkillsProfileListOption", false);
        }
        if (this.readingSkillsProfileListOption && e.target.id === "readingSkillsProfileListOption") {
            this.set("readingSkillsProfileTableOption", false);
        }
        if (this.readingSkillsProfileTableOption && e.target.id === "readingSkillsProfileTableOption") {
            this.set("readingSkillsProfileListOption", false);
        }
       
    }

    downloadReports = () => {
        var dialog = $("#popup-window-container").data("kendoWindow");
        if (dialog) {
            this.exportReport();
            dialog.close();

            this.studentSelector.destroy();
        }
    }

    exportReport = () => {
        const self = this;

        if (this.reports.length === 0) {
            this.messageService.showInfoDialog("message-window-container",
                "Please select at least one report to export.",
                "Student Portfolio Reports",
                130,
                400);
            return;
        }

        if (this.selectedStudents === 2 && this.studentSelector.selectedStudents().length === 0) {
            this.messageService.showInfoDialog("message-window-container",
                "Please select at least one student to export.",
                "Student Portfolio Reports",
                130,
                400);
            return;
        }

        var reportViewModel = {
            testNumber: this.testFile.fileNumber,
            students: this.selectedStudents === 1
                ? Enumerable.From(this.testFile.students).Select(s => s.studentId).ToArray()
                : Enumerable.From(this.studentSelector.selectedStudents()).Select(s => s.studentId).ToArray(),
            reports: this.reports,
            sendEmail: false,
            email: this.user.email,
            outputType: "zip"
        };


        $.ajax({
            url: "..\\report\\studentportfolioreport",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(reportViewModel),
            success(data) {
                if (!data.Status) {
                    toastr.warning("Failed to export student portfolio report.");
                    return;
                }

                if (self.messageService) {
                    self.messageService.closeWindow();
                }

                if (!reportViewModel.sendEmail) {
                    window.open(data.UrlLink, "_blank");
                }
            },
            error() {
                toastr.warning("Failed to export student portfolio report.");
            }
        });

        this.messageService.showWaitDialog("message-window-container",
            "<i>Preparing student portfolio reports...</i><br/><br/>" +
            "This process could take few minutes and do not close this internet browser.<br/>" +
            "The student portfolio reports will be copied to your download folder once it finishes.",
            "Student Portfolio Reports",
            150,
            500);
    }

    setAllReports = (val: boolean) => {
        this.set("schoolStudentRecordOption", val);
        this.set("naplanProgressIndexOption", val);
        this.set("mathsSkillsProfileListOption", val);
        this.set("mathsSkillsProfileTableOption", val);
        this.set("readingSkillsProfileListOption", val);
        this.set("readingSkillsProfileTableOption", val);
        this.set("writingCriteriaOption", val);
        this.set("markedWritingCriteriaOption", val);
        this.set("careerProfileOption", val);
    }
}