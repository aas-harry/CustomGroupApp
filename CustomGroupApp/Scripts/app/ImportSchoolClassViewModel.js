var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ImportSchoolClassViewModel = (function (_super) {
    __extends(ImportSchoolClassViewModel, _super);
    function ImportSchoolClassViewModel(testFile) {
        var _this = this;
        _super.call(this);
        this.testFile = testFile;
        this.popupWindowElementName = "popup-window-container";
        // ReSharper disable once InconsistentNaming
        this._studentCount = 0;
        this.hasImportedClasses = false;
        this.invalidUploadFileFormat = false;
        this.hasUnMatchedStudents = false;
        this.classCount = 1;
        this.preallocatedStudents = new Array();
        this.unMatchedStudents = new Array();
        this.dataSource = new Array();
        this.groupingHelper = new GroupingHelper();
        this.kendoHelper = new KendoHelper();
        this.messageBox = new MessageBoxDialog();
        this.isSaved = false;
        this.downloadTemplate = function () {
            _this.groupingHelper.downloadTemplateFile("DownloadSchoolClassTemplate", _this.classesDefn.testFile.fileNumber);
        };
        this.askToSaveClasses = function (callback) {
            if (_this.hasImportedClasses && _this.isSaved === false) {
                _this.messageBox.showYesNoCancelDialog(_this.popupWindowElementName, "Do you want to save the imported classes?", "Save Classes", function (dialogResult) {
                    var tmpcallback = callback;
                    if (!tmpcallback) {
                        return;
                    }
                    if (dialogResult === DialogResult.Cancel) {
                        tmpcallback(false);
                        return;
                    }
                    if (dialogResult === DialogResult.Yes) {
                        _this.saveClasses(function (res) {
                            if (res) {
                                tmpcallback(res);
                            }
                        });
                    }
                    if (dialogResult === DialogResult.No) {
                        tmpcallback(true);
                    }
                });
            }
            else {
                var tmpcallback = callback;
                if (tmpcallback) {
                    tmpcallback(true);
                }
            }
        };
        this.openCustomGroups = function () {
            _this.askToSaveClasses(function (status) {
                if (status) {
                    $.ajax({
                        url: "..\\Customgroup\\CustomGroupListView",
                        type: 'POST',
                        success: function (html) {
                            $("#reportContent").replaceWith(html);
                            $(window).trigger('resize');
                        }
                    });
                }
            });
        };
        this.startOver = function () {
            _this.askToSaveClasses(function (status) {
                if (status) {
                    _this.reset();
                }
            });
        };
        this.saveClasses = function (callback) {
            var self = _this;
            _this.groupingHelper.saveClasses(_this.bandSet, function (status, classItems) {
                if (status) {
                    toastr.info("Classes have been save successfully.");
                    for (var _i = 0, classItems_1 = classItems; _i < classItems_1.length; _i++) {
                        var classItem = classItems_1[_i];
                        self.classesDefn.testFile.customGroups.push(classItem);
                    }
                    _this.set("isSaved", true);
                    var tmpCallback = callback;
                    if (tmpCallback && typeof tmpCallback === "function") {
                        tmpCallback(true);
                    }
                }
                else {
                    _this.messageBox.showWarningDialog(_this.popupWindowElementName, "Failed to save classes.", "Saved");
                    var tmpCallback = callback;
                    if (tmpCallback && typeof tmpCallback === "function") {
                        tmpCallback(false);
                    }
                }
            });
        };
        this.importStudents = function () {
            var container = document.getElementById("uploader-container");
            container.innerHTML = '<input type="file" id= "files" name= "files" />';
            _this.uploader = _this.kendoHelper.createUploadControl("files", "..\\Customgroup\\ImportSchoolClasses?id=" + _this.classesDefn.testFile.fileNumber, _this.onUploadCompleted);
        };
        this.showClasses = function () {
            var table = document.getElementById("class-list-container");
            var tbody = table.tBodies[0];
            while (tbody.rows.length > 0) {
                tbody.deleteRow(0);
            }
            var cnt = 1;
            for (var _i = 0, _a = Enumerable.From(_this.bandSet.bands[0].classes).OrderBy(function (c) { return c.name; }).ToArray(); _i < _a.length; _i++) {
                var classItem = _a[_i];
                var row = tbody.insertRow();
                _this.kendoHelper.addNumberCell(row, cnt);
                _this.kendoHelper.addCell(row, classItem.name);
                _this.kendoHelper.addNumberCell(row, classItem.count);
                cnt++;
            }
        };
        this.showUnmatchedStudents = function () {
            var table = document.getElementById("unmatched-student-list-container");
            var tbody = table.tBodies[0];
            while (tbody.rows.length > 0) {
                tbody.deleteRow(0);
            }
            var cnt = 1;
            for (var _i = 0, _a = _this.unMatchedStudents; _i < _a.length; _i++) {
                var name_1 = _a[_i];
                var row = tbody.insertRow();
                _this.kendoHelper.addNumberCell(row, cnt);
                _this.kendoHelper.addCell(row, name_1);
                cnt++;
            }
        };
        this.onUploadCompleted = function (e) {
            var self = _this;
            self.reset();
            if (!e || !e.response) {
                self.showClasses();
                if (self.hasUnMatchedStudents) {
                    self.showUnmatchedStudents();
                }
                return;
            }
            self.preallocatedStudents = [];
            for (var _i = 0, _a = e.response.StudentClasses; _i < _a.length; _i++) {
                var item = _a[_i];
                if (!item.Class || item.Class === "") {
                    continue;
                }
                self.preallocatedStudents.push(new PreAllocatedStudent(item));
            }
            self.unMatchedStudents = [];
            for (var _b = 0, _c = e.response.UnMatchedStudents; _b < _c.length; _b++) {
                var name_2 = _c[_b];
                if (!name_2) {
                    continue;
                }
                self.unMatchedStudents.push(name_2);
            }
            var studentLookup = Enumerable.From(self.classesDefn.students)
                .ToDictionary(function (x) { return x.studentId; }, function (x) { return x; });
            var classGroups = Enumerable.From(self.preallocatedStudents)
                .Where(function (x) { return x.studentId !== null; })
                .GroupBy(function (x) { return x.className; }, function (x) { return x.studentId; })
                .ToArray();
            self.bandSet.bands[0].setClassCount(classGroups.length);
            var classNo = 0;
            for (var _d = 0, classGroups_1 = classGroups; _d < classGroups_1.length; _d++) {
                var classItem = classGroups_1[_d];
                var allocatedStudentCount = classItem.source.length;
                self.bandSet.bands[0].classes[classNo].index = classNo + 1;
                self.bandSet.bands[0].classes[classNo].name = classItem.Key();
                self.bandSet.bands[0].classes[classNo].students = [];
                self.bandSet.bands[0].classes[classNo].preallocatedStudentCount = allocatedStudentCount;
                if (self.bandSet.bands[0].classes[classNo].count < allocatedStudentCount) {
                    self.bandSet.bands[0].classes[classNo].count = allocatedStudentCount;
                    self.bandSet.bands[0].classes[classNo].notAllocatedStudentCount = 0;
                }
                else {
                    self.bandSet.bands[0].classes[classNo]
                        .notAllocatedStudentCount = self.bandSet.bands[0].classes[classNo]
                        .count -
                        allocatedStudentCount;
                }
                for (var _e = 0, _f = classItem.source; _e < _f.length; _e++) {
                    var s = _f[_e];
                    if (studentLookup.Contains(s)) {
                        var studentClass = studentLookup.Get(s);
                        self.bandSet.bands[0].classes[classNo].addStudent(studentClass, false);
                    }
                }
                self.bandSet.bands[0].classes[classNo].count = self.bandSet.bands[0].classes[classNo].students.length;
                classNo++;
            }
            self.bandSet.students = Enumerable.From(self.bandSet.parent.students)
                .Except(self.preallocatedStudents, function (x) { return x.studentId; })
                .Select(function (x) { return x; })
                .ToArray();
            self.bandSet.bands[0].students = self.bandSet.students;
            self.set("isSaved", self.preallocatedStudents.length === 0);
            self.set("hasImportedClasses", true);
            self.set("hasUnMatchedStudents", self.unMatchedStudents.length > 0);
            self.set("invalidUploadFileFormat", self.preallocatedStudents.length === 0);
            self.showClasses();
            if (self.hasUnMatchedStudents) {
                self.showUnmatchedStudents();
            }
        };
        this.classesDefn = new ClassesDefinition(testFile, null);
        this.reset();
        this.importStudents();
    }
    Object.defineProperty(ImportSchoolClassViewModel.prototype, "studentCount", {
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
    ImportSchoolClassViewModel.prototype.reset = function () {
        this.preallocatedStudents = [];
        this.unMatchedStudents = [];
        this.bandSet = this.classesDefn.createPreAllocatedClassBandSet("class", this.classesDefn.studentCount);
        this.set("classCount", 1);
        this.set("hasImportedClasses", false);
        this.set("hasUnMatchedStudents", false);
        this.set("invalidUploadFileFormat", false);
        this.set("isSaved", false);
    };
    return ImportSchoolClassViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=ImportSchoolClassViewModel.js.map