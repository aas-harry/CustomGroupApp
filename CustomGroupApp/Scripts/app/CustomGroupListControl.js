var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CustomGroupRowViewModel = (function (_super) {
    __extends(CustomGroupRowViewModel, _super);
    function CustomGroupRowViewModel(classItem) {
        var _this = this;
        _super.call(this);
        this.updateProperties = function (classItem) {
            _this.set("name", classItem.name);
            _this.set("groupSetId", classItem.groupSetid);
            _this.set("studentCount", classItem.count);
        };
        this.updateProperties(classItem);
    }
    return CustomGroupRowViewModel;
}(kendo.data.ObservableObject));
// Create a custom group list control
var CustomGroupListControl = (function () {
    function CustomGroupListControl() {
        var _this = this;
        this.kendoHelper = new KendoHelper();
        this.dataSource = new Array();
        this.create = function (parentElement, classItems, selectedItemsCallback, selectedItemCallback) {
            _this.classItems = classItems;
            _this.selectedItemCallback = selectedItemCallback;
            _this.selectedItemsCallback = selectedItemsCallback;
            var container = document.createElement("div");
            container.setAttribute("style", "width: 370px; height: 800px; margin: 5px 0 0 0;");
            container.id = "class-list-container";
            var gridElement = document.createElement("div");
            gridElement.setAttribute("style", "height: 100%;");
            gridElement.id = "class-list";
            container.appendChild(gridElement);
            parentElement.appendChild(container);
            return _this.createClassList(gridElement.id, classItems, selectedItemsCallback, selectedItemCallback);
            ;
        };
        this.updateClassItem = function (classItem) {
            var row = Enumerable.From(_this.dataSource).FirstOrDefault(null, function (x) { return x.groupSetId === classItem.groupSetid; });
            if (row) {
                row.updateProperties(classItem);
            }
            var item = Enumerable.From(_this.classItems).FirstOrDefault(null, function (x) { return x.groupSetid === classItem.groupSetid; });
            if (item) {
                item.name = classItem.name;
                item.count = classItem.count;
            }
        };
        //on click of the checkbox:
        this.toggleSelectedItem = function (e) {
            var checkBox = e.target;
            if (!checkBox) {
                return;
            }
            var self = _this;
            var row = $(checkBox).closest("tr");
            var item = _this.gridControl.dataItem(row);
            var classDefn = Enumerable.From(self.classItems)
                .FirstOrDefault(null, function (s) { return s.groupSetid === item.get("groupSetId"); });
            if (!classDefn) {
                return;
            }
            classDefn.isSelected = checkBox.checked;
            if (Enumerable.From(self.classItems).Any(function (s) { return s.isSelected; })) {
                _this.selectedItemsCallback(Enumerable.From(self.classItems)
                    .Where(function (s) { return s.isSelected; })
                    .Select(function (s) { return s.groupSetid; })
                    .ToArray());
            }
        };
        this.createClassList = function (element, classItems, selectedItemsCallback, selectedItemCallback) {
            $("#" + element)
                .kendoGrid({
                columns: [
                    { width: "30px", template: "<input type='checkbox' class='checkbox' />" },
                    { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                    { field: "studentCount", title: "Count", width: "50px", attributes: { 'class': "text-nowrap" } }
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: true
                },
                selectable: "row",
                dataSource: [],
                dataBound: function (e) {
                    var grid = e.sender;
                    if (grid) {
                        grid.select("tr:eq(0)");
                    }
                },
                change: function (e) {
                    // an item has been selected from check box
                    if (Enumerable.From(_this.classItems).Any(function (x) { return x.isSelected; })) {
                        return;
                    }
                    var gridControl = e.sender;
                    var row = gridControl.select().closest("tr");
                    var item = gridControl.dataItem(row);
                    var classDefn = Enumerable.From(classItems)
                        .FirstOrDefault(null, function (s) { return s.groupSetid === item.get("groupSetId"); });
                    var tmpCallback = selectedItemCallback;
                    if (tmpCallback != null) {
                        tmpCallback(classDefn);
                    }
                }
            });
            _this.gridControl = $("#" + element).data("kendoGrid");
            //bind click event to the checkbox
            _this.gridControl.table.on("click", ".checkbox", _this.toggleSelectedItem);
            _this.dataSource = [];
            Enumerable.From(classItems)
                .ForEach(function (s) { return _this.dataSource.push(new CustomGroupRowViewModel(s)); });
            // Populate the grid
            _this.gridControl.dataSource.data(_this.dataSource);
            _this.gridControl.refresh();
            _this.gridControl.resize();
            return _this.gridControl;
        };
    }
    Object.defineProperty(CustomGroupListControl.prototype, "selectedItem", {
        get: function () {
            return this.gridControl ? this.gridControl.dataItem(this.gridControl.select()) : null;
        },
        enumerable: true,
        configurable: true
    });
    return CustomGroupListControl;
}());
//# sourceMappingURL=CustomGroupListControl.js.map