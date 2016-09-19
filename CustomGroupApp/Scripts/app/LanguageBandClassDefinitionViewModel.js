var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LanguageBandClassDefinitionViewModel = (function (_super) {
    __extends(LanguageBandClassDefinitionViewModel, _super);
    function LanguageBandClassDefinitionViewModel(studentCount) {
        var _this = this;
        if (studentCount === void 0) { studentCount = 0; }
        _super.call(this);
        this.studentCount = studentCount;
        this.classes = new kendo.data.ObservableArray([
            { classNo: 1, studentCount: 1 }
        ]);
        this.bandCount = 3;
        this.classCount = 1;
        this.getClasses = function () {
            var classes = new Array();
            _this.classes.forEach(function (val) {
                var classCnt = $("#class" + val.classNo).data("kendoNumericTextBox");
                classes.push(classCnt.value());
            });
            return classes;
        };
        this.bandSet = new TopMiddleLowestBandSet(null, this.studentCount);
        this.groupingHelper = new GroupingHelper();
        this.kendoHelper = new KendoHelper();
        this.bandNumericTextBoxes = new BandNumericTextBoxCollection();
    }
    LanguageBandClassDefinitionViewModel.prototype.saveOptions = function (source) {
        return true;
    };
    LanguageBandClassDefinitionViewModel.prototype.loadOptions = function (source) {
        this.bandSet = source;
        this.bandCount = source.bands.length;
        this.bandNumericTextBoxes.initTable("#classes-settings-container", source.bands);
        return true;
    };
    return LanguageBandClassDefinitionViewModel;
}(kendo.data.ObservableObject));
