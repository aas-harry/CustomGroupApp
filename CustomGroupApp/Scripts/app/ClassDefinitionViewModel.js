var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ClassDefinitionViewModel = (function (_super) {
    __extends(ClassDefinitionViewModel, _super);
    function ClassDefinitionViewModel(studentCount, onStudentCountChangedEvent) {
        var _this = this;
        if (studentCount === void 0) { studentCount = 0; }
        _super.call(this);
        this.studentCount = studentCount;
        this.classCount = 1;
        this.groupingHelper = new GroupingHelper();
        this.kendoHelper = new KendoHelper();
        this.importStudentLanguages = function () { };
        this.onClassCountChanged = function () {
            _this.bandSet.bands[0].setClassCount(_this.classCount);
            _this.classTableControl.init("classes-settings-container", _this.bandSet);
            var onStudentCountChangedEvent = _this.onStudentCountChangedEvent;
            if (onStudentCountChangedEvent != null) {
                onStudentCountChangedEvent(Enumerable.From(_this.bandSet.bands[0].classes).Sum(function (x) { return x.count; }));
            }
        };
        this.callOnStudentCountChangedEvent = function () {
            var onStudentCountChangedEvent = _this.onStudentCountChangedEvent;
            if (onStudentCountChangedEvent != null) {
                onStudentCountChangedEvent(Enumerable.From(_this.bandSet.bands[0].classes).Sum(function (x) { return x.count; }));
            }
        };
        this.genderChanged = function (gender, studentCount) {
            _this.bandSet.studentCount = studentCount;
            _this.bandSet.bands[0].studentCount = studentCount;
            _this.studentCount = studentCount;
            _this.onClassCountChanged();
        };
        this.showStudentLanguagePreferences = function () { };
        _super.prototype.init.call(this, this);
        this.onStudentCountChangedEvent = onStudentCountChangedEvent;
        this.classTableControl = new ClassTableControl(this.callOnStudentCountChangedEvent);
    }
    ClassDefinitionViewModel.prototype.saveOptions = function (source) {
        return true;
    };
    ClassDefinitionViewModel.prototype.loadOptions = function (source) {
        this.bandSet = source;
        _super.prototype.set.call(this, "classCount", source.bands[0].classes.length);
        this.classTableControl.init("classes-settings-container", this.bandSet);
        return true;
    };
    ClassDefinitionViewModel.prototype.getBandSet = function () {
        return this.bandSet;
    };
    return ClassDefinitionViewModel;
}(kendo.data.ObservableObject));
