var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StudentClassRow = (function (_super) {
    __extends(StudentClassRow, _super);
    function StudentClassRow(student) {
        var _this = this;
        _super.call(this, null);
        this.hasLanguagePrefs = false;
        this.convert = function (student) {
            _this.id = student.id;
            _this.name = student.name;
            _this.gender = student.gender;
            _this.score = student.score;
            _this.class = student.classNo;
            _this.langPref1 = student.langPref1;
            _this.langPref2 = student.langPref2;
            _this.langPref3 = student.langPref3;
            if (_this.langPref1 !== "" || _this.langPref2 !== "" || _this.langPref3 !== "") {
                _this.hasLanguagePrefs = true;
            }
        };
        this.convert(student);
    }
    return StudentClassRow;
}(kendo.data.ObservableObject));
var KendoHelper = (function () {
    function KendoHelper() {
        var _this = this;
        this.integerFormat = "n0";
        this.createBandInputContainer = function (cell, bandNo, classCount, callback, addLabel) {
            if (classCount === void 0) { classCount = 1; }
            if (addLabel === void 0) { addLabel = false; }
            if (addLabel) {
                var label = document.createElement("span");
                label.textContent = "Band " + bandNo;
                label.setAttribute("style", "margin-right: 5px");
                cell.appendChild(label);
            }
            var element = document.createElement("input");
            element.type = "text";
            element.setAttribute("style", "width: 100px");
            element.id = "band-" + bandNo;
            cell.appendChild(element);
            return _this.createBandInputField(element.id, classCount, callback);
        };
        this.createStudentClassInputContainer = function (cell, classItem, editGroupNameCallback, dropCallback) {
            var classGridHeight = classItem.parent.classes.length > 3 ? "500px" : "700px";
            var container = document.createElement("div");
            container.setAttribute("style", "width: 300px; height: " + classGridHeight + "; margin: 5px 0 0 0;");
            container.id = "class-" + classItem.uid + "-container";
            var gridElement = document.createElement("div");
            gridElement.setAttribute("style", "height: 100%;");
            gridElement.id = "class-" + classItem.uid;
            var summaryElement = _this.createClassSummary(classItem);
            container.appendChild(gridElement);
            cell.appendChild(container);
            cell.appendChild(summaryElement);
            return _this.createStudentClassGrid(gridElement.id, classItem, editGroupNameCallback, dropCallback);
            ;
        };
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
            return _this.createStudentsInputField(element.id, studentCount, callbackChangeEvent);
        };
        this.createLabel = function (cell, description) {
            var label = document.createElement("span");
            label.textContent = description;
            label.setAttribute("style", "margin-right: 5px");
            cell.appendChild(label);
        };
        this.createMultiLineLabel = function (cell, line1, line2, separator) {
            if (separator === void 0) { separator = "/"; }
            var label = document.createElement("span");
            label.textContent = line1;
            label.setAttribute("style", "margin-right: 5px");
            cell.appendChild(label);
        };
        this.createStudentClassGrid = function (element, classItem, editGroupNameCallback, dropCallback) {
            var grid = _this.createClassGrid(element, classItem, editGroupNameCallback);
            $("#" + element).kendoDraggable({
                filter: "tr",
                hint: function (e) {
                    var studentId = e[0].cells[0].textContent;
                    var studentName = e[0].cells[1].textContent;
                    return $("<div id=\"student-" + studentId + "\" class=\"k-grid k-widget\" style=\"background-color: DarkOrange; color: black; margin=2px\">" + studentName + "</div>");
                },
                group: "classGroup"
            });
            grid.table.kendoDropTarget({
                drop: function (e) {
                    var targetObject = (Object)(e.draggable.currentTarget[0]);
                    var studentId = parseInt(targetObject.cells[0].textContent);
                    var sourceClass = $(e.draggable.element).attr('id');
                    if (dropCallback("class-" + classItem.uid, sourceClass, studentId)) {
                        var sourceGrid = $("#" + sourceClass).data("kendoGrid");
                        var targetGrid = $("#class-" + classItem.uid).data("kendoGrid");
                        var sourceDatasource = sourceGrid.dataSource.view();
                        var targetDatasource = targetGrid.dataSource.view();
                        for (var i = 0; i < sourceDatasource.length; i++) {
                            if (sourceDatasource[i].id === studentId) {
                                var student = sourceDatasource[i];
                                sourceDatasource.remove(student);
                                targetDatasource.push(student);
                                sourceGrid.refresh();
                                targetGrid.refresh();
                            }
                        }
                    }
                },
                group: "classGroup"
            });
            // Populate the grid
            var students = [];
            Enumerable.From(classItem.students).ForEach(function (x) { return students.push(new StudentClassRow(x)); });
            grid.dataSource.data(students);
            grid.refresh();
            grid.resize();
            return grid;
        };
        this.createClassInputField = function (element, studentCount, callbackChangeEvent) {
            if (studentCount === void 0) { studentCount = 1; }
            if (callbackChangeEvent === void 0) { callbackChangeEvent = null; }
            return _this.createNumericTextBox(element, studentCount, 0, 250, _this.integerFormat, callbackChangeEvent);
        };
        this.createBandInputField = function (element, classCount, callbackChangeEvent) {
            if (classCount === void 0) { classCount = 1; }
            if (callbackChangeEvent === void 0) { callbackChangeEvent = null; }
            return _this.createNumericTextBox(element, classCount, 1, 5, _this.integerFormat, callbackChangeEvent);
        };
        this.createStudentsInputField = function (element, studentCount, callbackChangeEvent) {
            if (studentCount === void 0) { studentCount = 1; }
            if (callbackChangeEvent === void 0) { callbackChangeEvent = null; }
            return _this.createNumericTextBox(element, studentCount, 1, 250, _this.integerFormat, callbackChangeEvent);
        };
        this.createStudentCountInClassInputControl = function (element, classItem, studentCount, // use this property to overwrite the student count in classItem
            callbackChangeEvent) {
            if (studentCount === void 0) { studentCount = 1; }
            if (callbackChangeEvent === void 0) { callbackChangeEvent = null; }
            return _this.createNumericTextBox(element, studentCount, 1, 250, _this.integerFormat, function (e) {
                var inputControl = e.sender;
                if (classItem && inputControl) {
                    classItem.count = inputControl.value();
                }
                if (callbackChangeEvent != null) {
                    callbackChangeEvent(classItem, inputControl);
                }
            });
        };
        // Input control to enter the number of students in a band in a bandset
        this.createStudentCountInBandInputControl = function (element, bandItem, studentCount, // use this property to overwrite the student count in a band
            callbackChangeEvent) {
            if (studentCount === void 0) { studentCount = 1; }
            if (callbackChangeEvent === void 0) { callbackChangeEvent = null; }
            return _this.createNumericTextBox(element, studentCount, 1, 250, _this.integerFormat, function (e) {
                var inputControl = e.sender;
                if (bandItem && inputControl) {
                    bandItem.studentCount = inputControl.value();
                }
                if (callbackChangeEvent != null) {
                    callbackChangeEvent(bandItem, inputControl);
                }
            });
        };
        this.createBandCountInBandSetInputControl = function (element, bandSet, bandCount, // use this property to overwrite the band count in bandSet
            callbackChangeEvent) {
            if (callbackChangeEvent === void 0) { callbackChangeEvent = null; }
            return _this.createNumericTextBox(element, bandCount, 1, 250, _this.integerFormat, function (e) {
                var inputControl = e.sender;
                if (callbackChangeEvent != null) {
                    callbackChangeEvent(bandSet, inputControl);
                }
            });
        };
        this.createClassGrid = function (element, classItem, editGroupCallback) {
            var groupNameElementId = "groupname-" + classItem.uid;
            $("#" + element)
                .kendoGrid({
                columns: [
                    { field: "id", title: "studentId", width: "30px", hidden: true },
                    { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                    { field: "score", title: "Score", width: "80px", attributes: { 'class': "text-center" } }
                ],
                toolbar: [{ template: kendo.template("Group Name: <input id='" + groupNameElementId + "' style='margin: 0 5px 0 5px' />") }],
                selectable: "row",
                dataSource: []
            });
            $("#" + groupNameElementId)
                .kendoMaskedTextBox({
                value: classItem.name,
                change: editGroupCallback
            });
            // Create name tooltip
            $("#" + element).kendoTooltip({
                filter: "td:nth-child(1)",
                position: "center",
                content: function (e) {
                    var dataItem = $("#" + element).data("kendoGrid").dataItem(e.target.closest("tr"));
                    var student = dataItem;
                    var tooltipText = "<strong>" + student.name + "</strong><br>Gender: " + student.gender + "<br>Composite Score: " + student.score;
                    tooltipText += "<br>Id: " + student.id;
                    if (student.hasLanguagePrefs) {
                        tooltipText += "<br>1st Language Pref: " + (student.langPref1 === "" ? "None" : student.langPref1);
                        tooltipText += "<br>2nd Language Pref: " + (student.langPref2 === "" ? "None" : student.langPref2);
                        tooltipText += "<br>3rd Language Pref: " + (student.langPref3 === "" ? "None" : student.langPref3);
                    }
                    return "<div style='text-align: left; margin: 10px; padding: 5px'>" + tooltipText + "</div>";
                }
            }).data("kendoTooltip");
            return $("#" + element).data("kendoGrid");
        };
        this.createClassSummary = function (classItem) {
            var element = document.createElement("div");
            element.setAttribute("style", "border-style: solid; border-color: #bfbfbf; border-width: 1px; padding: 5px 5px 5px 10px; margin: 5px 0 0 0");
            var elementCnt = document.createElement("div");
            elementCnt.textContent = "No. of Students: " + classItem.count;
            var elementAvg = document.createElement("div");
            elementAvg.textContent = "Composite Score Avg.: " + Math.round(classItem.average);
            element.appendChild(elementCnt);
            element.appendChild(elementAvg);
            return element;
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
                change: callbackChangeEvent
            });
            var numericTextBox = $("#" + element).data("kendoNumericTextBox");
            numericTextBox.options.format = format;
            numericTextBox.value(defaultValue);
            numericTextBox.max(max);
            numericTextBox.min(min);
            return numericTextBox;
        };
    }
    return KendoHelper;
}());
