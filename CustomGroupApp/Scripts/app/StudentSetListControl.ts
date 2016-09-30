class StudentSetListControl {
    private kendoHelper = new KendoHelper();
    private commonUtils = new CommonUtils();

    uid: string;
    createStudentSetContainer = (
        name: string,
        cell: HTMLTableCellElement,
        studentSets: Array<StudentSet>,
        isCoedSchool: boolean,
        width = 600,
        height = 200) => {
        this.uid = this.commonUtils.createUid();
        var container = document.createElement("div") as HTMLDivElement;
        container.setAttribute("style", `width: ${width}px; height: ${height}px; margin: 5px 0 0 0;`);
        container.id = `${name}-studentsets-${this.uid}-container`;
        var gridElement = document.createElement("div") as HTMLDivElement;
        gridElement.setAttribute("style", "height: 100%;");
        gridElement.id = `${name}-studentsets-${this.uid}`;
        container.appendChild(gridElement);
        cell.appendChild(container);

        return this.createStudentSetGrid(name, gridElement.id, studentSets);;
    };

    createStudentSetGrid = (
        name: string,
        element: string,
        studentSets: Array<StudentSet>): kendo.ui.Grid => {
        var grid = this.createStudentSetGridControl(name, element);

        // Populate the grid
        var students: Array<{ 'names': string, 'myuid': string }> = [];
        Enumerable.From(studentSets).ForEach(x => students.push({ 'names': x.studentList, 'myuid': x.uid }));
        grid.dataSource.data(students);
        grid.refresh();
        grid.resize();
        return grid;
    }

    createStudentSetGridControl = (name: string, element: string): kendo.ui.Grid => {
        var btnStyle = "style = 'margin-right: 2px'";
        var btnClass = "class='btn-xs btn-default'";
        var columns = [
            {
                field: "names", width: "400px", attributes: { 'class': "text-nowrap" },
                template: dataItem => {
                    return `<button ${btnClass} id='studentid-${dataItem.myuid}' data-bind='click: editPairStudent' ${btnStyle}'><i class='fa fa-edit'></i></button>` +
                        `<button ${btnClass} id='studentid-${dataItem.myuid}' data-bind='click: deletePairStudent' ${btnStyle}><i class='fa fa-remove'></i></button>` +
                        `<span>${dataItem.names} </span>`;
                },
                headerTemplate: `<button ${btnClass} id='${name}-add' style='margin: 0 5px 0 5px'>Add ${name} Students list</button>`
            }
        ];

        $(`#${element}`)
            .kendoGrid({
                columns: columns,
                sortable: false,
                selectable: "row",
                dataSource: []
            });
        var grid = $(`#${element}`).data("kendoGrid");
        return grid;
    }
}