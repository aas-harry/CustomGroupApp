// Create a custom group list control
var CustomGroupListControl = (function () {
    function CustomGroupListControl() {
        var _this = this;
        this.kendoHelper = new KendoHelper();
        this.create = function (parentElement, classItems, classSelectedCallback, height) {
            if (height === void 0) { height = 500; }
            var container = document.createElement("div");
            container.setAttribute("style", "width: 400px; height: " + height + "px; margin: 5px 0 0 0;");
            container.id = "class-list-container";
            var gridElement = document.createElement("div");
            gridElement.setAttribute("style", "height: 100%;");
            gridElement.id = "class-list";
            container.appendChild(gridElement);
            parentElement.appendChild(container);
            return _this.createClassList(gridElement.id, classItems, classSelectedCallback);
            ;
        };
        this.createClassList = function (element, classItems, classSelectedCallback) {
            $("#" + element)
                .kendoGrid({
                columns: [
                    { field: "name", title: "Name", width: "300px", attributes: { 'class': "text-nowrap" } },
                    { field: "count", title: "Count", width: "100px", attributes: { 'class': "text-nowrap" } }
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
                    var gridControl = e.sender;
                    var row = gridControl.select().closest("tr");
                    var classDefn = gridControl.dataItem(row);
                    //const tmpCallback = classSelectedCallback;
                    //if (tmpCallback != null) {
                    //    tmpCallback(classDefn);
                    //}
                },
            });
            _this.gridControl = $("#" + element).data("kendoGrid");
            // Populate the grid
            _this.gridControl.dataSource.data(classItems);
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