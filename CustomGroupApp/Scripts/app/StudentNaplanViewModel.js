var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StudentNaplanViewModel = (function (_super) {
    __extends(StudentNaplanViewModel, _super);
    function StudentNaplanViewModel(elementName) {
        var _this = this;
        _super.call(this, elementName);
        this.reports = [
            new ReportItem("Student Naplan Report", "StudentNaplanView", ReportType.NationalProgressIndex, this)
        ];
        this.setAdditionalProperties = function (student) {
        };
        this.getReports = function () {
            return _this.reports;
        };
    }
    return StudentNaplanViewModel;
}(StudentPortfolio));
//# sourceMappingURL=StudentNaplanViewModel.js.map