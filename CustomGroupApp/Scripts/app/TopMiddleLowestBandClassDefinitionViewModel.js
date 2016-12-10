var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TopMiddleLowestBandClassDefinitionViewModel = (function (_super) {
    __extends(TopMiddleLowestBandClassDefinitionViewModel, _super);
    function TopMiddleLowestBandClassDefinitionViewModel(classesDefn, onStudentCountChangedEvent) {
        var _this = this;
        _super.call(this, classesDefn, onStudentCountChangedEvent);
        this.bandCount = 3;
        this.classCount = 1;
        this.genderChanged = function (gender, studentCount) {
            _this.studentCount = studentCount;
            _this.bandSet.studentCount = studentCount;
            _this.addBandsAndClassesControl();
        };
        this.addBandsAndClassesControl = function () {
            _this.bandSet.createBands("Band", _this.studentCount, _this.bandCount);
            _this.bandTableControl.init("classes-settings-container", _this.bandSet);
        };
        this.reset();
        this.bandTableControl = new BandTableControl(this.callOnStudentCountChangedEvent);
    }
    TopMiddleLowestBandClassDefinitionViewModel.prototype.studentCountChanged = function (value) {
        this.bandSet.studentCount = value;
    };
    Object.defineProperty(TopMiddleLowestBandClassDefinitionViewModel.prototype, "studentInAllClassesCount", {
        get: function () {
            for (var _i = 0, _a = this.bandSet.bands; _i < _a.length; _i++) {
                var bandItem = _a[_i];
                bandItem.studentCount = Enumerable.From(bandItem.classes).Sum(function (x) { return x.count; });
            }
            return Enumerable.From(this.bandSet.bands).SelectMany(function (b) { return b.classes; }).Sum(function (x) { return x.count; });
        },
        enumerable: true,
        configurable: true
    });
    TopMiddleLowestBandClassDefinitionViewModel.prototype.reset = function () {
        this.bandSet = this.classesDefn.createTopMiddleBottomBandSet("class", this.classesDefn.studentCount);
        this.studentCount = this.classesDefn.studentCount;
        this.set("bandCount", 3);
        this.set("classCount", 1);
    };
    TopMiddleLowestBandClassDefinitionViewModel.prototype.loadOptions = function () {
        this.bandTableControl.init("classes-settings-container", this.bandSet);
        return true;
    };
    return TopMiddleLowestBandClassDefinitionViewModel;
}(CustomGroupBaseViewModel));
//# sourceMappingURL=TopMiddleLowestBandClassDefinitionViewModel.js.map