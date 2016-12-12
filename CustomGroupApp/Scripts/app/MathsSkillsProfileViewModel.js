var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MathsSkillsProfileViewModel = (function (_super) {
    __extends(MathsSkillsProfileViewModel, _super);
    function MathsSkillsProfileViewModel(elementName) {
        var _this = this;
        _super.call(this, elementName);
        this.reports = [
            new ReportItem("Maths Skills Profile - List", "MathsSkillsProfileListView", ReportType.StudentMathsSkillsProfileList, this),
            new ReportItem("Maths Skills Profile - Table", "MathsSkillsProfileTableView", ReportType.StudentMathsSkillsProfileTable, this)
        ];
        this.getReports = function () {
            return _this.reports;
        };
    }
    return MathsSkillsProfileViewModel;
}(StudentPortfolio));
var CareerProfileViewModel = (function (_super) {
    __extends(CareerProfileViewModel, _super);
    function CareerProfileViewModel(elementName) {
        var _this = this;
        _super.call(this, elementName);
        this.reports = [
            new ReportItem("Career Profile", "CareerProfileView", ReportType.StudentCareerProfile, this),
        ];
        this.getReports = function () {
            return _this.reports;
        };
    }
    return CareerProfileViewModel;
}(StudentPortfolio));
//# sourceMappingURL=MathsSkillsProfileViewModel.js.map