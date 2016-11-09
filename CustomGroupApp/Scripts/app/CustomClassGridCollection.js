var CustomClassGridCollection = (function () {
    function CustomClassGridCollection() {
        var _this = this;
        this.groupingHelper = new GroupingHelper();
        this.studentClassListControls = new StudentClassListControl();
        this.kendoHelper = new KendoHelper();
        this.hiddenClasses = [];
        this.me = this;
        this.classes = [];
        this.classCount = 0;
        this.editClassMode = false;
        this.initTable = function (elementName, bands, editClassMode) {
            if (editClassMode === void 0) { editClassMode = false; }
            _this.elementName = elementName;
            _this.bands = bands;
            _this.editClassMode = editClassMode;
            $(elementName).html("<table id='custom-classes-table'></table>");
            _this.table = document.getElementById("custom-classes-table");
            _this.header = _this.table.createTBody();
            var hiddenClassLookup = Enumerable.From(_this.hiddenClasses).ToDictionary(function (x) { return x; }, function (x) { return x; });
            if (bands.length === 1) {
                _this.classRow = _this.header.insertRow();
                _this.classes = Enumerable.From(bands).SelectMany(function (b) { return b.classes; }).ToArray();
                _this.classCount = _this.classes.length;
                var cnt = 0;
                for (var _i = 0, _a = _this.classes; _i < _a.length; _i++) {
                    var classItem = _a[_i];
                    if (hiddenClassLookup.Contains(classItem.uid)) {
                        continue;
                    }
                    if (cnt === 3) {
                        _this.classRow = _this.header.insertRow();
                        cnt = 0;
                    }
                    cnt++;
                    _this.studentClassListControls
                        .createStudentClassInputContainer(_this.classRow.insertCell(), classItem, _this.onEditGroupName, _this.onUpdateStudentsInClass, _this.onHideClass, _this.onDropItem, editClassMode);
                }
            }
            else {
                for (var _b = 0, bands_1 = bands; _b < bands_1.length; _b++) {
                    var band = bands_1[_b];
                    _this.classes = Enumerable.From(bands).SelectMany(function (b) { return b.classes; }).ToArray();
                    _this.classCount = _this.classes.length;
                    _this.classRow = _this.header.insertRow();
                    for (var _c = 0, _d = band.classes; _c < _d.length; _c++) {
                        var classItem = _d[_c];
                        if (hiddenClassLookup.Contains(classItem.uid)) {
                            continue;
                        }
                        _this.studentClassListControls
                            .createStudentClassInputContainer(_this.classRow.insertCell(), classItem, _this.onEditGroupName, _this.onUpdateStudentsInClass, _this.onHideClass, _this.onDropItem, editClassMode);
                    }
                }
            }
        };
        this.showAllClasses = function () {
            _this.hiddenClasses = [];
            _this.initTable(_this.elementName, _this.bands, _this.editClassMode);
        };
        // Remove the selected class from the screen  
        this.onHideClass = function (classItem) {
            _this.hiddenClasses.push(classItem.uid);
            _this.initTable(_this.elementName, _this.bands, _this.editClassMode);
            var tmpCallback = _this.hideClassCallback;
            if (tmpCallback) {
                tmpCallback(classItem);
            }
        };
        this.onDropItem = function (targetUid, sourceUid, studentId) {
            var targetClass = Enumerable.From(_this.classes).FirstOrDefault(undefined, function (x) { return x.uid === _this.getUid(targetUid); });
            var sourceClass = Enumerable.From(_this.classes).FirstOrDefault(undefined, function (x) { return x.uid === _this.getUid(sourceUid); });
            var student = Enumerable.From(sourceClass.students).FirstOrDefault(undefined, function (x) { return x.id === studentId; });
            if (targetClass && sourceClass && student && targetClass.index !== sourceClass.index) {
                sourceClass.removeStudent(student);
                targetClass.addStudent(student);
                sourceClass.calculateClassesAverage();
                targetClass.calculateClassesAverage();
                _this.studentClassListControls.updateClassSummaryContent(sourceClass);
                _this.studentClassListControls.updateClassSummaryContent(targetClass);
                // save the changes in database
                if (_this.editClassMode) {
                    _this.groupingHelper.addDeleteStudentsInClass(targetClass.groupSetid, [student.studentId], sourceClass.groupSetid, [student.studentId], function (status) {
                        //
                    });
                }
                // Notify the caller the affected classes
                var callback = _this.classChangedCallback;
                if (callback) {
                    callback(sourceClass);
                    callback(targetClass);
                }
                return true;
            }
            return false;
        };
        this.onUpdateStudentsInClass = function (classItem, status) {
            // Use this callback function to notify the user
            // Notify the caller the affected classes
            var callback = _this.classChangedCallback;
            if (callback) {
                callback(classItem);
            }
        };
        this.onEditGroupName = function (classItem, status) {
            // Use this callback function to notify the user
            // Notify the caller the affected classes
            var callback = _this.classChangedCallback;
            if (callback) {
                callback(classItem);
            }
        };
        this.clear = function () {
        };
        this.createClassHeader = function (classItem) {
            _this.kendoHelper.createLabel(_this.headerRow.insertCell(), classItem.name);
        };
        this.getUid = function (elementName) {
            return elementName.substr(elementName.indexOf("-") + 1);
        };
        this.parseElementClass = function (elementName) {
            var base = elementName.substr(elementName.indexOf("-") + 1);
            var bandNo = base.substr(0, base.indexOf("-"));
            var classNo = base.substr(base.indexOf("-", 1) + 1);
            return { bandNo: parseInt(bandNo), classNo: parseInt(classNo) };
        };
    }
    return CustomClassGridCollection;
}());
//# sourceMappingURL=CustomClassGridCollection.js.map