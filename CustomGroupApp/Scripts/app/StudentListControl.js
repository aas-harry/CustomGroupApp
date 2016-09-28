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
var StudentListControl = (function () {
    function StudentListControl() {
        var _this = this;
        this.createClassGrid = function (element, isCoedSchool) {
            var columns;
            if (isCoedSchool) {
                columns = [
                    { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                    { field: "gender", title: "Sex", width: "80px", attributes: { 'class': "text-center" } },
                    { field: "score", title: "Score", width: "80px", attributes: { 'class': "text-center" } },
                    { field: "id", title: "Id", width: "0px", attributes: { 'class': "text-nowrap" } }
                ];
            }
            else {
                columns = [
                    { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                    { field: "score", title: "Score", width: "80px", attributes: { 'class': "text-center" } },
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
        this.createStudentClassGrid = function (element, students, isCoedSchool) {
            var grid = _this.createClassGrid(element, isCoedSchool);
            // Populate the grid
            var studentRows = [];
            Enumerable.From(students).ForEach(function (x) { return studentRows.push(new StudentRow(x)); });
            grid.dataSource.data(students);
            grid.refresh();
            grid.resize();
            return grid;
        };
    }
    return StudentListControl;
}());
//# sourceMappingURL=StudentListControl.js.map