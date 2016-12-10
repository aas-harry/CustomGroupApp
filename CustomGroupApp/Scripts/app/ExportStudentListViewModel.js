var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ExportStudentListViewModel = (function (_super) {
    __extends(ExportStudentListViewModel, _super);
    function ExportStudentListViewModel(testFile) {
        var _this = this;
        _super.call(this);
        this.testFile = testFile;
        this.popupWindowElementName = "popup-window-container";
        this.groupingHelper = new GroupingHelper();
        this.downloadTemplate = function () {
            _this.groupingHelper.downloadTemplateFile("DownloadSchoolClassTemplate", _this.testFile.fileNumber);
        };
    }
    return ExportStudentListViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=ExportStudentListViewModel.js.map