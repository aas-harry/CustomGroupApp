var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CustomGroupListViewModel = (function (_super) {
    __extends(CustomGroupListViewModel, _super);
    function CustomGroupListViewModel(testNumber, menuPanelElement, contentElement) {
        var _this = this;
        _super.call(this);
        this.testNumber = testNumber;
        this.initMenuPanel = function (callback) {
            var myself = _this;
            $.ajax({
                type: "POST",
                url: "Customgroup\\GetCustomGroupListViewData",
                contentType: "application/json",
                data: JSON.stringify({ 'testNumber': _this.testNumber }),
                success: function (data) {
                    myself.setDatasource(data.Test, data.Results, data.StudentLanguages, data.CustomGroupSets);
                    var tmpCallback = callback;
                    if (tmpCallback) {
                        callback(true);
                    }
                },
                error: function (e) {
                    var tmpCallback = callback;
                    if (tmpCallback) {
                        callback(false, e);
                    }
                }
            });
        };
        this.setDatasource = function (test, results, languages, customGroups) {
            var testInfo = new TestFile();
            testInfo.set(test, results, languages, customGroups);
        };
        _super.prototype.init.call(this, this);
        this.menuPanelElement = menuPanelElement;
        this.contentElement = contentElement;
    }
    return CustomGroupListViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=CustomGroupListViewModel.js.map