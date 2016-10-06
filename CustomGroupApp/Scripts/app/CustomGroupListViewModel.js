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
        this.customGroupLisdtContol = new CustomGroupListControl();
        this.create = function () {
            var myself = _this;
            $.ajax({
                type: "POST",
                url: "CustomGroup\\CustomGroupWizard",
                contentType: "application/json",
                data: JSON.stringify({ 'testNumber': myself.testNumber }),
                success: function (html) {
                    var content = document.createElement("div");
                    content.id = "custom-group-wizard";
                    myself.contentElement.appendChild(content);
                    $("#custom-group-wizard").html(html);
                },
                error: function (e) {
                }
            });
        };
        this.regroup = function () {
        };
        this.edit = function () {
        };
        this.delete = function () {
        };
        this.showMenuPanel = function () {
        };
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
                    myself.customGroupLisdtContol.create(myself.menuPanelElement, myself.testInfo.customGroups);
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
            _this.testInfo = new TestFile();
            _this.testInfo.set(test, results, languages, customGroups);
        };
        _super.prototype.init.call(this, this);
        this.menuPanelElement = menuPanelElement;
        this.contentElement = contentElement;
    }
    Object.defineProperty(CustomGroupListViewModel.prototype, "customGroupViewMdel", {
        get: function () {
            if (!this._customGroupViewModel) {
                this._customGroupViewModel = new CustomGroupViewModel("", 80, "");
            }
            return this._customGroupViewModel;
        },
        enumerable: true,
        configurable: true
    });
    return CustomGroupListViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=CustomGroupListViewModel.js.map