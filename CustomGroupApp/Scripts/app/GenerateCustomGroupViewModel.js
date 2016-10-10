var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GenerateCustomGroupViewModel = (function (_super) {
    __extends(GenerateCustomGroupViewModel, _super);
    function GenerateCustomGroupViewModel() {
        var _this = this;
        _super.call(this);
        this.groupingHelper = new GroupingHelper();
        this.kendoHelper = new KendoHelper();
        this.customClassGridCollection = new CustomClassGridCollection();
        this.hiddenClasses = [];
        this.showAllClasses = function () {
            _this.hiddenClasses = [];
            _this.customClassGridCollection.initTable("#classes-settings-container", _this.bandSet.bands);
        };
        this.hideClass = function (uid) {
            _this.hiddenClasses.push(uid);
            _this.customClassGridCollection.initTable("#classes-settings-container", _this.bandSet.bands, _this.hiddenClasses);
        };
    }
    GenerateCustomGroupViewModel.prototype.showClasses = function (source) {
        this.bandSet = source;
        this.customClassGridCollection.initTable("#classes-settings-container", source.bands);
        return true;
    };
    return GenerateCustomGroupViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=GenerateCustomGroupViewModel.js.map