var StudentSetListControl = (function () {
    function StudentSetListControl(name, studentSets, students, popupWindowElement) {
        var _this = this;
        if (students === void 0) { students = []; }
        this.name = name;
        this.studentSets = studentSets;
        this.students = students;
        this.popupWindowElement = popupWindowElement;
        this.kendoHelper = new KendoHelper();
        this.commonUtils = new CommonUtils();
        this.createStudentSetContainer = function (cell, isCoedSchool, width, height) {
            if (width === void 0) { width = 600; }
            if (height === void 0) { height = 200; }
            var container = document.createElement("div");
            container.setAttribute("style", "width: " + width + "px; height: " + height + "px; margin: 5px 0 0 0;");
            container.id = _this.name + "-studentsets-" + _this.uid + "-container";
            var gridElement = document.createElement("div");
            gridElement.setAttribute("style", "height: 100%;");
            gridElement.id = _this.name + "-studentsets-" + _this.uid;
            container.appendChild(gridElement);
            cell.appendChild(container);
            return _this.createStudentSetGrid(_this.name, gridElement.id);
        };
        this.onAddPairStudent = function (elementId) {
            if (!_this.gridControl || !_this.isEqual(elementId)) {
                return false;
            }
            var studentSelector = new StudentSelector(20);
            studentSelector.openDialog(_this.popupWindowElement, _this.students, [], function (students) {
                var studentSet = new StudentSet();
                studentSet.students = students;
                _this.studentSets.push(studentSet);
                _this.setDataSource();
            }, 30);
            return true;
        };
        this.onEditPairStudent = function (elementId) {
            if (!_this.gridControl || !_this.isEqual(elementId)) {
                return false;
            }
            var selectedItem = _this.selectedItem;
            if (selectedItem != null) {
                var studentSet_1 = _this.findStudentSetItem(selectedItem.get("studentSetId"));
                var studentSelector = new StudentSelector(20);
                studentSelector.openDialog(_this.popupWindowElement, _this.students, studentSet_1.students, function (students) {
                    studentSet_1.students = students;
                    _this.gridControl.dataSource.data(_this.studentSets);
                    _this.gridControl.refresh();
                });
                return true;
            }
            return false;
        };
        this.onDeletePairStudent = function (elementId) {
            if (!_this.gridControl || !_this.isEqual(elementId)) {
                return false;
            }
            var selectedItem = _this.selectedItem;
            if (selectedItem != null) {
                var data = _this.gridControl.dataSource.view();
                data.remove(selectedItem);
                _this.gridControl.refresh();
                var studentSet = _this.findStudentSetItem(selectedItem.get("studentSetId"));
                if (studentSet) {
                    var index = _this.studentSets.indexOf(studentSet);
                    _this.studentSets.splice(index, 1);
                }
                return true;
            }
            return false;
        };
        this.createStudentSetGrid = function (name, element) {
            _this.gridControl = _this.createStudentSetGridControl(name, element);
            // Populate the grid
            _this.setDataSource();
            _this.gridControl.resize();
            return _this.gridControl;
        };
        this.createStudentSetGridControl = function (name, element) {
            var btnStyle = "style = 'margin-right: 2px'";
            var btnClass = "class='btn-xs btn-default'";
            var columns = [
                {
                    field: "studentList", width: "400px", attributes: { 'class': "text-nowrap" },
                    headerTemplate: ("<button " + btnClass + " id='" + name + "-add' style='margin: 0 5px 0 5px' data-bind='click: addPairStudent'>Add " + name + " Students list</button>") +
                        ("<button " + btnClass + " id='" + name + "-edit' data-bind='click: editPairStudent' " + btnStyle + "'>Edit</button>") +
                        ("<button " + btnClass + " id='" + name + "-delete' data-bind='click: deletePairStudent' " + btnStyle + ">Delete</i></button>")
                }
            ];
            $("#" + element)
                .kendoGrid({
                columns: columns,
                sortable: false,
                selectable: "row",
                dataSource: [],
                dataBound: function (e) {
                    var grid = e.sender;
                    if (grid) {
                        grid.select("tr:eq(0)");
                    }
                }
            });
            return $("#" + element).data("kendoGrid");
        };
        this.isEqual = function (elementId) {
            return _this.name === elementId.substr(0, elementId.indexOf("-"));
        };
        this.findStudentSetItem = function (uid) {
            for (var _i = 0, _a = _this.studentSets; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.studentSetId === uid) {
                    return item;
                }
            }
            return null;
        };
        this.setDataSource = function () {
            var data = [];
            for (var _i = 0, _a = _this.studentSets; _i < _a.length; _i++) {
                var s = _a[_i];
                data.push({
                    'studentSetId': s.studentSetId,
                    'studentList': s.studentList
                });
            }
            _this.gridControl.dataSource.data(data);
            _this.gridControl.refresh();
        };
        this.uid = this.commonUtils.createUid();
    }
    Object.defineProperty(StudentSetListControl.prototype, "selectedItem", {
        get: function () {
            return this.gridControl ? this.gridControl.dataItem(this.gridControl.select()) : null;
        },
        enumerable: true,
        configurable: true
    });
    return StudentSetListControl;
}());
//# sourceMappingURL=StudentSetListControl.js.map