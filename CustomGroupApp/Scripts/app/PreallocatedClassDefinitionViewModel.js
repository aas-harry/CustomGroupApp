var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PreallocatedClassDefinitionViewModel = (function (_super) {
    __extends(PreallocatedClassDefinitionViewModel, _super);
    function PreallocatedClassDefinitionViewModel(classesDefn, onStudentCountChangedEvent) {
        var _this = this;
        _super.call(this);
        this.classesDefn = classesDefn;
        // ReSharper disable once InconsistentNaming
        this._studentCount = 0;
        this.addBandsAndClassesControl = function () { };
        this.classCount = 1;
        this.showStudentCaption = "Show Students";
        this.preallocatedStudents = new Array();
        this.groupingHelper = new GroupingHelper();
        this.kendoHelper = new KendoHelper();
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
        this.preAllocatedStudentsCount = 0;
        this.preAllocatedStudentsMatchedCount = 0;
        this.hasPreallocatedStudents = false;
        this.showPreallocatedStudentsList = false;
        this.togglePreallocatedStudents = function () {
            _this.set("showPreallocatedStudentsList", !_this.showPreallocatedStudentsList);
            _this.showPreallocatedStudents(_this.showPreallocatedStudentsList);
        };
        this.showPreallocatedStudents = function (showList) {
            if (showList) {
                _this.set("showStudentCaption", "Hide Students");
                _this.kendoHelper.createPreAllocatedStudentGrid("preallocated-students-list", _this.preallocatedStudents);
            }
            else {
                _this.set("showStudentCaption", "Show Students");
            }
        };
        this.importStudents = function () {
            var container = document.getElementById("uploader-container");
            container.innerHTML = '<input type="file" id= "files" name= "files" />';
            _this.kendoHelper.createUploadControl("files", "..\\Customgroup\\importPreallocatedClasses?id=" + _this.bandSet.parent.testFile.fileNumber, _this.onUploadCompleted);
            $("#import-preallocated-classes").show();
            _this.set("showPreallocatedStudentsList", false);
            _this.showPreallocatedStudents(false);
        };
        this.onUploadCompleted = function (e) {
            _this.preallocatedStudents = [];
            if (e && e.response) {
                for (var _i = 0, _a = e.response; _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (!item.Class || item.Class === "") {
                        continue;
                    }
                    _this.preallocatedStudents.push(new PreAllocatedStudent(item));
                }
                var studentLookup = Enumerable.From(_this.bandSet.parent.students)
                    .ToDictionary(function (x) { return x.studentId; }, function (x) { return x; });
                _this.set("preAllocatedStudentsMatchedCount", Enumerable.From(_this.preallocatedStudents)
                    .Count(function (x) { return x.studentId !== null; }));
                _this.set("hasPreallocatedStudents", _this.preAllocatedStudentsMatchedCount > 0);
                _this.set("preAllocatedStudentsCount", _this.preallocatedStudents.length);
                var classGroups = Enumerable.From(_this.preallocatedStudents).Where(function (x) { return x.studentId !== null; })
                    .GroupBy(function (x) { return x.className; }, function (x) { return x.studentId; }).ToArray();
                _this.bandSet.bands[0].setClassCount(classGroups.length);
                var classNo = 0;
                for (var _b = 0, classGroups_1 = classGroups; _b < classGroups_1.length; _b++) {
                    var classItem = classGroups_1[_b];
                    var allocatedStudentCount = classItem.source.length;
                    _this.bandSet.bands[0].classes[classNo].index = classNo + 1;
                    _this.bandSet.bands[0].classes[classNo].name = "Class " + classItem.Key();
                    _this.bandSet.bands[0].classes[classNo].students = [];
                    _this.bandSet.bands[0].classes[classNo].preallocatedStudentCount = allocatedStudentCount;
                    if (_this.bandSet.bands[0].classes[classNo].count < allocatedStudentCount) {
                        _this.bandSet.bands[0].classes[classNo].count = allocatedStudentCount;
                        _this.bandSet.bands[0].classes[classNo].notAllocatedStudentCount = 0;
                    }
                    else {
                        _this.bandSet.bands[0].classes[classNo]
                            .notAllocatedStudentCount = _this.bandSet.bands[0].classes[classNo]
                            .count -
                            allocatedStudentCount;
                    }
                    for (var _c = 0, _d = classItem.source; _c < _d.length; _c++) {
                        var s = _d[_c];
                        if (studentLookup.Contains(s)) {
                            var studentClass = studentLookup.Get(s);
                            _this.bandSet.bands[0].classes[classNo].addStudent(studentClass, false);
                        }
                    }
                    classNo++;
                }
                _this.bandSet.students = Enumerable.From(_this.bandSet.parent.students)
                    .Except(_this.preallocatedStudents, function (x) { return x.studentId; })
                    .Select(function (x) { return x; }).ToArray();
                _this.bandSet.bands[0].students = _this.bandSet.students;
                _this.classTableControl.init("classes-settings-container", _this.bandSet);
            }
            $("#import-preallocated-classes").hide();
            _this.set("showPreallocatedStudentsList", true);
            _this.showPreallocatedStudents(true);
        };
        this.genderChanged = function (gender, studentCount) {
            _this.bandSet.studentCount = studentCount;
            _this.bandSet.bands[0].studentCount = studentCount;
            _this.studentCount = studentCount;
            _this.onClassCountChanged();
        };
        this.showStudentLanguagePreferences = function () { };
        this.reset();
        this.onStudentCountChangedEvent = onStudentCountChangedEvent;
        this.classTableControl = new ClassTableControl(this.callOnStudentCountChangedEvent);
    }
    Object.defineProperty(PreallocatedClassDefinitionViewModel.prototype, "studentCount", {
        get: function () {
            return this._studentCount;
        },
        set: function (value) {
            this.bandSet.studentCount = value;
            this.bandSet.bands[0].studentCount = value;
            this._studentCount = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PreallocatedClassDefinitionViewModel.prototype, "studentInAllClassesCount", {
        get: function () {
            return 0;
        },
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    PreallocatedClassDefinitionViewModel.prototype.reset = function () {
        this.bandSet = this.classesDefn.createPreAllocatedClassBandSet("class", this.classesDefn.studentCount);
        this.set("classCount", 1);
    };
    PreallocatedClassDefinitionViewModel.prototype.loadOptions = function () {
        this.classTableControl.init("classes-settings-container", this.bandSet);
        this.set("showPreallocatedStudentsList", false);
        this.showPreallocatedStudents(false);
        $("#import-preallocated-classes").hide();
        return true;
    };
    PreallocatedClassDefinitionViewModel.prototype.getBandSet = function () {
        return this.bandSet;
    };
    return PreallocatedClassDefinitionViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=PreallocatedClassDefinitionViewModel.js.map