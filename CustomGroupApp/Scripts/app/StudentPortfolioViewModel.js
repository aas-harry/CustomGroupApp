var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StudentPortfolioViewModel = (function (_super) {
    __extends(StudentPortfolioViewModel, _super);
    function StudentPortfolioViewModel(elementName) {
        var _this = this;
        _super.call(this);
        this.registerReports = function () {
            _this.studentReports.push(new SchoolStudentRecordViewModel("school-student-record"));
            _this.studentReports.push(new StudentNaplanViewModel("student-naplan-report"));
        };
        this.studentReports = new Array();
        this.setDatasource = function (testFile) {
            _this.testFile = testFile;
            for (var _i = 0, _a = _this.studentReports; _i < _a.length; _i++) {
                var report = _a[_i];
                report.setDatasource(testFile);
            }
        };
        this.setReport = function (reportViewModel) {
            var self = _this;
            _this.selectedReportViewModel = reportViewModel;
            if (_this.selectedReportViewModel.content) {
                _this.setReportContent(_this.selectedReportViewModel.content);
                return;
            }
            $.ajax({
                type: "POST",
                url: "Report\\" + reportViewModel.urlLink,
                contentType: "application/json",
                success: function (html) {
                    reportViewModel.content = html;
                    self.setReportContent(reportViewModel.content);
                },
                error: function (e) {
                }
            });
        };
        this.setReportContent = function (content) {
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
            kendo.bind($("#student-report"), _this.selectedReportViewModel);
            _this.showStudentReport();
        };
        this.showStudentReport = function (student) {
            if (student === void 0) { student = null; }
            if (student) {
                _this.student = student;
            }
            if (_this.selectedReportViewModel) {
                _this.selectedReportViewModel.setStudent(_this.student);
            }
        };
        this.registerReports();
        this.selectedReportViewModel = this.studentReports[0];
    }
    return StudentPortfolioViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=StudentPortfolioViewModel.js.map