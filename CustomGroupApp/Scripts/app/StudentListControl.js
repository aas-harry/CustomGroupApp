var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StudentRow = (function (_super) {
    __extends(StudentRow, _super);
    function StudentRow(student) {
        var _this = this;
        _super.call(this, null);
        this.convert = function (student) {
            _this.id = student.studentId;
            _this.name = student.name;
            _this.gender = student.sex;
        };
        this.convert(student);
    }
    return StudentRow;
}(kendo.data.ObservableObject));
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
            for (var _b = 0, _c = Enumerable.From(students).OrderBy(function (x) { return x.name; }).ToArray(); _b < _c.length; _b++) {
                var student = _c[_b];
                if (previoustudents.indexOf(student) >= 0) {
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
                previoustudents.splice(0, previoustudents.length);
                var lookup = Enumerable.From(students).ToDictionary(function (x) { return x.id; }, function (x) { return x; });
                Enumerable.From(_this.studentCheckboxes).Where(function (x) { return x.checked; }).ForEach(function (x) {
                    var studentid = parseInt(_this.commonUtils.getUid(x.id));
                    if (lookup.Contains(studentid)) {
                        previoustudents.push(lookup.Get(studentid));
                    }
                });
                popupWindow.close();
                var tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(previoustudents);
                }
            };
            $("#" + window.id).parent().addClass("h-window-caption");
            popupWindow.center().open();
        };
    }
    return StudentSelector;
}());
var StudentListControl = (function () {
    function StudentListControl(hostElement) {
        var _this = this;
        this.hostElement = hostElement;
        this.commonUtils = new CommonUtils();
        this.self = this;
        this.setColumns = function (isCoedSchool) {
            var columns;
            if (isCoedSchool) {
                columns = [
                    { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                    { field: "gender", title: "Sex", width: "80px", attributes: { 'class': "text-center" } },
                    { field: "id", title: "Id", width: "0px", attributes: { 'class': "text-nowrap" } }
                ];
            }
            else {
                columns = [
                    { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                    { field: "id", title: "Id", width: "0px", attributes: { 'class': "text-nowrap" } }
                ];
            }
            var options = _this.gridControl.options;
            options.columns.splice(0, options.columns.length);
            for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
                var column = columns_1[_i];
                options.columns.push(column);
            }
            _this.gridControl.setOptions(options);
            return _this.self;
        };
        this.create = function (name, width, height) {
            if (name === void 0) { name = "students"; }
            if (width === void 0) { width = 300; }
            if (height === void 0) { height = 500; }
            if (_this.hostElement.childElementCount > 0) {
                while (_this.hostElement.hasChildNodes()) {
                    _this.hostElement.removeChild(_this.hostElement.lastChild);
                }
            }
            // Create HTML element for hosting the grid control
            var container = document.createElement("div");
            container.setAttribute("style", "width: " + width + "px; height: " + height + "px; margin: 5px 0 0 0;");
            container.id = name + "-" + _this.commonUtils.createUid() + "-container";
            var gridElement = document.createElement("div");
            gridElement.setAttribute("style", "height: 100%;");
            gridElement.id = name + "-" + _this.commonUtils.createUid() + "-list";
            container.appendChild(gridElement);
            _this.hostElement.appendChild(container);
            $("#" + gridElement.id)
                .kendoGrid({
                columns: [
                    { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } }
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: true
                },
                selectable: "row",
                dataSource: []
            });
            _this.gridControl = $("#" + gridElement.id).data("kendoGrid");
            return _this.self;
        };
        this.setDatasource = function (students) {
            // Populate the grid
            var studentRows = [];
            Enumerable.From(students).ForEach(function (x) { return studentRows.push(new StudentRow(x)); });
            _this.gridControl.dataSource.data(studentRows);
            _this.gridControl.refresh();
            _this.gridControl.resize();
            return _this.self;
        };
    }
    return StudentListControl;
}());
//# sourceMappingURL=StudentListControl.js.map