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
        this.schoolStudentRecordViewModel = new SchoolStudentRecordViewModel("school-student-record");
        this.setDatasource = function (testFile) {
            _this.testFile = testFile;
            _this.schoolStudentRecordViewModel.setDatasource(testFile);
        };
        this.showStudentReport = function (student) {
            _this.student = student;
            _this.schoolStudentRecordViewModel.setStudent(student);
        };
    }
    return StudentPortfolioViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=StudentPortfolioViewModel.js.map