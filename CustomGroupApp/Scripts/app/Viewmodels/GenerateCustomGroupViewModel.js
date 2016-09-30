var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GenerateCustomGroupViewModel = (function (_super) {
    __extends(GenerateCustomGroupViewModel, _super);
    function GenerateCustomGroupViewModel(studentCount, onStudentCountChangedEvent) {
        var _this = this;
        if (studentCount === void 0) { studentCount = 0; }
        _super.call(this);
        this.studentCount = studentCount;
        this.groupingHelper = new GroupingHelper();
        this.kendoHelper = new KendoHelper();
        this.customClassGridCollection = new CustomClassGridCollection();
        this.showStudentLanguagePreferences = function () { };
        this.importStudentLanguages = function () { };
        this.callOnStudentCountChangedEvent = function () {
            var onStudentCountChangedEvent = _this.onStudentCountChangedEvent;
            if (onStudentCountChangedEvent != null) {
                onStudentCountChangedEvent(Enumerable.From(_this.bandSet.bands).SelectMany(function (b) { return b.classes; }).Sum(function (x) { return x.count; }));
            }
        };
        this.onStudentCountChangedEvent = onStudentCountChangedEvent;
        this.bandTableControl = new BandTableControl(this.callOnStudentCountChangedEvent);
    }
    GenerateCustomGroupViewModel.prototype.saveOptions = function (source) {
        return true;
    };
    GenerateCustomGroupViewModel.prototype.loadOptions = function (source) {
        this.bandSet = source;
        _super.prototype.set.call(this, "bandCount", source.bands.length);
        this.customClassGridCollection.initTable("#classes-settings-container", source.bands);
        return true;
    };
    GenerateCustomGroupViewModel.prototype.getBandSet = function () {
        return this.bandSet;
    };
    return GenerateCustomGroupViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=GenerateCustomGroupViewModel.js.map