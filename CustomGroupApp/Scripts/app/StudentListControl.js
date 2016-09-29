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
    function StudentSelector() {
    }
    StudentSelector.prototype.constuctor = function (element, students, selectedStudents) {
    };
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
            for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
                var column = columns_1[_i];
                _this.gridControl.columns.push(column);
            }
            return _this.self;
        };
        this.create = function (name, width, height) {
            if (name === void 0) { name = "students"; }
            if (width === void 0) { width = 300; }
            if (height === void 0) { height = 500; }
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
                columns: [],
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
            debugger;
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