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
        this.createStudentClassInputContainer = function (cell, classItem) {
            var element = document.createElement("div");
            element.setAttribute("style", "width: 200px");
            element.id = "class" + classItem.parent.bandNo + "-" + classItem.index;
            cell.appendChild(element);
            return _this.createStudentClassGrid(element.id, classItem);
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
            element.id = "class" + bandNo + "-" + classNo;
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
        this.createStudentClassGrid = function (element, classItem) {
            var grid = _this.createGrid(element);
            $("#" + element).kendoDraggable({
                filter: "tr",
                hint: function (e) {
                    var item = $('<div class="k-grid k-widget" style="background-color: DarkOrange; color: black;"><table><tbody><tr>' + e.html() + '</tr></tbody></table></div>');
                    return item;
                },
                group: "classGroup"
            });
            grid.table.kendoDropTarget({
                drop: function (e) {
                    debugger;
                    var foo = e.draggable.currentTarget.data("uid");
                    //var dataItem = dataSource1.getByUid(e.draggable.currentTarget.data("uid"));
                    //dataSource1.remove(dataItem);
                    //dataSource2.add(dataItem);
                },
                group: "classGroup"
            });
            var students = [];
            Enumerable.From(classItem.students).ForEach(function (x) { return students.push({ 'name': x.name }); });
            grid.dataSource.data(students);
            grid.refresh();
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
        this.createGrid = function (element) {
            $("#" + element).kendoGrid({
                columns: [
                    { field: "name" }
                ],
                dataSource: [
                    { name: "Jane Doe", age: 30 },
                    { name: "John Doe", age: 33 }
                ]
            });
            var grid = $("#" + element).data("kendoGrid");
            return grid;
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
//# sourceMappingURL=kendoHelper.js.map