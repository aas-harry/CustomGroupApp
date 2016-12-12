var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ReadingSkillsProfileViewModel = (function (_super) {
    __extends(ReadingSkillsProfileViewModel, _super);
    function ReadingSkillsProfileViewModel(elementName) {
        var _this = this;
        _super.call(this, elementName);
        this.reports = [
            new ReportItem("Reading Skills Profile - List", "ReadingSkillsProfileListView", ReportType.StudentReadingSkillsProfileList, this),
            new ReportItem("Reading Skills Profile - Table", "ReadingMathsSkillsProfileTableView", ReportType.StudentReadingSkillsProfileTable, this)
        ];
        this.getReports = function () {
            return _this.reports;
        };
    }
    return ReadingSkillsProfileViewModel;
}(StudentPortfolio));
//# sourceMappingURL=ReadingSkillsProfileViewModel.js.map