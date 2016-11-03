class StudentListControl {
    constructor(public elementName: string) {
        this.hostElement = document.getElementById(elementName);
    }

    private students: Array<Student>;
    private commonUtils = new CommonUtils();
    private gridControl: kendo.ui.Grid;
    private self = this;

    hostElement: HTMLElement;
    setColumns = (isCoedSchool: boolean): StudentListControl => {
        var columns: { field: string; title: string; width: string; attributes: { class: string } }[];
        if (isCoedSchool) {
            columns = [
                { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                { field: "gender", title: "Sex", width: "80px", attributes: { 'class': "text-center" } },
                { field: "id", title: "Id", width: "0px", attributes: { 'class': "text-nowrap" } }
            ];
        } else {
            columns = [
                { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                { field: "id", title: "Id", width: "0px", attributes: { 'class': "text-nowrap" } }
            ];
        }

        const options = this.gridControl.options;
        options.columns.splice(0, options.columns.length);
        for (let column of columns) {
            options.columns.push(column);
        }
        
        this.gridControl.setOptions(options);

        return this.self;
    }

    create = (
        name = "students",
        studentSelectedCallback: (student: Student) => any,
        width = 300,
        height = 500) => {

        if (this.hostElement.childElementCount > 0) {
            while (this.hostElement.hasChildNodes()) {
                this.hostElement.removeChild(this.hostElement.lastChild);
            }
        }

        // Create HTML element for hosting the grid control
        var container = document.createElement("div") as HTMLDivElement;
        container.setAttribute("style", `width: ${width}px; height: ${height}px; margin: 5px 0 0 0;`);
        container.id = `${name}-${this.commonUtils.createUid()}-container`;

        var gridElement = document.createElement("div") as HTMLDivElement;
        gridElement.setAttribute("style", "height: 100%;");
        gridElement.id = `${name}-${this.commonUtils.createUid()}-list`;

        container.appendChild(gridElement);
        this.hostElement.appendChild(container);

        var self = this;

        $(`#${gridElement.id}`)
            .kendoGrid({
                columns: [
                    { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } }
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: true
                },
                selectable: "row",
                dataSource: [],
                change: e => {

                    var gridControl = e.sender as kendo.ui.Grid;
                    const row = gridControl.select().closest("tr");
                    const studentRow = gridControl.dataItem(row) as StudentRow;
         
                    var student = Enumerable.From(self.students).FirstOrDefault(null, x => x.studentId === studentRow.id);
                    const tmpCallback = studentSelectedCallback;
                    if (tmpCallback != null) {
                        tmpCallback(student);
                    }
                },
                dataBound(e) {
                    const grid = e.sender;
                    if (grid) {
                        grid.select("tr:eq(0)");
                    }
                }
            });

        this.gridControl = $(`#${gridElement.id}`).data("kendoGrid");
        return this.self;
    };

    setDatasource = (students: Array<Student>): StudentListControl => {
        // Populate the grid
        this.students = students;

        var studentRows: Array<StudentRow> = [];
        Enumerable.From(students).ForEach(x => studentRows.push(new StudentRow(x)));
        this.gridControl.dataSource.data(studentRows);
        this.gridControl.refresh();
      
        this.gridControl.resize();
        return this.self;
    }

}

