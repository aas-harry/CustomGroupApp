var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StudentNaplanViewModel = (function (_super) {
    __extends(StudentNaplanViewModel, _super);
    function StudentNaplanViewModel(elementName) {
        _super.call(this, elementName);
        this.setAdditionalProperties = function (student) {
        };
        this.urlLink = "StudentNaplanView";
        this.reportName = "Student Naplan Report";
    }
    return StudentNaplanViewModel;
}(StudentPortfolio));
//# sourceMappingURL=StudentNaplanViewModel.js.map