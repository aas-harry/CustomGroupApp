class AlphanumericViewModel extends kendo.data.ObservableObject {
    constructor() {
        super();
    }

    gridControl: kendo.ui.Grid;
    showReport = (testFile: TestFile, reportContainer: string): void => {
        $(`#${reportContainer}`)
            .kendoGrid({
                columns: [],
                sortable: {
                    mode: "single",
                    allowUnsort: true
                },
                selectable: "row",
                dataSource: testFile.students
            });


        this.gridControl = $(`#${reportContainer}`).data("kendoGrid");
        this.setColumns(false);
    }

    setColumns = (isCoedSchool: boolean) => {
        var columns: { field: string; title: string; width: string; attributes: { class: string } }[];
        if (isCoedSchool) {
            columns = [
                { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                { field: "sex", title: "Sex", width: "80px", attributes: { 'class': "text-center" } }
            ];
        } else {
            columns = [
                { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } }
            ];
        }

        const options = this.gridControl.options;
        options.columns.splice(0, options.columns.length);
        for (let column of columns) {
            options.columns.push(column);
        }
        options.columns.push(this.createRangeColumn("General Reasoning", "genab"));
        options.columns.push(this.createRangeColumn("Verbal Reasoning", "verbal"));
        options.columns.push(this.createRangeColumn("Non Verbal Reasoning", "nonverbal", "90px", "70px"));
        options.columns.push(this.createColumnWith3Fields("Math Performance", "mathPerformance"));
        options.columns.push(this.createColumnWith3Fields("Reading", "mathPerformance"));
        options.columns.push(this.createColumnWith3Fields("Writing Expression", "writing"));
        options.columns.push(this.createDummyColumn());
        this.gridControl.setOptions(options);
    }

    createDummyColumn = (): kendo.ui.GridColumn => {
    var column = {
        'field': "",
        'title': ""
        };
    return column;
    }

    createRangeColumn = (header: string, score: string, widthCol1 = "80px", widthCol2 = "65px"): kendo.ui.GridColumn => {
        var headerColumn = {
            'field': "",
            'title': header,
            'attributes': { 'class': "text-center" },
            'columns': []
        }
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
    }

    createColumnWith3Fields = (header: string, score: string, widthCol1 = "65px", widthCol2 = "65px", widthCol3 = "65px"): kendo.ui.GridColumn => {
        var headerColumn = {
            'field': "",
            'title': header,
            'attributes': { 'class': "text-center" },
            'columns': []
        }
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
    }

}