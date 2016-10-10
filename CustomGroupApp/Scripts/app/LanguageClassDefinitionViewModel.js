var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LanguageClassDefinitionViewModel = (function (_super) {
    __extends(LanguageClassDefinitionViewModel, _super);
    function LanguageClassDefinitionViewModel(classesDefn, onStudentCountChangedEvent) {
        var _this = this;
        _super.call(this);
        this.classesDefn = classesDefn;
        this.bandCount = 3;
        this.classCount = 1;
        this.languageSets = [];
        // ReSharper disable once InconsistentNaming
        this._studentCount = 0;
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
                _this.kendoHelper.createStudentLanguageGrid("student-language-preferences-list", _this.classesDefn.students, true);
            }
            else {
                _this.set("showStudentLanguageCaption", "Show Students");
            }
        };
        this.importStudents = function () {
            _this.kendoHelper.createUploadControl("files", "Customgroup\\ImportStudentLanguages?id=" + _this.classesDefn.testFile.fileNumber, _this.onUploadCompleted);
            $("#upload-language-upload-control").show();
            _this.set("showStudentLanguageList", false);
        };
        this.onUploadCompleted = function (e) {
            if (e && e.response) {
                _this.classesDefn.testFile.setStudentLanguagePrefs(e.response);
                _this.createLanguageSet();
                _this.addBandsAndClassesControl();
                _this.set("showStudentLanguageList", true);
                _this.set("showStudentLanguageCaption", "Hide Students");
            }
            $("#upload-language-upload-control").hide();
        };
        this.createLanguageSet = function () {
            _this.studentWithLanguagePrefCount = Enumerable.From(_this.classesDefn.students).Count(function (x) { return x.hasLanguagePreferences; });
            _this.languageSets = [];
            var _loop_1 = function(s) {
                var matched = Enumerable.From(_this.languageSets)
                    .FirstOrDefault(null, function (x) { return x.isEqual(s.langPref1, s.langPref2); });
                if (matched == null) {
                    matched = new LanguageSet(s.langPref1, s.langPref2);
                    _this.languageSets.push(matched);
                }
                matched.addStudent(s);
            };
            for (var _i = 0, _a = _this.classesDefn.students; _i < _a.length; _i++) {
                var s = _a[_i];
                _loop_1(s);
            }
            _this.set("hasStudentLanguagePreferences", _this.studentWithLanguagePrefCount > 0);
        };
        this.hasStudentLanguagePreferences = false;
        this.showStudentLanguageList = false;
        this.studentWithLanguagePrefCount = 0;
        this.callOnStudentCountChangedEvent = function () {
            var onStudentCountChangedEvent = _this.onStudentCountChangedEvent;
            if (onStudentCountChangedEvent != null) {
                onStudentCountChangedEvent(_this.studentInAllClassesCount);
            }
        };
        this.addBandsAndClassesControl = function () {
            _this.bandSet.createBands("language", _this.studentCount, _this.languageSets.length);
            var i = 0;
            for (var _i = 0, _a = _this.languageSets; _i < _a.length; _i++) {
                var item = _a[_i];
                _this.bandSet.bands[i].bandName = item.description;
                _this.bandSet.bands[i].studentCount = item.count;
                _this.bandSet.bands[i].students = item.students;
                _this.bandSet.bands[i].setClassCount(1);
                _this.bandSet.bands[i].commonBand = item.nolanguagePrefs;
                i++;
            }
            _this.bandTableControl.init("classes-settings-container", _this.bandSet);
        };
        this.bandSet = classesDefn.createBandSet("Band", classesDefn.studentCount, 1);
        this.studentCount = classesDefn.studentCount;
        this.onStudentCountChangedEvent = onStudentCountChangedEvent;
        this.bandTableControl = new BandTableControl(this.callOnStudentCountChangedEvent);
    }
    Object.defineProperty(LanguageClassDefinitionViewModel.prototype, "studentCount", {
        get: function () {
            return this._studentCount;
        },
        set: function (value) {
            this.bandSet.studentCount = value;
            this._studentCount = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageClassDefinitionViewModel.prototype, "studentInAllClassesCount", {
        get: function () {
            return Enumerable.From(this.bandSet.bands).SelectMany(function (b) { return b.classes; }).Sum(function (x) { return x.count; });
        },
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    LanguageClassDefinitionViewModel.prototype.saveOptions = function () {
        return true;
    };
    LanguageClassDefinitionViewModel.prototype.loadOptions = function () {
        this.createLanguageSet();
        this.addBandsAndClassesControl();
        $("#upload-language-upload-control").hide();
        return true;
    };
    LanguageClassDefinitionViewModel.prototype.getBandSet = function () {
        return this.bandSet;
    };
    return LanguageClassDefinitionViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=LanguageClassDefinitionViewModel.js.map