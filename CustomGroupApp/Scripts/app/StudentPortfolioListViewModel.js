var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StudentPortfolioListViewModel = (function (_super) {
    __extends(StudentPortfolioListViewModel, _super);
    function StudentPortfolioListViewModel(testFile) {
        var _this = this;
        _super.call(this);
        this.setDatasource = function (testFile) {
            _this.testFile = testFile;
            _this.studentPortfolioViewModel.setDatasource(testFile);
        };
        this.showStudentReport = function (student) {
            _this.studentPortfolioViewModel.showStudentReport(student);
        };
        this.testFile = testFile;
        this.studentPortfolioViewModel = new StudentPortfolioViewModel(testFile);
    }
    return StudentPortfolioListViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=StudentPortfolioListViewModel.js.map