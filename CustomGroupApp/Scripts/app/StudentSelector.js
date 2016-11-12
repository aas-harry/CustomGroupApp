var StudentSelector = (function () {
    function StudentSelector(maxRows) {
        var _this = this;
        if (maxRows === void 0) { maxRows = 40; }
        this.maxRows = maxRows;
        this.students = [];
        this.studentCheckboxes = new Array();
        this.commonUtils = new CommonUtils();
        this.kendoHelper = new KendoHelper();
        this.createTable = function (element, students, previoustudents) {
            if (previoustudents === void 0) { previoustudents = []; }
            var cnt = 0;
            var previousStudentRows = [];
            _this.studentCheckboxes = [];
            _this.container = element;
            if (previoustudents.length > 0) {
                // Create the table
                var label_1 = document.createElement("div");
                label_1.textContent = "Previously selected students, un-check the checkbox to remove students from the list.";
                label_1.setAttribute("style", "margin-right: 5px; margin-bottom: 5px; font-weight: bold");
                _this.container.appendChild(label_1);
                var previousStudentsTable = document.createElement("table");
                _this.container.appendChild(previousStudentsTable);
                var previousStudentBody = previousStudentsTable.createTBody();
                var maxRows = 3;
                previousStudentRows.push(previousStudentBody.insertRow());
                for (var _i = 0, _a = Enumerable.From(previoustudents).OrderBy(function (x) { return x.name; }).ToArray(); _i < _a.length; _i++) {
                    var student = _a[_i];
                    if (cnt > maxRows) {
                        cnt = 0;
                    }
                    if (cnt >= previousStudentRows.length) {
                        previousStudentRows.push(previousStudentBody.insertRow());
                    }
                    _this.createStudentCell(previousStudentRows[cnt]
                        .insertCell(), student, true);
                    cnt++;
                }
                _this.container.appendChild(document.createElement("hr"));
            }
            // Create the table
            cnt = 0;
            var studentRows = [];
            var label = document.createElement("div");
            label.textContent = "Select one or more students from the list below:";
            label.setAttribute("style", "margin-right: 5px; margin-bottom: 5px; font-weight: bold");
            _this.container.appendChild(label);
            var table = document.createElement("table");
            _this.container.appendChild(table);
            var body = table.createTBody();
            studentRows.push(body.insertRow());
            var previousStudentLookup = Enumerable.From(previoustudents).ToDictionary(function (s) { return s.studentId; }, function (s) { return s; });
            for (var _b = 0, _c = Enumerable.From(students).OrderBy(function (x) { return x.name; }).ToArray(); _b < _c.length; _b++) {
                var student = _c[_b];
                if (previousStudentLookup.Contains(student.studentId)) {
                    continue;
                }
                if (cnt > _this.maxRows) {
                    cnt = 0;
                }
                if (cnt >= studentRows.length) {
                    studentRows.push(body.insertRow());
                }
                _this.createStudentCell(studentRows[cnt]
                    .insertCell(), student);
                cnt++;
            }
        };
        this.createStudentCell = function (cell, student, isSelected) {
            if (isSelected === void 0) { isSelected = false; }
            var container = document.createElement("div");
            container.setAttribute("style", "width: 220px");
            cell.appendChild(container);
            var checkBox = document.createElement("input");
            checkBox.type = "checkbox";
            checkBox.id = "studentid-" + student.id;
            if (isSelected) {
                checkBox.checked = true;
            }
            _this.studentCheckboxes.push(checkBox);
            container.appendChild(checkBox);
            var label = document.createElement("span");
            label.textContent = student.name;
            label.setAttribute("style", "margin-left: 5px");
            container.appendChild(label);
        };
        this.openDialog = function (element, students, previoustudents, callback, maxRows) {
            if (previoustudents === void 0) { previoustudents = []; }
            if (maxRows === void 0) { maxRows = null; }
            if (maxRows) {
                _this.maxRows = _this.maxRows;
            }
            // create window content
            var window = document.createElement("div");
            window.id = _this.commonUtils.createUid();
            if (element.childElementCount > 0) {
                while (element.hasChildNodes()) {
                    element.removeChild(element.lastChild);
                }
            }
            element.appendChild(window);
            var buttonContainer = document.createElement("div");
            var saveButton = _this.kendoHelper.createButton("Save");
            var cancelButton = _this.kendoHelper.createButton("Cancel");
            buttonContainer.setAttribute("style", "margin: 0 5px 5px 0px");
            buttonContainer.appendChild(saveButton);
            buttonContainer.appendChild(cancelButton);
            window.appendChild(buttonContainer);
            _this.createTable(window, students, previoustudents);
            var popupWindow = $("#" + window.id).kendoWindow({
                width: "690px",
                height: "705px",
                modal: true,
                scrollable: true,
                actions: ["Maximize", "Close"],
                resizable: false,
                title: 'Select Students'
            }).data("kendoWindow");
            cancelButton.onclick = function () {
                popupWindow.close();
            };
            saveButton.onclick = function () {
                var selectedStudents = new Array();
                var lookup = Enumerable.From(students).ToDictionary(function (x) { return x.id; }, function (x) { return x; });
                Enumerable.From(_this.studentCheckboxes).Where(function (x) { return x.checked; }).ForEach(function (x) {
                    var studentid = parseInt(_this.commonUtils.getUid(x.id));
                    if (lookup.Contains(studentid)) {
                        selectedStudents.push(lookup.Get(studentid));
                    }
                });
                popupWindow.close();
                var tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(selectedStudents);
                }
            };
            $("#" + window.id).parent().addClass("h-window-caption");
            popupWindow.center().open();
        };
    }
    return StudentSelector;
}());
//# sourceMappingURL=StudentSelector.js.map