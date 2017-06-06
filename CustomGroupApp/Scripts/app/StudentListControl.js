var StudentListControl = (function () {
    function StudentListControl(elementName) {
        var _this = this;
        this.elementName = elementName;
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
        this.create = function (name, studentSelectedCallback, width, height) {
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
            if (height > 0) {
                container.setAttribute("style", "width: " + width + "px; height: " + height + "px; margin: 5px 0 0 0;");
            }
            else {
                container.setAttribute("style", "width: " + width + "px; height: 100%; margin: 5px 0 0 0;");
            }
            container.id = name + "-" + _this.commonUtils.createUid() + "-container";
            var gridElement = document.createElement("div");
            gridElement.setAttribute("style", "height: 100%;");
            gridElement.id = name + "-" + _this.commonUtils.createUid() + "-list";
            container.appendChild(gridElement);
            _this.hostElement.appendChild(container);
            var self = _this;
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
                dataSource: [],
                change: function (e) {
                    var gridControl = e.sender;
                    var row = gridControl.select().closest("tr");
                    var studentRow = gridControl.dataItem(row);
                    if (!studentRow) {
                        return;
                    }
                    var student = Enumerable.From(self.students).FirstOrDefault(null, function (x) { return x.studentId === studentRow.id; });
                    var tmpCallback = studentSelectedCallback;
                    if (tmpCallback != null) {
                        tmpCallback(student);
                    }
                },
                dataBound: function (e) {
                    var grid = e.sender;
                    if (grid) {
                        grid.select("tr:eq(0)");
                    }
                }
            });
            _this.gridControl = $("#" + gridElement.id).data("kendoGrid");
            return _this.self;
        };
        this.selectRow = function (index) {
            if (index === void 0) { index = 0; }
            var models = _this.gridControl.dataSource.view();
            var student = models[index];
            //find the target row element:
            var row = _this.gridControl.table.find("[data-uid=" + student.uid + "]");
            if (row) {
                _this.gridControl.select(row);
            }
        };
        this.setDatasource = function (students) {
            // Populate the grid
            _this.students = students;
            var studentRows = [];
            Enumerable.From(students).ForEach(function (x) { return studentRows.push(new StudentRow(x)); });
            _this.gridControl.dataSource.data(studentRows);
            _this.gridControl.refresh();
            _this.gridControl.resize();
            return _this.self;
        };
        this.refresh = function () {
            if (!_this.gridControl) {
                return;
            }
            _this.gridControl.resize();
        };
        this.hostElement = document.getElementById(elementName);
    }
    return StudentListControl;
}());
//# sourceMappingURL=StudentListControl.js.map