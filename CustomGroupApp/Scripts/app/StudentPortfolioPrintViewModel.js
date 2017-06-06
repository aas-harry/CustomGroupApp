var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StudentPortfolioPrintViewModel = (function (_super) {
    __extends(StudentPortfolioPrintViewModel, _super);
    function StudentPortfolioPrintViewModel(testFile, user) {
        var _this = this;
        _super.call(this);
        this.testFile = testFile;
        this.user = user;
        this.messageService = new MessageBoxDialog();
        this.studentSelector = new StudentSelector();
        this.reportSelectorOption = false;
        this.studentSelectorOption = true;
        this.schoolStudentRecordOption = true;
        this.naplanProgressIndexOption = false;
        this.mathsSkillsProfileListOption = true;
        this.mathsSkillsProfileTableOption = false;
        this.readingSkillsProfileListOption = true;
        this.readingSkillsProfileTableOption = false;
        this.writingCriteriaOption = true;
        this.markedWritingCriteriaOption = true;
        this.careerProfileOption = false;
        this.careerProfileFlag = false;
        this.selectAllReports = function () {
            _this.setAllReports(true);
        };
        this.clearAllReports = function () {
            _this.setAllReports(false);
        };
        this.selectedStudents = 1;
        this.showReports = function () {
            _this.set("reportSelectorOption", true);
            _this.set("studentSelectorOption", false);
        };
        this.showStudents = function () {
            _this.set("studentSelectorOption", true);
            _this.set("reportSelectorOption", false);
        };
        this.initStudentList = function () {
            var self = _this;
            var container = document.getElementById("student-list");
            var rows = Math.ceil(container.offsetHeight / 20);
            _this.studentSelector.maxRows = Math.max(19, rows);
            _this.studentSelector.createTable(container, Enumerable.From(_this.testFile.students).Select(function (s) { return new StudentClass(s); }).ToArray(), [], function (count) {
                self.set("selectedStudents", 2);
            });
        };
        this.selectedReportChanged = function (e) {
            _this.set("selectedReports", 2);
            if (!e.target || !e.target.checked) {
                return;
            }
            if (_this.mathsSkillsProfileListOption && e.target.id === "mathsSkillsProfileListOption") {
                _this.set("mathsSkillsProfileTableOption", false);
            }
            if (_this.mathsSkillsProfileTableOption && e.target.id === "mathsSkillsProfileTableOption") {
                _this.set("mathsSkillsProfileListOption", false);
            }
            if (_this.readingSkillsProfileListOption && e.target.id === "readingSkillsProfileListOption") {
                _this.set("readingSkillsProfileTableOption", false);
            }
            if (_this.readingSkillsProfileTableOption && e.target.id === "readingSkillsProfileTableOption") {
                _this.set("readingSkillsProfileListOption", false);
            }
        };
        this.downloadReports = function () {
            var dialog = $("#popup-window-container").data("kendoWindow");
            if (dialog) {
                _this.exportReport();
                dialog.close();
                _this.studentSelector.destroy();
            }
        };
        this.exportReport = function () {
            var self = _this;
            if (_this.reports.length === 0) {
                _this.messageService.showInfoDialog("message-window-container", "Please select at least one report to export.", "Student Portfolio Reports", 130, 400);
                return;
            }
            if (_this.selectedStudents === 2 && _this.studentSelector.selectedStudents().length === 0) {
                _this.messageService.showInfoDialog("message-window-container", "Please select at least one student to export.", "Student Portfolio Reports", 130, 400);
                return;
            }
            var reportViewModel = {
                testNumber: _this.testFile.fileNumber,
                students: _this.selectedStudents === 1
                    ? Enumerable.From(_this.testFile.students).Select(function (s) { return s.studentId; }).ToArray()
                    : Enumerable.From(_this.studentSelector.selectedStudents()).Select(function (s) { return s.studentId; }).ToArray(),
                reports: _this.reports,
                sendEmail: false,
                email: _this.user.email,
                outputType: "zip"
            };
            $.ajax({
                url: "..\\report\\studentportfolioreport",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(reportViewModel),
                success: function (data) {
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
                error: function () {
                    toastr.warning("Failed to export student portfolio report.");
                }
            });
            _this.messageService.showWaitDialog("message-window-container", "<i>Preparing student portfolio reports...</i><br/><br/>" +
                "This process could take few minutes and do not close this internet browser.<br/>" +
                "The student portfolio reports will be copied to your download folder once it finishes.", "Student Portfolio Reports", 150, 500);
        };
        this.setAllReports = function (val) {
            _this.set("schoolStudentRecordOption", val);
            _this.set("naplanProgressIndexOption", val);
            _this.set("mathsSkillsProfileListOption", val);
            _this.set("mathsSkillsProfileTableOption", val);
            _this.set("readingSkillsProfileListOption", val);
            _this.set("readingSkillsProfileTableOption", val);
            _this.set("writingCriteriaOption", val);
            _this.set("markedWritingCriteriaOption", val);
            _this.set("careerProfileOption", val);
        };
        this.set("careerProfileFlag", this.testFile.grade === 10);
    }
    Object.defineProperty(StudentPortfolioPrintViewModel.prototype, "reports", {
        get: function () {
            var reportList = Array();
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
        },
        enumerable: true,
        configurable: true
    });
    return StudentPortfolioPrintViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=StudentPortfolioPrintViewModel.js.map