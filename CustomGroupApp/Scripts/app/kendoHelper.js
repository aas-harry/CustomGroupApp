// Input container to enter number of students in a band
var StudentBandInputContainer = (function () {
    function StudentBandInputContainer(cell, bandItem, callback, addLabel) {
        var _this = this;
        if (addLabel === void 0) { addLabel = false; }
        this.kendoHelper = new KendoHelper();
        this.init = function () {
            if (_this.addLabel) {
                var label = document.createElement("span");
                label.textContent = "# Students " + _this.bandItem.bandNo;
                label.setAttribute("style", "margin-right: 5px");
                _this.cell.appendChild(label);
            }
            var element = document.createElement("input");
            element.type = "text";
            element.setAttribute("style", "width: 100px");
            element.id = "studentband-" + _this.bandItem.uid;
            _this.cell.appendChild(element);
            _this.kendoHelper.createStudentCountInputControl(element.id, _this.bandItem.studentCount, _this.onStudentCountChanged);
        };
        this.onStudentCountChanged = function (count, inputControl) {
            var oldValue = _this.bandItem.studentCount;
            var newValue = count;
            _this.bandItem.studentCount = count;
            if (_this.callbackAction != null) {
                _this.callbackAction(_this.bandItem, newValue, oldValue, inputControl);
            }
        };
        this.cell = cell;
        this.bandItem = bandItem;
        this.callbackAction = callback;
        this.addLabel = addLabel;
        this.init();
    }
    return StudentBandInputContainer;
}());
// Input container to enter number of classes in a band
var ClassBandInputContainer = (function () {
    function ClassBandInputContainer(cell, bandItem, callback, addLabel) {
        var _this = this;
        if (addLabel === void 0) { addLabel = false; }
        this.kendoHelper = new KendoHelper();
        this.init = function () {
            if (_this.addLabel) {
                var label = document.createElement("span");
                label.textContent = "# Classes " + _this.bandItem.bandNo;
                label.setAttribute("style", "margin-right: 5px");
                _this.cell.appendChild(label);
            }
            var element = document.createElement("input");
            element.type = "text";
            element.setAttribute("style", "width: 100px");
            element.id = "classband-" + _this.bandItem.uid;
            _this.cell.appendChild(element);
            _this.kendoHelper.createClassCountInputControl(element.id, _this.bandItem.classCount, _this.onClassCountChanged);
        };
        this.onClassCountChanged = function (count, inputControl) {
            var oldValue = _this.bandItem.classCount;
            var newValue = count;
            _this.bandItem.classCount = count;
            if (_this.callbackAction != null) {
                _this.callbackAction(_this.bandItem, newValue, oldValue, inputControl);
            }
        };
        this.cell = cell;
        this.bandItem = bandItem;
        this.callbackAction = callback;
        this.addLabel = addLabel;
        this.init();
    }
    return ClassBandInputContainer;
}());
// Input container to enter number of students in a band
var StudentClassInputContainer = (function () {
    function StudentClassInputContainer(cell, classItem, callback, addLabel) {
        var _this = this;
        if (addLabel === void 0) { addLabel = false; }
        this.classItem = classItem;
        this.kendoHelper = new KendoHelper();
        this.init = function () {
            if (_this.addLabel) {
                var label = document.createElement("span");
                label.textContent = "Class " + _this.classItem.index;
                label.setAttribute("style", "margin-right: 5px");
                _this.cell.appendChild(label);
            }
            var element = document.createElement("input");
            element.type = "text";
            element.setAttribute("style", "width: 100px; margin-right: 20px");
            var elementId = _this.classItem ? _this.classItem.uid : createUuid();
            element.id = "studentclass-" + elementId;
            _this.cell.appendChild(element);
            var studentCount = _this.classItem ? _this.classItem.count : 0;
            _this.inputControl = _this.kendoHelper.createStudentCountInputControl(element.id, studentCount, _this.onStudentCountChanged);
            if (_this.classItem.notUsed) {
                _this.hideInput();
            }
        };
        this.onStudentCountChanged = function (count, inputControl) {
            var oldValue = _this.classItem.count;
            var newValue = count;
            _this.classItem.count = count;
            if (_this.callbackAction != null) {
                _this.callbackAction(_this.classItem, newValue, oldValue, inputControl);
            }
        };
        this.hideInput = function () {
            _this.classItem.notUsed = true;
            _this.inputControl.value(_this.inputControl.min());
            _this.inputControl.enable(false);
        };
        this.showInput = function (count) {
            _this.classItem.notUsed = false;
            _this.inputControl.value(count);
            _this.inputControl.enable(true);
        };
        this.cell = cell;
        this.classItem = classItem;
        this.callbackAction = callback;
        this.addLabel = addLabel;
        this.init();
    }
    return StudentClassInputContainer;
}());
var KendoHelper = (function () {
    function KendoHelper() {
        var _this = this;
        this.integerFormat = "n0";
        this.createClassInputContainer = function (cell, studentCount, classNo, bandNo, callbackChangeEvent, addLabel) {
            if (studentCount === void 0) { studentCount = 1; }
            if (bandNo === void 0) { bandNo = 1; }
            if (callbackChangeEvent === void 0) { callbackChangeEvent = null; }
            if (addLabel === void 0) { addLabel = false; }
            if (addLabel) {
                var label = document.createElement("span");
                label.textContent = "Class " + classNo;
                label.setAttribute("style", "margin-right: 5px");
                cell.appendChild(label);
            }
            var element = document.createElement("input");
            element.type = "text";
            element.setAttribute("style", "width: 100px");
            element.id = "class-" + bandNo + "-" + classNo;
            cell.appendChild(element);
            return _this.createClassInputField(element.id, studentCount, callbackChangeEvent);
            ;
        };
        this.createStudentsInputContainer = function (cell, studentCount, classNo, bandNo, callbackChangeEvent, addLabel) {
            if (bandNo === void 0) { bandNo = 1; }
            if (callbackChangeEvent === void 0) { callbackChangeEvent = null; }
            if (addLabel === void 0) { addLabel = false; }
            if (addLabel) {
                var label = document.createElement("span");
                label.textContent = "No. Students";
                label.setAttribute("style", "margin-right: 5px");
                cell.appendChild(label);
            }
            var element = document.createElement("input");
            element.type = "text";
            element.setAttribute("style", "width: 100px");
            element.id = "students-" + bandNo + "-" + classNo;
            cell.appendChild(element);
            return _this.createStudentCountInputControl(element.id, studentCount, callbackChangeEvent);
        };
        this.createLabel = function (cell, description, width, textAlign) {
            if (width === void 0) { width = 150; }
            if (textAlign === void 0) { textAlign = "left"; }
            var label = document.createElement("span");
            label.textContent = description;
            label.setAttribute("style", "margin-right: 5px; width: " + width + "px; textAlign: " + textAlign);
            cell.appendChild(label);
        };
        this.createNumberLabel = function (cell, value, width) {
            if (width === void 0) { width = 150; }
            var label = document.createElement("span");
            label.textContent = value.toString();
            label.setAttribute("style", "margin-right: 5px; width: " + width + "px; text-align: center");
            cell.appendChild(label);
        };
        this.createMultiLineLabel = function (cell, line1, line2, separator) {
            if (separator === void 0) { separator = "/"; }
            var label = document.createElement("span");
            label.textContent = line1 + " " + separator + line2;
            label.setAttribute("style", "margin-right: 5px");
            cell.appendChild(label);
        };
        this.createClassInputField = function (element, studentCount, callbackChangeEvent) {
            if (studentCount === void 0) { studentCount = 1; }
            if (callbackChangeEvent === void 0) { callbackChangeEvent = null; }
            return _this.createNumericTextBox(element, studentCount, 0, 250, _this.integerFormat, callbackChangeEvent);
        };
        this.createClassCountInputControl = function (element, classCount, callbackChangeEvent) {
            if (classCount === void 0) { classCount = 1; }
            if (callbackChangeEvent === void 0) { callbackChangeEvent = null; }
            return _this.createNumericTextBox(element, classCount, 1, 50, _this.integerFormat, callbackChangeEvent);
        };
        // This function convert the passed element id into numerictextbox for student count input textbox
        this.createStudentCountInputControl = function (element, studentCount, callbackChangeEvent) {
            if (studentCount === void 0) { studentCount = 1; }
            if (callbackChangeEvent === void 0) { callbackChangeEvent = null; }
            return _this.createNumericTextBox(element, studentCount, 1, 500, _this.integerFormat, callbackChangeEvent);
        };
        this.createStudentCountInClassInputControl = function (element, classItem, studentCount, // use this property to overwrite the student count in classItem
            callbackChangeEvent) {
            if (studentCount === void 0) { studentCount = 1; }
            if (callbackChangeEvent === void 0) { callbackChangeEvent = null; }
            return _this.createNumericTextBox(element, studentCount, 1, 250, _this.integerFormat, function (value, e) {
                if (classItem) {
                    classItem.count = value;
                }
                if (callbackChangeEvent != null) {
                    var inputControl = e;
                    callbackChangeEvent(classItem, inputControl);
                }
            });
        };
        // Input control to enter the number of students in a band in a bandset
        this.createStudentCountInBandInputControl = function (element, bandItem, studentCount, // use this property to overwrite the student count in a band
            callbackChangeEvent) {
            if (studentCount === void 0) { studentCount = 1; }
            if (callbackChangeEvent === void 0) { callbackChangeEvent = null; }
            return _this.createNumericTextBox(element, studentCount, 1, 250, _this.integerFormat, function (value, e) {
                if (bandItem) {
                    bandItem.studentCount = value;
                }
                if (callbackChangeEvent != null) {
                    var inputControl = e;
                    callbackChangeEvent(bandItem, inputControl);
                }
            });
        };
        this.createBandCountInBandSetInputControl = function (element, bandSet, bandCount, // use this property to overwrite the band count in bandSet
            callbackChangeEvent) {
            if (callbackChangeEvent === void 0) { callbackChangeEvent = null; }
            return _this.createNumericTextBox(element, bandCount, 1, 250, _this.integerFormat, function (value, e) {
                if (callbackChangeEvent != null) {
                    var inputControl = e;
                    callbackChangeEvent(bandSet, inputControl);
                }
            });
        };
        this.createStudentLanguageGrid = function (element, students, isUnisex) {
            if (element === void 0) { element = "student-language-preferences-list"; }
            var columns;
            if (isUnisex) {
                columns = [
                    { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                    { field: "gender", title: "Sex", width: "80px" },
                    { field: "langPref1", title: "Pref1", width: "80px" },
                    { field: "langPref2", title: "Pref1", width: "80px" },
                    { field: "langPref3", title: "Pref1", width: "80px" }
                ];
            }
            else {
                columns = [
                    { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                    { field: "score", title: "Score", width: "80px" },
                    { field: "langPref1", title: "Pref1", width: "80px" },
                    { field: "langPref2", title: "Pref1", width: "80px" },
                    { field: "langPref3", title: "Pref1", width: "80px" }
                ];
            }
            var studentLanguages = Enumerable.From(students).Select(function (x) { return new StudentClassRow(x); }).ToArray();
            $("#" + element)
                .kendoGrid({
                columns: columns,
                sortable: {
                    mode: "single",
                    allowUnsort: true
                },
                selectable: "row",
                dataSource: studentLanguages
            });
            return $("#" + element).data("kendoGrid");
        };
        this.createUploadControl = function (element, saveUrl, completeCallback) {
            $("#" + element)
                .kendoUpload({
                async: {
                    'saveUrl': saveUrl,
                    'autoUpload': true
                },
                showFileList: false,
                success: completeCallback
            });
            var uploadCtrl = $("#" + element).data("kendoUpload");
            return uploadCtrl;
        };
        this.createNumericTextBox = function (element, defaultValue, min, max, format, callbackChangeEvent) {
            if (defaultValue === void 0) { defaultValue = 0; }
            if (min === void 0) { min = 0; }
            if (max === void 0) { max = 10; }
            if (format === void 0) { format = _this.integerFormat; }
            if (callbackChangeEvent === void 0) { callbackChangeEvent = null; }
            $("#" + element)
                .kendoNumericTextBox({
                options: {},
                change: function (e) {
                    var inputControl = e.sender;
                    if (callbackChangeEvent != null) {
                        callbackChangeEvent(inputControl.value(), inputControl);
                    }
                }
            });
            var numericTextBox = $("#" + element).data("kendoNumericTextBox");
            numericTextBox.options.format = format;
            numericTextBox.value(defaultValue);
            numericTextBox.max(max);
            numericTextBox.min(min);
            return numericTextBox;
        };
        this.createUuid = function () {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";
            var uuid = s.join("");
            return uuid;
        };
    }
    return KendoHelper;
}());
