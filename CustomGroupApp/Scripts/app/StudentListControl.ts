class StudentRow extends kendo.data.ObservableObject{
    constructor(student: Student) {
        super(null);
        this.convert(student);
    }
    id: number;
    name: string;
    gender: string;

    convert = (student: Student) => {
        this.id = student.studentId;
        this.name = student.name;
        this.gender = student.sex;
    }
}

class StudentSelector {
    constuctor(name: string, element: HTMLDivElement, students: Array<Student>, selectedStudents: Array<Student>) {
        this.name = name;
        this.tableContainerElementName = element;
        this.createTable();
    }
    name: string;
    tableContainerElementName: HTMLDivElement;
    table: HTMLTableElement;
    header: HTMLTableSectionElement;
    headerRow: HTMLTableRowElement;
    classRow: HTMLTableRowElement;
    footerRow: HTMLTableRowElement;

    createTable = () => {
        // Create the table
        $(`#${this.tableContainerElementName}`).html(`<table id='${this.name}-table-container'></table>`);
        this.table = document.getElementById('{this.name}-table-container') as HTMLTablenameElement;
        this.headerTable = this.table.createTHead();
        this.bodyTable = this.table.createTBody();
    }
}
class StudentListControl {
    constructor(public hostElement: HTMLTableCellElement) {
    }
    private commonUtils = new CommonUtils();
    private gridControl: kendo.ui.Grid;
    private self = this;

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
        name = "students"   ,
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
                dataSource: []
            });

        this.gridControl = $(`#${gridElement.id}`).data("kendoGrid");
        return this.self;
    };

    setDatasource = (students: Array<Student>): StudentListControl => {
        // Populate the grid


        var studentRows: Array<StudentRow> = [];
        Enumerable.From(students).ForEach(x => studentRows.push(new StudentRow(x)));
        this.gridControl.dataSource.data(studentRows);
        this.gridControl.refresh();
      
        this.gridControl.resize();
        return this.self;
    }

}

