var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GenerateCustomGroupViewModel = (function (_super) {
    __extends(GenerateCustomGroupViewModel, _super);
    function GenerateCustomGroupViewModel(parentViewModel) {
        var _this = this;
        _super.call(this);
        this.groupingHelper = new GroupingHelper();
        this.kendoHelper = new KendoHelper();
        this.onHideClass = function (classItem) {
            _this.parentViewModel.set("hasHiddenClasses", true);
        };
        this.onClassChanged = function (classItem) {
            console.log("onClassChanged: " + classItem.groupSetid, classItem.name);
        };
        this.showAllClasses = function () {
            _this.customClassGridCollection.showAllClasses();
        };
        this.parentViewModel = parentViewModel;
        this.customClassGridCollection = new CustomClassGridCollection();
        this.customClassGridCollection.hideClassCallback = this.onHideClass;
        this.customClassGridCollection.classChangedCallback = this.onClassChanged;
    }
    GenerateCustomGroupViewModel.prototype.showClasses = function (source) {
        this.bandSet = source;
        this.customClassGridCollection.initTable("#classes-settings-container", source.bands, false, []);
        return true;
    };
    return GenerateCustomGroupViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=GenerateCustomGroupViewModel.js.map