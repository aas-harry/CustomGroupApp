var StudentSetListControl = (function () {
    function StudentSetListControl() {
        var _this = this;
        this.kendoHelper = new KendoHelper();
        this.commonUtils = new CommonUtils();
        this.createStudentSetContainer = function (name, cell, studentSets, isCoedSchool, width, height) {
            if (width === void 0) { width = 600; }
            if (height === void 0) { height = 200; }
            _this.uid = _this.commonUtils.createUid();
            var container = document.createElement("div");
            container.setAttribute("style", "width: " + width + "px; height: " + height + "px; margin: 5px 0 0 0;");
            container.id = name + "-studentsets-" + _this.uid + "-container";
            var gridElement = document.createElement("div");
            gridElement.setAttribute("style", "height: 100%;");
            gridElement.id = name + "-studentsets-" + _this.uid;
            container.appendChild(gridElement);
            cell.appendChild(container);
            return _this.createStudentSetGrid(name, gridElement.id, studentSets);
            ;
        };
        this.createStudentSetGrid = function (name, element, studentSets) {
            var grid = _this.createStudentSetGridControl(name, element);
            // Populate the grid
            var students = [];
            Enumerable.From(studentSets).ForEach(function (x) { return students.push({ 'names': x.studentList, 'myuid': x.uid }); });
            grid.dataSource.data(students);
            grid.refresh();
            grid.resize();
            return grid;
        };
        this.createStudentSetGridControl = function (name, element) {
            var btnStyle = "style = 'margin-right: 2px'";
            var btnClass = "class='btn-xs btn-default'";
            var columns = [
                {
                    field: "names", width: "400px", attributes: { 'class': "text-nowrap" },
                    template: function (dataItem) {
                        return ("<button " + btnClass + " id='studentid-" + dataItem.myuid + "' data-bind='click: editPairStudent' " + btnStyle + "'><i class='fa fa-edit'></i></button>") +
                            ("<button " + btnClass + " id='studentid-" + dataItem.myuid + "' data-bind='click: deletePairStudent' " + btnStyle + "><i class='fa fa-remove'></i></button>") +
                            ("<span>" + dataItem.names + " </span>");
                    },
                    headerTemplate: "<button " + btnClass + " id='" + name + "-add' style='margin: 0 5px 0 5px'>Add " + name + " Students list</button>"
                }
            ];
            $("#" + element)
                .kendoGrid({
                columns: columns,
                sortable: false,
                selectable: "row",
                dataSource: []
            });
            var grid = $("#" + element).data("kendoGrid");
            return grid;
        };
    }
    return StudentSetListControl;
}());
//# sourceMappingURL=StudentSetListControl.js.map