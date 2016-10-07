var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BandClassDefinitionViewModel = (function (_super) {
    __extends(BandClassDefinitionViewModel, _super);
    function BandClassDefinitionViewModel(studentCount, onStudentCountChangedEvent) {
        var _this = this;
        if (studentCount === void 0) { studentCount = 0; }
        _super.call(this);
        this.studentCount = studentCount;
        this.bandCount = 1;
        this.classCount = 1;
        this.onBandCountChange = function () {
            _this.bandSet.createBands("Band", _this.studentCount, _this.bandCount);
            _this.bandTableControl.init("classes-settings-container", _this.bandSet);
        };
        this.showStudentLanguagePreferences = function () { };
        this.importStudents = function () { };
        this.genderChanged = function (gender, studentCount) {
            _this.bandSet.studentCount = studentCount;
            _this.studentCount = studentCount;
            _this.onBandCountChange();
        };
        this.callOnStudentCountChangedEvent = function () {
            var onStudentCountChangedEvent = _this.onStudentCountChangedEvent;
            if (onStudentCountChangedEvent != null) {
                onStudentCountChangedEvent(Enumerable.From(_this.bandSet.bands).SelectMany(function (b) { return b.classes; }).Sum(function (x) { return x.count; }));
            }
        };
        this.onStudentCountChangedEvent = onStudentCountChangedEvent;
        this.bandTableControl = new BandTableControl(this.callOnStudentCountChangedEvent);
    }
    BandClassDefinitionViewModel.prototype.saveOptions = function (source) {
        return true;
    };
    BandClassDefinitionViewModel.prototype.loadOptions = function (source) {
        this.bandSet = source;
        _super.prototype.set.call(this, "bandCount", source.bands.length);
        this.bandTableControl.init("classes-settings-container", source);
        return true;
    };
    BandClassDefinitionViewModel.prototype.getBandSet = function () {
        return this.bandSet;
    };
    return BandClassDefinitionViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=BandClassDefinitionViewModel.js.map