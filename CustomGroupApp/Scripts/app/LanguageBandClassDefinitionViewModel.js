var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LanguageBandClassDefinitionViewModel = (function (_super) {
    __extends(LanguageBandClassDefinitionViewModel, _super);
    function LanguageBandClassDefinitionViewModel(studentCount, onStudentCountChangedEvent) {
        var _this = this;
        if (studentCount === void 0) { studentCount = 0; }
        _super.call(this);
        this.studentCount = studentCount;
        this.bandCount = 3;
        this.classCount = 1;
        this.languageSets = [];
        this.groupingHelper = new GroupingHelper();
        this.kendoHelper = new KendoHelper();
        this.hasBandSetInitialised = false;
        this.genderChanged = function (gender, studentCount) {
        };
        this.showStudentLanguageCaption = "View Students";
        this.showStudentLanguagePreferences = function () {
            _this.set("showStudentLanguageList", !_this.showStudentLanguageList);
            if (_this.showStudentLanguageList) {
                _this.set("showStudentLanguageCaption", "Hide Students");
                _this.kendoHelper.createStudentLanguageGrid("student-language-preferences-list", _this._students, true);
            }
            else {
                _this.set("showStudentLanguageCaption", "Show Students");
            }
        };
        this.importStudentLanguages = function () {
            _this.kendoHelper.createUploadControl("files", "Customgroup\\ImportStudentLanguages?id=1014181", _this.onUploadCompleted);
            $("#import-language-preferences").show();
            _this.set("showStudentLanguageList", false);
        };
        this.onUploadCompleted = function (e) {
            if (e && e.response) {
            }
            $("#import-language-preferences").hide();
            _this.set("showStudentLanguageList", true);
            _this.set("showStudentLanguageCaption", "Hide Students");
        };
        this.hasStudentLanguagePreferences = false;
        this.showStudentLanguageList = false;
        this.studentWithLanguagePrefCount = 0;
        // ReSharper disable once InconsistentNaming
        this._students = [];
        this.callOnStudentCountChangedEvent = function () {
            var onStudentCountChangedEvent = _this.onStudentCountChangedEvent;
            if (onStudentCountChangedEvent != null) {
                onStudentCountChangedEvent(Enumerable.From(_this.bandSet.bands).SelectMany(function (b) { return b.classes; }).Sum(function (x) { return x.count; }));
            }
        };
        this.onStudentCountChangedEvent = onStudentCountChangedEvent;
        this.bandTableControl = new BandTableControl(this.callOnStudentCountChangedEvent);
    }
    LanguageBandClassDefinitionViewModel.prototype.saveOptions = function (source) {
        return true;
    };
    LanguageBandClassDefinitionViewModel.prototype.loadOptions = function (source) {
        this.bandSet = source;
        _super.prototype.set.call(this, "bandCount", source.bands.length);
        if (this.hasBandSetInitialised === false) {
            this.bandSet.createBands("language", this.studentCount, this.languageSets.length);
            var i = 0;
            for (var _i = 0, _a = this.languageSets; _i < _a.length; _i++) {
                var item = _a[_i];
                this.bandSet.bands[i].bandName = item.description;
                this.bandSet.bands[i].studentCount = item.count;
                this.bandSet.bands[i].students = item.students;
                this.bandSet.bands[i].setClassCount(1);
                i++;
                this.hasBandSetInitialised = true;
            }
        }
        this.bandTableControl.init("classes-settings-container", source);
        $("#import-language-preferences").hide();
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
            this.set("hasStudentLanguagePreferences", this.studentWithLanguagePrefCount > 0);
        },
        enumerable: true,
        configurable: true
    });
    return LanguageBandClassDefinitionViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=LanguageBandClassDefinitionViewModel.js.map