
class PastTestsComparisonViewModel extends kendo.data.ObservableObject {
    constructor(public testFile: TestFile){
        super();
    }

    noData: boolean = true;
    hasData: boolean = true;
    subjects: Array<SubjectPerformanceScore> = [];
    
    setDatasource = (testFile: TestFile) => {
      this.testFile = testFile;
    }

    getSummaryData(subjects) {

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
        $.each(datasource,
            (index, item) => {
                var testDate = new Date(parseInt(item.testDate.substr(6)));
                var testYear = testDate.getFullYear();

                if (listSubTypes.indexOf(item.subject) === -1) {
                    data.push(
                        {
                            ["Year_" + testYear]: testYear + "_" + item.testNumber,
                            ["LowPct_" + testYear]: Math.round(item.lowPct),
                            ["AvgPct_" + testYear]: Math.round(item.avgPct),
                            ["HighPct_" + testYear]: Math.round(item.highPct),
                            ["LowCount_" + testYear]: Math.round(item.lowCount),
                            ["AvgCount_" + testYear]: Math.round(item.avgCount),
                            ["HighCount_" + testYear]: Math.round(item.highCount),
                            "Subject": item.name
                        }
                    );
                    
                    listSubTypes.push(item.subject);
                } else {
                    $.each(data,
                        (ind, val) => {
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
            });

        return data;
    }

    createSummaryColumns(data) {
        var summaryColumns = [];
        summaryColumns = [
            {
                field: "Subject",
                title: "Name",
                sortable: false,
                width: 170,
                template: "<div>" +
                "<div style='font-weight: bold'>#= Subject #</div>" +
                "<span class=link >Click here to display the chart</span>" + "</div>"
                ,
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

        $.each(data[0],
            (index, item) => {
                if (index.indexOf("Year") === 0) {
                    var year = index.split("_");
                    summaryColumns.push(
                        {
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
                        }
                    );
                }
            });

        summaryColumns.push({
            field: "",
            title: ""
       
        });

        return summaryColumns;
    }
}