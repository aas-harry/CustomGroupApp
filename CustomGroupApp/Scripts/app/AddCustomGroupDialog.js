var AddCustomGroupDialog = (function () {
    function AddCustomGroupDialog() {
        var _this = this;
        this.students = [];
        this.maxRows = 21;
        this.studentCheckboxes = new Array();
        this.commonUtils = new CommonUtils();
        this.kendoHelper = new KendoHelper();
        this.messageBox = new MessageBoxDialog();
        this.createTable = function (element, students) {
            var cnt = 0;
            _this.studentCheckboxes = [];
            _this.container = element;
            // Create the table
            cnt = 0;
            var studentRows = [];
            var availableStudentsContainer = document.createElement("div");
            availableStudentsContainer.setAttribute("style", "padding: 5px; overflow-y: none; overflow-x: auto");
            var label = document.createElement("div");
            label.textContent = "Select one or more students from the list below:";
            label.setAttribute("style", "margin-right: 5px; margin-bottom: 5px; font-weight: bold");
            _this.container.appendChild(availableStudentsContainer);
            availableStudentsContainer.appendChild(label);
            var table = document.createElement("table");
            availableStudentsContainer.appendChild(table);
            var body = table.createTBody();
            studentRows.push(body.insertRow());
            for (var _i = 0, _a = Enumerable.From(students).OrderBy(function (x) { return x.name; }).ToArray(); _i < _a.length; _i++) {
                var student = _a[_i];
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
            container.setAttribute("style", "width: 200px; margin-right: 15px");
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
        this.openDialog = function (element, students, callback, maxRows) {
            if (maxRows === void 0) { maxRows = null; }
            if (maxRows) {
                _this.maxRows = _this.maxRows;
            }
            // create window content
            var window = document.createElement("div");
            window.setAttribute("style", "margin: 10px 0 10px 0; overflow: none");
            window.id = _this.commonUtils.createUid();
            if (element.childElementCount > 0) {
                while (element.hasChildNodes()) {
                    element.removeChild(element.lastChild);
                }
            }
            element.appendChild(window);
            _this.popupWindow = $("#" + window.id)
                .kendoWindow({
                width: "700px",
                height: "625px",
                modal: true,
                scrollable: true,
                actions: ["Maximize", "Close"],
                resizable: false,
                title: 'Add a Custom Group'
            })
                .data("kendoWindow");
            var buttonContainer = document.createElement("div");
            var saveButtonElement = document.createElement("button");
            saveButtonElement.id = "save-button";
            saveButtonElement.textContent = "Save";
            saveButtonElement.setAttribute("style", "margin-left: 2.5px; margin-right: 2.5px");
            var cancelButtonElement = document.createElement("button");
            cancelButtonElement.id = "cancel-button";
            cancelButtonElement.textContent = "Cancel";
            buttonContainer.setAttribute("style", "margin: 0 5px 5px 0px");
            buttonContainer.appendChild(saveButtonElement);
            buttonContainer.appendChild(cancelButtonElement);
            window.appendChild(buttonContainer);
            var groupNameContainer = document.createElement("div");
            groupNameContainer.setAttribute("style", "padding: 5px");
            var groupNameLabel = document.createElement("label");
            groupNameLabel.textContent = "Enter Group Name:";
            var groupNameTextbox = document.createElement("input");
            groupNameTextbox.type = "text";
            groupNameTextbox.id = "group-name";
            groupNameTextbox.setAttribute("style", "width: 300px; margin-left: 5px");
            groupNameTextbox.setAttribute("class", "k-textbox");
            groupNameContainer.setAttribute("placeholder", "enter group name");
            groupNameContainer.appendChild(groupNameLabel);
            groupNameContainer.appendChild(groupNameTextbox);
            window.appendChild(groupNameContainer);
            _this.groupNameElement = groupNameTextbox;
            _this.createTable(window, students);
            _this.kendoHelper.createKendoButton("save-button", function (e) {
                var groupName = _this.groupNameElement.value;
                if (!groupName) {
                    return;
                }
                var selectedStudents = new Array();
                var lookup = Enumerable.From(students).ToDictionary(function (x) { return x.id; }, function (x) { return x; });
                Enumerable.From(_this.studentCheckboxes)
                    .Where(function (x) { return x.checked; })
                    .ForEach(function (x) {
                    var studentid = parseInt(_this.commonUtils.getUid(x.id));
                    if (lookup.Contains(studentid)) {
                        selectedStudents.push(lookup.Get(studentid));
                    }
                });
                _this.popupWindow.close().destroy();
                var tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(groupName, selectedStudents);
                }
            });
            _this.kendoHelper.createKendoButton("cancel-button", function (e) {
                _this.popupWindow.close().destroy();
            });
            $("#" + window.id).parent().addClass("h-window-caption");
            _this.popupWindow.center().open();
        };
    }
    return AddCustomGroupDialog;
}());
//# sourceMappingURL=AddCustomGroupDialog.js.map