var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CustomGroupListViewModel = (function (_super) {
    __extends(CustomGroupListViewModel, _super);
    function CustomGroupListViewModel(menuPanelElement, contentElement) {
        var _this = this;
        _super.call(this);
        this.customGroupListControl = new CustomGroupListControl();
        this.create = function () {
            var myself = _this;
            $.ajax({
                type: "POST",
                url: "CustomGroup\\CustomGroupWizard",
                contentType: "application/json",
                data: JSON.stringify({ 'testNumber': 101481 }),
                success: function (html) {
                    var content = document.createElement("div");
                    content.id = "custom-group-container";
                    myself.contentElement.appendChild(content);
                    $("#custom-group-container").html(html);
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
            _this.customGroupListControl.create(_this.menuPanelElement, _this.testInfo.customGroups, 800);
        };
        this.setDatasource = function (testFile) {
            _this.testInfo = testFile;
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