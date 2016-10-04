var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CustomGroupListViewModel = (function (_super) {
    __extends(CustomGroupListViewModel, _super);
    function CustomGroupListViewModel(testNumber) {
        _super.call(this);
        this.testNumber = testNumber;
        _super.prototype.init.call(this, this);
    }
    return CustomGroupListViewModel;
}(kendo.data.ObservableObject));
