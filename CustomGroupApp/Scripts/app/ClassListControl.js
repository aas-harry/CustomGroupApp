// Create a class summary list control
var ClassListControl = (function () {
    function ClassListControl() {
        var _this = this;
        this.kendoHelper = new KendoHelper();
        this.create = function (parentElement, classItems, height) {
            if (height === void 0) { height = 300; }
            var container = document.createElement("div");
            container.setAttribute("style", "width: 400px; height: " + height + "px; margin: 5px 0 0 0;");
            container.id = "class-list-container";
            var gridElement = document.createElement("div");
            gridElement.setAttribute("style", "height: 100%;");
            gridElement.id = "class-list";
            container.appendChild(gridElement);
            parentElement.appendChild(container);
            return _this.createClassList(gridElement.id, classItems);
            ;
        };
        this.createClassList = function (element, classItems) {
            _this.gridControl = _this.createClassGrid(element);
            // Populate the grid
            _this.gridControl.dataSource.data(classItems);
            _this.gridControl.refresh();
            _this.gridControl.resize();
            return _this.gridControl;
        };
        this.createClassGrid = function (element) {
            $("#" + element)
                .kendoGrid({
                columns: [{ field: "name", title: "Select a custom group", width: "300px", attributes: { 'class': "text-nowrap" } }],
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
                }
            });
            return $("#" + element).data("kendoGrid");
        };
    }
    Object.defineProperty(ClassListControl.prototype, "selectedItem", {
        get: function () {
            return this.gridControl ? this.gridControl.dataItem(this.gridControl.select()) : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassListControl.prototype, "groupSetId", {
        get: function () {
            var selectedItem = this.selectedItem;
            if (!selectedItem) {
                return 0;
            }
            return selectedItem.get("groupSetId");
        },
        enumerable: true,
        configurable: true
    });
    return ClassListControl;
}());
