var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="entities.ts" />
var ReportItem = (function () {
    function ReportItem(name, urlLink, reportType, reportViewModel) {
        this.name = name;
        this.urlLink = urlLink;
        this.reportType = reportType;
        this.reportViewModel = reportViewModel;
    }
    return ReportItem;
}());
var StudentPortfolio = (function (_super) {
    __extends(StudentPortfolio, _super);
    function StudentPortfolio(elementName) {
        var _this = this;
        _super.call(this);
        this.elementName = elementName;
        this.isViewReady = false;
        this.reset = function () {
            _this.testFile = null;
            _this.student = null;
            _this.isTestFileSet = false;
        };
        this.setDatasource = function (testFile) {
            _this.reset();
            _this.testFile = testFile;
            _this.isTestFileSet = true;
        };
        // Use this function to set other properties in the subclasses
        this.setAdditionalProperties = function (student) {
        };
        // Overwrite this function if the report needs to get addtional data.
        // Testfile data does not have enough data to produce the report
        this.setAdditionalData = function (callback) {
            if (callback) {
                callback(true);
            }
        };
        this.getContent = function (reportType) {
            var report = Enumerable.From(_this.getReports())
                .FirstOrDefault(null, function (x) { return x.reportType === reportType; });
            return report ? report.content : null;
        };
        this.setContent = function (reportType, content) {
            var report = Enumerable.From(_this.getReports())
                .FirstOrDefault(null, function (x) { return x.reportType === reportType; });
            if (report) {
                report.content = content;
            }
        };
        this.getReports = function () { return []; };
        this.getUrlLink = function (reportType) {
            var report = Enumerable.From(_this.getReports())
                .FirstOrDefault(null, function (x) { return x.reportType === reportType; });
            return report ? report.urlLink : "";
        };
        this.initReport = function (reportType, width, height) {
            _this.isViewReady = true;
        };
        this.resizeContent = function (width, height) {
            var container = document.getElementById(_this.elementName);
            if (!container) {
                return;
            }
            container.setAttribute("style", "overflow: auto; height: " + height + "px");
            _this.resizeOtherContent(width, height);
        };
        this.resizeOtherContent = function (width, height) {
            // overwrite this in subclass
        };
        this.elementName = elementName;
        this.sex = "M";
    }
    StudentPortfolio.prototype.setStudent = function (student, refresh) {
        if (refresh === void 0) { refresh = false; }
        if (!student) {
            return;
        }
        if (!refresh && this.student && student.studentId === this.student.studentId) {
            return;
        }
        this.student = student;
        this.set("name", student.name);
        this.set("dob", student.dobString);
        var year = Math.floor(student.ca);
        var month = Math.round((student.ca - year) * 100);
        this.set("age", (year + " Years") + (month <= 0 ? "" : (" " + month + " Month") + (month > 1 ? "s" : "")));
        this.set("sex", student.sex === "M" ? "Male" : "Female");
        this.set("speak", student.speak);
        this.set("liveInAus", student.liveInAus);
        this.set("schoolStudentId", student.schoolStudentId);
        this.set("hasSchoolStudentId", student.hasSchoolStudentId);
        if (this.hasSchoolStudentId) {
            this.set("studentInfo", "Dob: " + this.dob + ",  Student ID: " + this.schoolStudentId);
        }
        else {
            this.set("studentInfo", "Dob: " + this.dob);
        }
        this.set("yearLevel", this.testFile.yearLevel);
        this.set("schoolName", this.testFile.school.name);
        this.setAdditionalProperties(student);
    };
    return StudentPortfolio;
}(kendo.data.ObservableObject));
//# sourceMappingURL=IStudentPortfolio.js.map