var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SchoolGroupClassDefinitionViewModel = (function (_super) {
    __extends(SchoolGroupClassDefinitionViewModel, _super);
    function SchoolGroupClassDefinitionViewModel(classesDefn, onStudentCountChangedEvent) {
        var _this = this;
        _super.call(this);
        this.classesDefn = classesDefn;
        this.uploadElement = "upload-school-group-control";
        this.uploadContainerElement = "uploader-container";
        this.studentsListElement = "student-school-groups-list";
        this.showStudentCaptionFieldname = "showStudentCaption";
        this.showStudentListFlagFieldname = "showStudentListFlag";
        this.bandCount = 1;
        this.classCount = 1;
        this.studentSets = [];
        // ReSharper disable once InconsistentNaming
        this._studentCount = 0;
        this.groupingHelper = new GroupingHelper();
        this.kendoHelper = new KendoHelper();
        this.hasBandSetInitialised = false;
        this.genderChanged = function (gender, studentCount) {
        };
        this.showStudentCaption = "View Students";
        this.toggleShowStudents = function () {
            _this.set(_this.showStudentListFlagFieldname, !_this.showStudentListFlag);
            _this.showStudentList(_this.showStudentListFlag);
        };
        this.showStudentList = function (showList) {
            if (showList) {
                _this.set(_this.showStudentCaptionFieldname, "Hide Students");
                _this.kendoHelper.createStudentSchoolGroupGrid(_this.studentsListElement, _this.classesDefn.students, true);
            }
            else {
                _this.set(_this.showStudentCaptionFieldname, "Show Students");
            }
        };
        this.importStudents = function () {
            var container = document.getElementById(_this.uploadContainerElement);
            container.innerHTML = '<input type="file" id= "files" name= "files" />';
            _this.kendoHelper.createUploadControl("files", "..\\Customgroup\\ImportStudentsSchoolGroup?id=" + _this.classesDefn.testFile.fileNumber, _this.onUploadCompleted);
            $("#" + _this.uploadElement).show();
            _this.set(_this.showStudentListFlagFieldname, false);
            _this.showStudentList(false);
        };
        this.onUploadCompleted = function (e) {
            if (e && e.response) {
                _this.classesDefn.testFile.setSchoolGroup(e.response);
                _this.classesDefn.setSchoolGroups();
                _this.createClassSet();
                _this.addBandsAndClassesControl();
            }
            $("#" + _this.uploadElement).hide();
            _this.set(_this.showStudentListFlagFieldname, true);
            _this.showStudentList(true);
        };
        this.createClassSet = function () {
            _this.set("studentWithSchoolGroupCount", Enumerable.From(_this.classesDefn.students).Count(function (x) { return x.schoolGroup; }));
            _this.studentSets = [];
            var _loop_1 = function(s) {
                var matched = Enumerable.From(_this.studentSets)
                    .FirstOrDefault(null, function (x) { return x.setName === s.schoolGroup; });
                if (matched == null) {
                    matched = new StudentSet(StudentSetType.CustomGroup);
                    matched.setName = s.schoolGroup;
                    _this.studentSets.push(matched);
                }
                matched.students.push(s);
            };
            for (var _i = 0, _a = _this.classesDefn.students; _i < _a.length; _i++) {
                var s = _a[_i];
                _loop_1(s);
            }
            _this.set("hasSchoolGroup", _this.studentWithSchoolGroupCount > 0);
        };
        this.hasSchoolGroup = false;
        this.showStudentListFlag = false;
        this.studentWithSchoolGroupCount = 0;
        this.callOnStudentCountChangedEvent = function () {
            var onStudentCountChangedEvent = _this.onStudentCountChangedEvent;
            if (onStudentCountChangedEvent != null) {
                onStudentCountChangedEvent(_this.studentInAllClassesCount);
            }
        };
        this.addBandsAndClassesControl = function () {
            _this.bandSet.createBands("schoolgroup", _this.studentCount, _this.studentSets.length);
            var i = 0;
            for (var _i = 0, _a = _this.studentSets; _i < _a.length; _i++) {
                var item = _a[_i];
                _this.bandSet.bands[i].bandName = item.setName ? item.setName : "Unallocated";
                _this.bandSet.bands[i].studentCount = item.students.length;
                _this.bandSet.bands[i].students = item.students;
                _this.bandSet.bands[i].setClassCount(1);
                _this.bandSet.bands[i].commonBand = item.setName ? false : true;
                i++;
            }
            _this.bandTableControl.init("classes-settings-container", _this.bandSet);
        };
        this.reset();
        this.onStudentCountChangedEvent = onStudentCountChangedEvent;
        this.bandTableControl = new BandTableControl(this.callOnStudentCountChangedEvent);
    }
    Object.defineProperty(SchoolGroupClassDefinitionViewModel.prototype, "studentCount", {
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
    Object.defineProperty(SchoolGroupClassDefinitionViewModel.prototype, "studentInAllClassesCount", {
        get: function () {
            return Enumerable.From(this.bandSet.bands).SelectMany(function (b) { return b.classes; }).Sum(function (x) { return x.count; });
        },
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    SchoolGroupClassDefinitionViewModel.prototype.reset = function () {
        this.bandSet = this.classesDefn.createSchoolGroupBandSet("Band", this.classesDefn.studentCount, 1);
        this.studentCount = this.classesDefn.studentCount;
        this.set("bandCount", 1);
        this.set("classCount", 1);
    };
    SchoolGroupClassDefinitionViewModel.prototype.loadOptions = function () {
        this.createClassSet();
        this.addBandsAndClassesControl();
        this.set(this.showStudentListFlagFieldname, false);
        this.showStudentList(false);
        $("#" + this.uploadElement).hide();
        return true;
    };
    SchoolGroupClassDefinitionViewModel.prototype.getBandSet = function () {
        return this.bandSet;
    };
    return SchoolGroupClassDefinitionViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=SchoolGroupClassDefinitionViewModel.js.map