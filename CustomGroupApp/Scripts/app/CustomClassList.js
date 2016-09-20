var CustomClassGrid = (function () {
    function CustomClassGrid() {
    }
    return CustomClassGrid;
}());
var CustomClassGridCollection = (function () {
    function CustomClassGridCollection() {
        var _this = this;
        this.groupingHelper = new GroupingHelper();
        this.kendoHelper = new KendoHelper();
        this.me = this;
        this.items = [];
        this.classes = [];
        this.classCount = 0;
        this.initTable = function (elementName, bands) {
            debugger;
            $(elementName).html("<table id='custom-classes-table'></table>");
            _this.table = document.getElementById("custom-classes-table");
            _this.header = _this.table.createTHead();
            _this.headerRow = _this.header.insertRow();
            _this.classRow = _this.header.insertRow();
            _this.footerRow = _this.header.insertRow();
            _this.classes = Enumerable.From(bands).SelectMany(function (b) { return b.classes; }).ToArray();
            _this.classCount = _this.classes.length;
            for (var _i = 0, _a = _this.classes; _i < _a.length; _i++) {
                var classItem = _a[_i];
                _this.createClassHeader(classItem);
            }
        };
        this.clear = function () {
            _this.items.splice(0, _this.items.length);
        };
        this.createClassHeader = function (classItem) {
            _this.kendoHelper.createLabel(_this.headerRow.insertCell(), classItem.name);
        };
    }
    return CustomClassGridCollection;
}());
//# sourceMappingURL=CustomClassList.js.map