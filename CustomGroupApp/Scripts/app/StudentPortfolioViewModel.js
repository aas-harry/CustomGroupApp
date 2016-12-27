var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StudentPortfolioViewModel = (function (_super) {
    __extends(StudentPortfolioViewModel, _super);
    function StudentPortfolioViewModel(testFile) {
        var _this = this;
        _super.call(this);
        this.testFile = testFile;
        this.kendoHelper = new KendoHelper();
        this.registerReportViewModels = function () {
            _this.reportViewModels.push(new SchoolStudentRecordViewModel("school-student-record"));
            _this.reportViewModels.push(new StudentNaplanViewModel("student-naplan-report"));
            _this.reportViewModels.push(new MathsSkillsProfileViewModel("maths-skills-profile"));
            _this.reportViewModels.push(new ReadingSkillsProfileViewModel("reading-skills-profile"));
            _this.reportViewModels.push(new WritingCriteriaViewModel("writing-criteria-reports"));
            if (_this.testFile.grade === 10) {
                _this.reportViewModels.push(new CareerProfileViewModel("student-career-profile"));
            }
            _this.studentReports = [];
            Enumerable.From(_this.reportViewModels).SelectMany(function (s) { return s.getReports(); }).ForEach(function (s) { return _this.studentReports.push(s); });
        };
        this.reportViewModels = new Array();
        this.studentReports = new Array();
        this.setDatasource = function (testFile) {
            _this.testFile = testFile;
            for (var _i = 0, _a = _this.reportViewModels; _i < _a.length; _i++) {
                var report = _a[_i];
                report.setDatasource(_this.testFile);
            }
        };
        this.createReportList = function (elementName) {
            var container = document.getElementById(elementName);
            var reportElementName = "report-list";
            var label = document.createElement("span");
            label.textContent = "Reports:";
            label.setAttribute("style", "margin: 0 0 0 5px");
            container.appendChild(label);
            var customGroupComboBox = document.createElement("div");
            customGroupComboBox.id = reportElementName;
            customGroupComboBox.setAttribute("style", "width: 270px");
            container.appendChild(customGroupComboBox);
            $("#" + reportElementName)
                .kendoDropDownList({
                dataSource: _this.studentReports,
                dataTextField: "name",
                change: function (e) {
                    var control = e.sender;
                    var report = control.dataItem();
                    if (report) {
                        _this.setReport(report);
                    }
                }
            });
            _this.reportControls = $("#" + reportElementName).data("kendoDropDownList");
            _this.reportControls.list.width(350);
            _this.reportControls.trigger("change");
        };
        this.setReport = function (reportItem) {
            var self = _this;
            _this.selectedReportItem = reportItem;
            var content = reportItem.content;
            if (content) {
                _this.setReportContent(content);
                return;
            }
            _this.loadingContent("loading report...");
            $.ajax({
                type: "POST",
                url: "Report\\" + reportItem.urlLink,
                contentType: "application/json",
                success: function (html) {
                    reportItem.content = html;
                    self.setReportContent(html);
                },
                error: function (e) {
                }
            });
        };
        this.showStudentReport = function (student) {
            if (student === void 0) { student = null; }
            if (student) {
                _this.student = student;
            }
            if (!_this.selectedReportItem.reportViewModel.isViewReady) {
                return;
            }
            if (_this.selectedReportItem) {
                _this.selectedReportItem.reportViewModel.setStudent(_this.student, true);
            }
        };
        this.printReports = function () {
            var self = _this;
            $.ajax({
                type: "POST",
                url: "Report\\StudentPortfolioPrintDialog",
                success: function (html) {
                    self.openDialog(html);
                }
            });
        };
        this.openDialog = function (html) {
            // create window content
            var window = document.getElementById("popup-window-container");
            if (window.childElementCount > 0) {
                while (window.hasChildNodes()) {
                    window.removeChild(window.lastChild);
                }
            }
            var container = document.createElement("div");
            container.id = "container-id";
            $("#popup-window-container").append(html);
            _this.popupWindow = $("#" + window.id)
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
            $("#" + window.id).parent().addClass("h-window-caption");
            _this.popupWindow.center().open();
        };
        this.loadingContent = function (message) {
            var container = _this.clearConntent();
            _this.addContent(container, "<div style='margin: 20px'>" + message + "</div>");
        };
        this.clearConntent = function () {
            var container = document.getElementById("student-report");
            // Remove previous report 
            if (container.childElementCount > 0) {
                while (container.hasChildNodes()) {
                    container.removeChild(container.lastChild);
                }
            }
            return container;
        };
        this.addContent = function (container, content) {
            var reportContainer = document.createElement("div");
            reportContainer.id = "report-container";
            container.appendChild(reportContainer);
            $("#report-container").html(content);
        };
        this.setReportContent = function (content) {
            var self = _this;
            _this.selectedReportItem.reportViewModel.setAdditionalData(function (status) {
                if (!status) {
                    self.loadingContent("Failed to load report.");
                    return;
                }
                var container = self.clearConntent();
                self.addContent(container, content);
                // initialise report elements
                self.selectedReportItem.reportViewModel.initReport(self.selectedReportItem.reportType);
                kendo.unbind("#student-report");
                kendo.bind($("#student-report"), self.selectedReportItem.reportViewModel);
                self.showStudentReport();
            });
        };
        this.printViewModel = new StudentPortfolioPrintViewModel(testFile);
        this.registerReportViewModels();
        this.setDatasource(this.testFile);
        this.selectedReportItem = this.studentReports[0];
    }
    return StudentPortfolioViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=StudentPortfolioViewModel.js.map