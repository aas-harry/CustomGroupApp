var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var WritingCriteriaViewModel = (function (_super) {
    __extends(WritingCriteriaViewModel, _super);
    function WritingCriteriaViewModel(elementName) {
        var _this = this;
        _super.call(this, elementName);
        this.reports = [
            new ReportItem("Writing Criteria", "WritingCriteriaView", ReportType.WritingCriteria, this)
        ];
        this.getReports = function () {
            return _this.reports;
        };
    }
    return WritingCriteriaViewModel;
}(StudentPortfolio));
//# sourceMappingURL=WritingCriteriaViewModel.js.map