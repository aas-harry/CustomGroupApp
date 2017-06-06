var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AlphanumericViewModel = (function (_super) {
    __extends(AlphanumericViewModel, _super);
    function AlphanumericViewModel() {
        var _this = this;
        _super.call(this);
        this.showReport = function (testFile, reportContainer) {
            $("#" + reportContainer)
                .kendoGrid({
                columns: [],
                sortable: {
                    mode: "single",
                    allowUnsort: true
                },
                selectable: "row",
                dataSource: testFile.students
            });
            _this.gridControl = $("#" + reportContainer).data("kendoGrid");
            _this.setColumns(false);
        };
        this.setColumns = function (isCoedSchool) {
            var columns;
            if (isCoedSchool) {
                columns = [
                    { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                    { field: "sex", title: "Sex", width: "80px", attributes: { 'class': "text-center" } }
                ];
            }
            else {
                columns = [
                    { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } }
                ];
            }
            var options = _this.gridControl.options;
            options.columns.splice(0, options.columns.length);
            for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
                var column = columns_1[_i];
                options.columns.push(column);
            }
            options.columns.push(_this.createRangeColumn("General Reasoning", "genab"));
            options.columns.push(_this.createRangeColumn("Verbal Reasoning", "verbal"));
            options.columns.push(_this.createRangeColumn("Non Verbal Reasoning", "nonverbal", "90px", "70px"));
            options.columns.push(_this.createColumnWith3Fields("Math Performance", "mathPerformance"));
            options.columns.push(_this.createColumnWith3Fields("Reading", "mathPerformance"));
            options.columns.push(_this.createColumnWith3Fields("Writing Expression", "writing"));
            options.columns.push(_this.createDummyColumn());
            _this.gridControl.setOptions(options);
        };
        this.createDummyColumn = function () {
            var column = {
                'field': "",
                'title': ""
            };
            return column;
        };
        this.createRangeColumn = function (header, score, widthCol1, widthCol2) {
            if (widthCol1 === void 0) { widthCol1 = "80px"; }
            if (widthCol2 === void 0) { widthCol2 = "65px"; }
            var headerColumn = {
                'field': "",
                'title': header,
                'attributes': { 'class': "text-center" },
                'columns': []
            };
            headerColumn.columns.push({
                'field': score + ".range.range()",
                'title': "Range",
                'width': widthCol1,
                'attributes': { 'class': "text-center" }
            });
            headerColumn.columns.push({
                'field': score + ".stanine",
                'title': "Stan.",
                'width': widthCol2,
                'attributes': { 'class': "text-center" }
            });
            return headerColumn;
        };
        this.createColumnWith3Fields = function (header, score, widthCol1, widthCol2, widthCol3) {
            if (widthCol1 === void 0) { widthCol1 = "65px"; }
            if (widthCol2 === void 0) { widthCol2 = "65px"; }
            if (widthCol3 === void 0) { widthCol3 = "65px"; }
            var headerColumn = {
                'field': "",
                'title': header,
                'attributes': { 'class': "text-center" },
                'columns': []
            };
            headerColumn.columns.push({
                'field': score + ".score",
                'title': "R.S",
                'width': widthCol1,
                'attributes': { 'class': "text-center" }
            });
            headerColumn.columns.push({
                'field': score + ".stanine",
                'title': "Stan.",
                'width': widthCol2,
                'attributes': { 'class': "text-center" }
            });
            headerColumn.columns.push({
                'field': score + ".naplan",
                'title': "NPI",
                'width': widthCol3,
                'attributes': { 'class': "text-center" }
            });
            return headerColumn;
        };
    }
    return AlphanumericViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=AlphanumericViewModel.js.map