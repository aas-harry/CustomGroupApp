var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StudentPortfolioAllViewModel = (function (_super) {
    __extends(StudentPortfolioAllViewModel, _super);
    function StudentPortfolioAllViewModel(elementName) {
        var _this = this;
        _super.call(this, elementName);
        this.reports = [
            new ReportItem("All Student Portfolio Reports", "StudentPortfolioAllView", ReportType.StudentPortfolioAllReport, this)
        ];
        this.setAdditionalProperties = function (student) {
        };
        this.getReports = function () {
            return _this.reports;
        };
        this.initReport = function (reportType) {
            _this.isViewReady = true;
        };
    }
    return StudentPortfolioAllViewModel;
}(StudentPortfolio));
//# sourceMappingURL=StudentPortfolioAllViewModel.js.map