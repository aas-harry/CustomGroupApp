var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BandClassDefinitionViewModel = (function (_super) {
    __extends(BandClassDefinitionViewModel, _super);
    function BandClassDefinitionViewModel(studentCount) {
        var _this = this;
        if (studentCount === void 0) { studentCount = 0; }
        _super.call(this);
        this.studentCount = studentCount;
        this.classes = new kendo.data.ObservableArray([
            { classNo: 1, studentCount: 1 }
        ]);
        this.bandCount = 1;
        this.classCount = 1;
        this.getClasses = function () {
            var classes = new Array();
            _this.classes.forEach(function (val) {
                var classCnt = $("#class-" + val.uid).data("kendoNumericTextBox");
                classes.push(classCnt.value());
            });
            return classes;
        };
        this.groupingHelper = new GroupingHelper();
        this.kendoHelper = new KendoHelper();
        this.bandNumericTextBoxes = new BandNumericTextBoxCollection();
        this.onBandCountChange = function () {
            _this.bandSet.createBands("Band", _this.studentCount, _this.bandCount);
            _this.bandNumericTextBoxes.initTable("#classes-settings-container", _this.bandSet.bands);
        };
        this.createNumberInputField = function (elementId) {
            var element = document.createElement("input");
            element.type = "text";
            element.setAttribute("style", "width: 100px");
            element.id = elementId;
            return element;
        };
    }
    BandClassDefinitionViewModel.prototype.saveOptions = function (source) {
        return true;
    };
    BandClassDefinitionViewModel.prototype.loadOptions = function (source) {
        this.bandSet = source;
        _super.prototype.set.call(this, "bandCount", source.bands.length);
        this.bandNumericTextBoxes.initTable("#classes-settings-container", source.bands);
        return true;
    };
    BandClassDefinitionViewModel.prototype.getBandSet = function () {
        return this.bandSet;
    };
    return BandClassDefinitionViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=BandClassDefinitionViewModel.js.map