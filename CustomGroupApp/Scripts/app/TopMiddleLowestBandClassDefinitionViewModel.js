var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TopMiddleLowestBandClassDefinitionViewModel = (function (_super) {
    __extends(TopMiddleLowestBandClassDefinitionViewModel, _super);
    function TopMiddleLowestBandClassDefinitionViewModel(studentCount) {
        if (studentCount === void 0) { studentCount = 0; }
        _super.call(this);
        this.studentCount = studentCount;
        this.classes = new kendo.data.ObservableArray([
            { classNo: 1, studentCount: 1 }
        ]);
        this.bandCount = 3;
        this.classCount = 1;
        this.bandSet = new TopMiddleLowestBandSet(null, this.studentCount);
        this.groupingHelper = new GroupingHelper();
        this.kendoHelper = new KendoHelper();
        this.bandNumericTextBoxes = new BandNumericTextBoxCollection();
    }
    TopMiddleLowestBandClassDefinitionViewModel.prototype.saveOptions = function (source) {
        return true;
    };
    TopMiddleLowestBandClassDefinitionViewModel.prototype.loadOptions = function (source) {
        this.bandSet = source;
        this.bandCount = source.bands.length;
        this.bandNumericTextBoxes.initTable("#classes-settings-container", source.bands);
        return true;
    };
    TopMiddleLowestBandClassDefinitionViewModel.prototype.getBandSet = function () {
        return this.bandSet;
    };
    return TopMiddleLowestBandClassDefinitionViewModel;
}(kendo.data.ObservableObject));
