var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ClassDefinitionViewModel = (function (_super) {
    __extends(ClassDefinitionViewModel, _super);
    function ClassDefinitionViewModel(classesDefn, onStudentCountChangedEvent) {
        var _this = this;
        _super.call(this, classesDefn, onStudentCountChangedEvent);
        this.classCount = 3;
        this.groupingHelper = new GroupingHelper();
        this.kendoHelper = new KendoHelper();
        this.genderChanged = function (gender, studentCount) {
            _this.studentCount = studentCount;
            _this.addBandsAndClassesControl();
        };
        this.onClassCountChanged = function (count) {
            _this.classCount = count;
            _this.addBandsAndClassesControl();
        };
        this.addBandsAndClassesControl = function () {
            _this.bandSet.bands[0].setClassCount(_this.classCount);
            _this.classTableControl.init("classes-settings-container", _this.bandSet);
        };
        this.bandSet = classesDefn.createBandSet("class", classesDefn.studentCount);
        this.bandSet.bands[0].setClassCount(3);
        this.studentCount = classesDefn.studentCount;
        this.classTableControl = new ClassTableControl(this.callOnStudentCountChangedEvent);
    }
    ClassDefinitionViewModel.prototype.studentCountChanged = function (value) {
        this.bandSet.studentCount = value;
        this.bandSet.bands[0].studentCount = value;
    };
    Object.defineProperty(ClassDefinitionViewModel.prototype, "studentInAllClassesCount", {
        get: function () {
            return Enumerable.From(this.bandSet.bands[0].classes).Sum(function (x) { return x.count; });
        },
        enumerable: true,
        configurable: true
    });
    ClassDefinitionViewModel.prototype.loadOptions = function () {
        this.classTableControl.init("classes-settings-container", this.bandSet);
    };
    return ClassDefinitionViewModel;
}(CustomGroupBaseViewModel));
//# sourceMappingURL=ClassDefinitionViewModel.js.map