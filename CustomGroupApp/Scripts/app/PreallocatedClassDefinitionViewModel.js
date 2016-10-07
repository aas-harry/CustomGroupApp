var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PreallocatedClassDefinitionViewModel = (function (_super) {
    __extends(PreallocatedClassDefinitionViewModel, _super);
    function PreallocatedClassDefinitionViewModel(studentCount, onStudentCountChangedEvent) {
        var _this = this;
        if (studentCount === void 0) { studentCount = 0; }
        _super.call(this);
        this.studentCount = studentCount;
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
        this.showPreallocatedStudents = function () {
            _this.set("showPreallocatedStudentsList", !_this.showPreallocatedStudentsList);
            if (_this.showPreallocatedStudentsList) {
                _this.set("showStudentCaption", "Hide Students");
                _this.kendoHelper.createPreAllocatedStudentGrid("preallocated-students-list", _this.preallocatedStudents);
                _this.classTableControl.init("classes-settings-container", _this.bandSet);
            }
            else {
                _this.set("showStudentCaption", "Show Students");
            }
        };
        this.importStudents = function () {
            _this.kendoHelper.createUploadControl("files", "Customgroup\\importPreallocatedClasses?id=" + _this.bandSet.parent.testFile.fileNumber, _this.onUploadCompleted);
            $("#import-preallocated-classes").show();
            _this.set("showPreallocatedClasses", false);
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
                var studentLookup = Enumerable.From(_this.bandSet.parent.testFile.students)
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
                    _this.bandSet.bands[0].classes[classNo].index = classNo + 1;
                    _this.bandSet.bands[0].classes[classNo].name = "Class " + classItem.Key();
                    _this.bandSet.bands[0].classes[classNo].students = [];
                    for (var _c = 0, _d = classItem.source; _c < _d.length; _c++) {
                        var s = _d[_c];
                        if (studentLookup.Contains(s)) {
                            var studentClass = new StudentClass(studentLookup.Get(s));
                            studentClass.canMoveToOtherClass = false;
                            _this.bandSet.bands[0].classes[classNo].addStudent(studentClass);
                        }
                    }
                    classNo++;
                }
                debugger;
                _this.bandSet.students = Enumerable.From(_this.bandSet.parent.testFile.students)
                    .Except(_this.preallocatedStudents, function (x) { return x.studentId; })
                    .Select(function (x) { return new StudentClass(x); }).ToArray();
                _this.bandSet.bands[0].students = _this.bandSet.students;
                //const unallocatedStudents = Enumerable.From(this.bandSet.parent.testFile.students)
                //    .Except(this.preallocatedStudents, x => x.studentId)
                //    .ToArray();
                //const lastClassNo = classGroups.length;
                //for (let s of unallocatedStudents) {
                //    this.bandSet.bands[0].classes[lastClassNo].students.push(new StudentClass(s));
                //}
                //this.bandSet.bands[0].classes[lastClassNo].count = this.bandSet.bands[0].classes[lastClassNo].students.length;
                _this.showPreallocatedStudents();
            }
            $("#import-preallocated-classes").hide();
            _this.set("showPreallocatedClasses", true);
            _this.set("showStudentCaption", "Hide Students");
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
    PreallocatedClassDefinitionViewModel.prototype.saveOptions = function (source) {
        return true;
    };
    PreallocatedClassDefinitionViewModel.prototype.loadOptions = function (source) {
        this.bandSet = source;
        _super.prototype.set.call(this, "classCount", source.bands[0].classes.length);
        this.classTableControl.init("classes-settings-container", this.bandSet);
        $("#import-preallocated-classes").hide();
        return true;
    };
    PreallocatedClassDefinitionViewModel.prototype.getBandSet = function () {
        return this.bandSet;
    };
    return PreallocatedClassDefinitionViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=PreallocatedClassDefinitionViewModel.js.map