var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LanguageBandClassDefinitionViewModel = (function (_super) {
    __extends(LanguageBandClassDefinitionViewModel, _super);
    function LanguageBandClassDefinitionViewModel(studentCount) {
        if (studentCount === void 0) { studentCount = 0; }
        _super.call(this);
        this.studentCount = studentCount;
        this.bandCount = 3;
        this.classCount = 1;
        this.languageSets = [];
        this.bandSet = new BandSet(null, "custom", this.studentCount, 1);
        this.groupingHelper = new GroupingHelper();
        this.kendoHelper = new KendoHelper();
        this.bandTableControl = new BandTableControl();
        this.studentWithLanguagePrefCount = 0;
        // ReSharper disable once InconsistentNaming
        this._students = [];
    }
    LanguageBandClassDefinitionViewModel.prototype.saveOptions = function (source) {
        return true;
    };
    LanguageBandClassDefinitionViewModel.prototype.loadOptions = function (source) {
        this.bandSet = source;
        _super.prototype.set.call(this, "bandCount", source.bands.length);
        this.bandTableControl.init("classes-settings-container", source);
        return true;
    };
    LanguageBandClassDefinitionViewModel.prototype.getBandSet = function () {
        return this.bandSet;
    };
    Object.defineProperty(LanguageBandClassDefinitionViewModel.prototype, "students", {
        set: function (value) {
            this._students = value;
            this.studentWithLanguagePrefCount = Enumerable.From(value).Count(function (x) { return x.hasLanguagePreferences; });
            this.languageSets = [];
            var _loop_1 = function(s) {
                var matched = Enumerable.From(this_1.languageSets)
                    .FirstOrDefault(null, function (x) { return x.isEqual(s.langPref1, s.langPref2); });
                if (matched == null) {
                    matched = new LanguageSet(s.langPref1, s.langPref2);
                    this_1.languageSets.push(matched);
                }
                matched.addStudent(s);
            };
            var this_1 = this;
            for (var _i = 0, _a = this._students; _i < _a.length; _i++) {
                var s = _a[_i];
                _loop_1(s);
            }
            this.bandSet.createBands("language", this.studentCount, this.languageSets.length);
            var i = 0;
            for (var _b = 0, _c = this.languageSets; _b < _c.length; _b++) {
                var item = _c[_b];
                this.bandSet.bands[i].bandName = item.description;
                this.bandSet.bands[i].studentCount = item.count;
                this.bandSet.bands[i].setClassCount(1);
                i++;
            }
        },
        enumerable: true,
        configurable: true
    });
    return LanguageBandClassDefinitionViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=LanguageBandClassDefinitionViewModel.js.map