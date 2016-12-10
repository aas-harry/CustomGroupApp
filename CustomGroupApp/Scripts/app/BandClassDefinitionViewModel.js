var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CustomGroupBaseViewModel = (function (_super) {
    __extends(CustomGroupBaseViewModel, _super);
    function CustomGroupBaseViewModel(classesDefn, onStudentCountChangedEvent) {
        var _this = this;
        _super.call(this);
        // ReSharper disable once InconsistentNaming
        this._studentCount = 0;
        this.callOnStudentCountChangedEvent = function () {
            var onStudentCountChangedEvent = _this.onStudentCountChangedEvent;
            if (onStudentCountChangedEvent != null) {
                onStudentCountChangedEvent(_this.studentInAllClassesCount);
            }
        };
        this.addBandsAndClassesControl = function () { };
        this.genderChanged = function (gender, studentCount) {
            _this.studentCount = studentCount;
        };
        this.onClassCountChanged = function (count) { };
        this.onBandCountChanged = function (count) { };
        this.classesDefn = classesDefn;
        this.onStudentCountChangedEvent = onStudentCountChangedEvent;
    }
    Object.defineProperty(CustomGroupBaseViewModel.prototype, "studentCount", {
        get: function () {
            return this._studentCount;
        },
        set: function (value) {
            this._studentCount = value;
            this.studentCountChanged(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupBaseViewModel.prototype, "studentInAllClassesCount", {
        get: function () {
            return 0;
        },
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    CustomGroupBaseViewModel.prototype.studentCountChanged = function (value) {
    };
    CustomGroupBaseViewModel.prototype.reset = function () { };
    CustomGroupBaseViewModel.prototype.loadOptions = function () { };
    CustomGroupBaseViewModel.prototype.getBandSet = function () { return this.bandSet; };
    return CustomGroupBaseViewModel;
}(kendo.data.ObservableObject));
var BandClassDefinitionViewModel = (function (_super) {
    __extends(BandClassDefinitionViewModel, _super);
    function BandClassDefinitionViewModel(classesDefn, onStudentCountChangedEvent) {
        var _this = this;
        _super.call(this, classesDefn, onStudentCountChangedEvent);
        this.bandCount = 1;
        this.classCount = 1;
        this.onBandCountChanged = function (count) {
            _this.bandCount = count;
            _this.addBandsAndClassesControl();
        };
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
    BandClassDefinitionViewModel.prototype.studentCountChanged = function (value) {
        this.bandSet.studentCount = value;
    };
    Object.defineProperty(BandClassDefinitionViewModel.prototype, "studentInAllClassesCount", {
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
    BandClassDefinitionViewModel.prototype.reset = function () {
        this.bandSet = this.classesDefn.createBandSet("Band", this.classesDefn.studentCount, 2);
        this.studentCount = this.classesDefn.studentCount;
        this.set("bandCount", 1);
        this.set("classCount", 1);
    };
    BandClassDefinitionViewModel.prototype.loadOptions = function () {
        this.bandTableControl.init("classes-settings-container", this.bandSet);
        return true;
    };
    return BandClassDefinitionViewModel;
}(CustomGroupBaseViewModel));
//# sourceMappingURL=BandClassDefinitionViewModel.js.map