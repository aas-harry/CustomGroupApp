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
var StudentListControls = (function () {
    function StudentListControls() {
        var _this = this;
        this.createStudentGrid = function (element, isCoedSchool) {
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
            $("#" + element)
                .kendoGrid({
                columns: columns,
                sortable: {
                    mode: "single",
                    allowUnsort: true
                },
                selectable: "row",
                dataSource: []
            });
            return $("#" + element).data("kendoGrid");
        };
        this.createStudentClassInputContainer = function (name, cell, students, isCoedSchool, width, height) {
            if (width === void 0) { width = 300; }
            if (height === void 0) { height = 500; }
            var container = document.createElement("div");
            container.setAttribute("style", "width: " + width + "px; height: " + height + "px; margin: 5px 0 0 0;");
            container.id = name + "-container";
            var gridElement = document.createElement("div");
            gridElement.setAttribute("style", "height: 100%;");
            gridElement.id = name + "-list";
            container.appendChild(gridElement);
            cell.appendChild(container);
            _this.createStudentListGrid(name, gridElement.id, students, isCoedSchool);
        };
        this.createStudentListGrid = function (name, element, students, isCoedSchool) {
            var grid = _this.createStudentGrid(element, isCoedSchool);
            // Populate the grid
            var studentRows = [];
            Enumerable.From(students).ForEach(function (x) { return studentRows.push(new StudentRow(x)); });
            grid.dataSource.data(students);
            grid.refresh();
            grid.resize();
            return grid;
        };
    }
    return StudentListControls;
}());
//# sourceMappingURL=StudentListControls.js.map