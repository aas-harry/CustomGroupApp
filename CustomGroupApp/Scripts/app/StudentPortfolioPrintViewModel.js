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
        this.studentListInitialised = false;
        this.reportSelectorOption = true;
        this.studentSelectorOption = false;
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
            if (_this.studentListInitialised) {
                return;
            }
            var container = document.getElementById("student-list");
            _this.studentSelector.createTable(container, Enumerable.From(_this.testFile.students).Select(function (s) { return new StudentClass(s); }).ToArray(), []);
            _this.studentListInitialised = true;
        };
        this.printReports = function () {
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