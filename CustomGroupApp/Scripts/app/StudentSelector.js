var StudentSelector = (function () {
    function StudentSelector() {
        var _this = this;
        this.students = [];
        this.maxRows = 21;
        this.studentCheckboxes = new Array();
        this.commonUtils = new CommonUtils();
        this.kendoHelper = new KendoHelper();
        this.destroy = function () {
            _this.students = [];
            _this.studentCheckboxes = [];
            _this.studentSelectedChanged = undefined;
            if (_this.saveButton) {
                _this.saveButton.options.click = undefined;
                _this.saveButton.destroy();
            }
            if (_this.cancelButton) {
                _this.cancelButton.options.click = undefined;
                _this.cancelButton.destroy();
            }
            // remove window content
            if (_this.windowContent) {
                var parent_1 = _this.windowContent.parentNode;
                parent_1.parentNode.removeChild(parent_1);
            }
        };
        this.createTable = function (element, students, previoustudents, studentSelectedChanged) {
            if (previoustudents === void 0) { previoustudents = []; }
            _this.students = [];
            for (var _i = 0, students_1 = students; _i < students_1.length; _i++) {
                var s = students_1[_i];
                _this.students.push(s.copy());
            }
            _this.studentSelectedChanged = studentSelectedChanged;
            var cnt = 0;
            var maxRows = 3;
            var previousStudentRows = [];
            _this.studentCheckboxes = [];
            _this.container = element;
            if (previoustudents.length > 0) {
                // Create the table
                var previousStudentsContainer = document.createElement("div");
                previousStudentsContainer.setAttribute("style", "padding: 5px; margin-right: 5px; margin-bottom: 5px; overflow: hidden");
                _this.container.appendChild(previousStudentsContainer);
                var descLabel = document.createElement("div");
                descLabel.setAttribute("style", "font-weight: bold; margin-bottom: 5px");
                descLabel
                    .textContent = "Previously selected students, un-check the checkbox to remove students from the list.";
                previousStudentsContainer.appendChild(descLabel);
                var previousTableContainer = document.createElement("div");
                previousTableContainer.setAttribute("style", "overflow-y: hidden; overflow-x: auto");
                var previousStudentsTable = document.createElement("table");
                previousStudentsTable.setAttribute("style", "margin-bottom: 10px");
                previousStudentsContainer.appendChild(previousTableContainer);
                previousTableContainer.appendChild(previousStudentsTable);
                var previousStudentBody = previousStudentsTable.createTBody();
                previousStudentRows.push(previousStudentBody.insertRow());
                for (var _a = 0, _b = Enumerable.From(previoustudents).OrderBy(function (x) { return x.name; }).ToArray(); _a < _b.length; _a++) {
                    var student = _b[_a];
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
            maxRows = _this.maxRows;
            // Increase the height of the available students if nothing selected previously
            if (previoustudents.length === 0) {
                maxRows += 3;
            }
            else if (previoustudents.length === 1) {
                maxRows -= 2;
            }
            else if (previoustudents.length === 2) {
                maxRows -= 3;
            }
            else if (previoustudents.length === 3) {
                maxRows -= 4;
            }
            else if (previoustudents.length > 12) {
                maxRows -= 6;
            }
            else {
                maxRows -= 5;
            }
            // Create the table
            cnt = 0;
            var studentRows = [];
            var availableStudentsContainer = document.createElement("div");
            availableStudentsContainer.setAttribute("style", "padding: 5px; overflow: hidden");
            var label = document.createElement("div");
            label.textContent = "Select one or more students from the list below:";
            label.setAttribute("style", "margin-right: 5px; margin-bottom: 5px; font-weight: bold");
            _this.container.appendChild(availableStudentsContainer);
            availableStudentsContainer.appendChild(label);
            var availableTableContainer = document.createElement("div");
            availableTableContainer.setAttribute("style", "overflow-y: hidden; overflow-x: auto;");
            availableStudentsContainer.appendChild(availableTableContainer);
            var table = document.createElement("table");
            table.setAttribute("style", "margin-bottom: 10px");
            availableTableContainer.appendChild(table);
            var body = table.createTBody();
            studentRows.push(body.insertRow());
            var previousStudentLookup = Enumerable.From(previoustudents).ToDictionary(function (s) { return s.studentId; }, function (s) { return s; });
            for (var _c = 0, _d = Enumerable.From(_this.students).OrderBy(function (x) { return x.name; }).ToArray(); _c < _d.length; _c++) {
                var student = _d[_c];
                if (previousStudentLookup.Contains(student.studentId)) {
                    continue;
                }
                if (cnt > maxRows) {
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
            container.setAttribute("style", "width: 200px; margin-right: 15px");
            cell.appendChild(container);
            var self = _this;
            var checkBox = document.createElement("input");
            checkBox.type = "checkbox";
            checkBox.id = "studentid-" + student.id;
            if (isSelected) {
                checkBox.checked = true;
            }
            if (self.studentSelectedChanged) {
                checkBox.addEventListener("click", function (e) {
                    var tmpCallback = self.studentSelectedChanged;
                    if (tmpCallback) {
                        tmpCallback(1);
                    }
                });
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
            _this.popupWindowContainer = element;
            // create window content
            _this.windowContent = document.createElement("div");
            _this.windowContent.setAttribute("style", "margin: 10px 0 10px 0; overflow: none");
            _this.windowContent.id = "popup-content-" + _this.commonUtils.createUid();
            if (element.childElementCount > 0) {
                while (element.hasChildNodes()) {
                    element.removeChild(element.lastChild);
                }
            }
            element.appendChild(_this.windowContent);
            _this.popupWindow = $("#" + _this.windowContent.id)
                .kendoWindow({
                width: "700px",
                height: "625px",
                modal: true,
                scrollable: true,
                actions: ["Maximize", "Close"],
                resizable: false,
                title: "Select Students"
            })
                .data("kendoWindow");
            // Create save and cancel buttons
            var buttonContainer = document.createElement("div");
            var saveButtonElement = document.createElement("button");
            saveButtonElement.id = "save-button-" + _this.commonUtils.createUid();
            saveButtonElement.textContent = "Save";
            saveButtonElement.setAttribute("style", "margin-left: 2.5px; margin-right: 2.5px");
            var cancelButtonElement = document.createElement("button");
            cancelButtonElement.id = "cancel-button-" + _this.commonUtils.createUid();
            cancelButtonElement.textContent = "Cancel";
            buttonContainer.setAttribute("style", "margin: 0 5px 5px 0px");
            buttonContainer.appendChild(saveButtonElement);
            buttonContainer.appendChild(cancelButtonElement);
            _this.windowContent.appendChild(buttonContainer);
            var self = _this;
            _this.saveButton = _this.kendoHelper.createKendoButton(saveButtonElement.id, function (e) {
                var selectedStudents = self.selectedStudents();
                var tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(selectedStudents);
                }
                self.popupWindow.close();
                self.destroy();
            });
            _this.cancelButton = _this.kendoHelper.createKendoButton(cancelButtonElement.id, function (e) {
                self.popupWindow.close();
                self.destroy();
            });
            _this.createTable(_this.windowContent, students, previoustudents, null);
            $("#" + _this.windowContent.id).parent().addClass("h-window-caption");
            _this.popupWindow.center().open();
        };
        this.selectedStudents = function () {
            var selectedStudents = new Array();
            var lookup = Enumerable.From(_this.students).ToDictionary(function (x) { return x.id; }, function (x) { return x; });
            Enumerable.From(_this.studentCheckboxes)
                .Where(function (x) { return x.checked; })
                .ForEach(function (x) {
                var studentid = parseInt(_this.commonUtils.getUid(x.id));
                if (lookup.Contains(studentid)) {
                    selectedStudents.push(lookup.Get(studentid));
                }
            });
            return selectedStudents;
        };
    }
    return StudentSelector;
}());
//# sourceMappingURL=StudentSelector.js.map