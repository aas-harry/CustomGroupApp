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
    constructor(public maxRows = 40){}

    container: HTMLElement;
    name: string;
    students : Array<Student> = [];


    createTable = (element: HTMLElement, students: Array<Student>) => {
        // Create the table
        this.container = element; // $("#" + element)[0];
        const table = document.createElement("table") as HTMLTableElement;
        this.container.appendChild(table);
        var cnt = 0;
        var studentRows = [];
        const body = table.createTBody();
        studentRows.push(body.insertRow());

        for (let student of students) {
            if (cnt > this.maxRows) {
                cnt = 0;
            }
            if (cnt >= studentRows.length) {
                studentRows.push(body.insertRow());
            }
            this.createStudentCell(studentRows[cnt]
                .insertCell(), student);
            cnt++;
        }
    }

    createStudentCell = (cell: HTMLTableCellElement, student: Student) => {
        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.id = "studentid-" + student.studentId;
        cell.appendChild(checkBox);

        const label = document.createElement("span");
        label.textContent = student.name;
        label.setAttribute("style", "margin-left: 5px");
        cell.appendChild(label);
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
        name = "students",
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

