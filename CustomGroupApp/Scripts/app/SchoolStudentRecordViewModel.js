var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SchoolStudentRecordViewModel = (function (_super) {
    __extends(SchoolStudentRecordViewModel, _super);
    function SchoolStudentRecordViewModel(elementName) {
        var _this = this;
        _super.call(this, elementName);
        this.setAdditionalProperties = function (student) {
            _this.set("bornInAus", student.liveInAus);
            _this.set("secondLanguage", student.speak);
        };
        this.urlLink = "SchoolStudentRecordView";
        this.reportName = "School Student Record";
    }
    return SchoolStudentRecordViewModel;
}(StudentPortfolio));
//# sourceMappingURL=SchoolStudentRecordViewModel.js.map