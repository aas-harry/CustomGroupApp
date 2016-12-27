var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StudentPortfolioPrintViewModel = (function (_super) {
    __extends(StudentPortfolioPrintViewModel, _super);
    function StudentPortfolioPrintViewModel(testFile) {
        var _this = this;
        _super.call(this);
        this.testFile = testFile;
        this.studentSelector = new StudentSelector();
        this.reportSelectorOption = false;
        this.studentSelectorOption = true;
        this.schoolStudentRecordOption = true;
        this.naplanProgressIndexOption = true;
        this.mathsSkillsProfileListOption = true;
        this.mathsSkillsProfileTableOption = true;
        this.readingSkillsProfileListOption = true;
        this.readingSkillsProfileTableOption = true;
        this.writingCriteriaOption = true;
        this.markedWritingCriteriaOption = true;
        this.careerProfileOption = true;
        this.selectAllReports = function () {
            _this.setAllReports(true);
        };
        this.clearAllReports = function () {
            _this.setAllReports(false);
        };
        this.selectedReports = 1;
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
            var container = document.getElementById("student-list");
            _this.studentSelector.maxRows = 16;
            _this.studentSelector.createTable(container, Enumerable.From(_this.testFile.students).Select(function (s) { return new StudentClass(s); }).ToArray(), []);
        };
        this.downloadReports = function () {
            var dialog = $("#popup-window-container").data("kendoWindow");
            if (dialog) {
                dialog.close();
            }
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
        };
    }
    return StudentPortfolioPrintViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=StudentPortfolioPrintViewModel.js.map