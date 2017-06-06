var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PastTestsComparisonViewModel = (function (_super) {
    __extends(PastTestsComparisonViewModel, _super);
    function PastTestsComparisonViewModel(testFile) {
        var _this = this;
        _super.call(this);
        this.testFile = testFile;
        this.noData = true;
        this.hasData = true;
        this.subjects = [];
        this.setDatasource = function (testFile) {
            _this.testFile = testFile;
        };
    }
    PastTestsComparisonViewModel.prototype.getSummaryData = function (subjects) {
        var datasource = subjects;
        if (datasource && datasource.length === 0) {
            this.set("noData", true);
            this.set("hasData", false);
            return [];
        }
        this.set("hasData", true);
        this.set("noData", false);
        // get all subject Types
        var data = [];
        var listSubTypes = [];
        $.each(datasource, function (index, item) {
            var testDate = new Date(parseInt(item.testDate.substr(6)));
            var testYear = testDate.getFullYear();
            if (listSubTypes.indexOf(item.subject) === -1) {
                data.push((_a = {},
                    _a["Year_" + testYear] = testYear + "_" + item.testNumber,
                    _a["LowPct_" + testYear] = Math.round(item.lowPct),
                    _a["AvgPct_" + testYear] = Math.round(item.avgPct),
                    _a["HighPct_" + testYear] = Math.round(item.highPct),
                    _a["LowCount_" + testYear] = Math.round(item.lowCount),
                    _a["AvgCount_" + testYear] = Math.round(item.avgCount),
                    _a["HighCount_" + testYear] = Math.round(item.highCount),
                    _a["Subject"] = item.name,
                    _a
                ));
                listSubTypes.push(item.subject);
            }
            else {
                $.each(data, function (ind, val) {
                    if (val.Subject === item.name) {
                        data[ind]["Year_" + testYear] = testYear + "_" + item.testNumber;
                        data[ind]["LowPct_" + testYear] = Math.round(item.lowPct);
                        data[ind]["AvgPct_" + testYear] = Math.round(item.avgPct);
                        data[ind]["HighPct_" + testYear] = Math.round(item.highPct);
                        data[ind]["LowCount_" + testYear] = Math.round(item.lowCount);
                        data[ind]["AvgCount_" + testYear] = Math.round(item.avgCount);
                        data[ind]["HighCount_" + testYear] = Math.round(item.highCount);
                    }
                });
            }
            var _a;
        });
        return data;
    };
    PastTestsComparisonViewModel.prototype.createSummaryColumns = function (data) {
        var summaryColumns = [];
        summaryColumns = [
            {
                field: "Subject",
                title: "Name",
                sortable: false,
                width: 170,
                template: "<div>" +
                    "<div style='font-weight: bold'>#= Subject #</div>" +
                    "<span class=link >Click here to display the chart</span>" + "</div>",
                attributes: { "class": "text-nowrap" }
            },
            {
                field: "",
                title: " ",
                width: 100,
                sortable: false,
                template: "<div><div>Low</div><div>Average</div><div>High</div></div>",
                headerAttributes: { 'class': 'table-header-cell' }
            }
        ];
        $.each(data[0], function (index, item) {
            if (index.indexOf("Year") === 0) {
                var year = index.split("_");
                summaryColumns.push({
                    field: "" + index,
                    title: "<div>" +
                        "<div>" + item.replace(/_/g, '<br/>') + "</div>" +
                        "<div>%</div></div>",
                    width: 90,
                    sortable: false,
                    attributes: { "class": "text-center" },
                    template: "<div>" +
                        "<div>#= LowPct_" + year[1] + " #</div>" +
                        "<div>#= AvgPct_" + year[1] + " #</div>" +
                        "<div>#= HighPct_" + year[1] + " #</div>" +
                        "</div>",
                    headerAttributes: { 'class': 'table-header-cell', style: 'text-align: center' }
                });
            }
        });
        summaryColumns.push({
            field: "",
            title: ""
        });
        return summaryColumns;
    };
    return PastTestsComparisonViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=PastTestsComparisonViewModel.js.map