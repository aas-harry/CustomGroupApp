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
    students: Array<Student> = [];

    private studentCheckboxes = new Array<HTMLInputElement>();
    private commonUtils = new CommonUtils();
    private kendoHelper = new KendoHelper();

    createTable = (element: HTMLElement, students: Array<StudentClass>, previoustudents: Array<StudentClass> = []) => {
        var cnt = 0;
        var previousStudentRows = [];
        this.studentCheckboxes = [];
        this.container = element;
        if (previoustudents.length > 0) {
            // Create the table
            const label = document.createElement("div");
            label.textContent = "Previously selected students, un-check the checkbox to remove students from the list.";
            label.setAttribute("style", "margin-right: 5px; margin-bottom: 5px; font-weight: bold");
            this.container.appendChild(label);

            const previousStudentsTable = document.createElement("table") as HTMLTableElement;
            this.container.appendChild(previousStudentsTable);
            const previousStudentBody = previousStudentsTable.createTBody();
            var maxRows = 3;
            previousStudentRows.push(previousStudentBody.insertRow());

            for (let student of Enumerable.From(previoustudents).OrderBy(x => x.name).ToArray()) {
                if (cnt > maxRows) {
                    cnt = 0;
                }
                if (cnt >= previousStudentRows.length) {
                    previousStudentRows.push(previousStudentBody.insertRow());
                }
                this.createStudentCell(previousStudentRows[cnt]
                    .insertCell(), student, true);
                cnt++;
            }
            this.container.appendChild(document.createElement("hr"));
        }

        // Create the table
        cnt = 0;
        var studentRows = [];

        const label = document.createElement("div");
        label.textContent = "Select one or more students from the list below:";
        label.setAttribute("style", "margin-right: 5px; margin-bottom: 5px; font-weight: bold");
        this.container.appendChild(label);

        const table = document.createElement("table") as HTMLTableElement;
        this.container.appendChild(table);
        const body = table.createTBody();
        studentRows.push(body.insertRow());

        for (let student of Enumerable.From(students).OrderBy(x=> x.name).ToArray()) {
            if (previoustudents.indexOf(student) >= 0) {
                continue;
            }
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

   
    createStudentCell = (cell: HTMLTableCellElement, student: StudentClass, isSelected: boolean = false) => {
        const container = document.createElement("div");
        container.setAttribute("style", "width: 220px");
        cell.appendChild(container);

        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.id = "studentid-" + student.id;
        if (isSelected) {
            checkBox.checked = true;
        }
        this.studentCheckboxes.push(checkBox);
        container.appendChild(checkBox);

        const label = document.createElement("span");
        label.textContent = student.name;
        label.setAttribute("style", "margin-left: 5px");
        container.appendChild(label);
    }

    openDialog = (element: HTMLElement, students: Array<StudentClass>,
        previoustudents: Array<StudentClass> = [],
        callback: (students: Array<StudentClass>) => any,
        maxRows: number = null) => {
        if (maxRows) {
            this.maxRows = this.maxRows;
        }

        // create window content
        const window = document.createElement("div");
        window.id = this.commonUtils.createUid();

        if (element.childElementCount > 0) {
            while (element.hasChildNodes()) {
                element.removeChild(element.lastChild);
            }
        }
        element.appendChild(window);

        const buttonContainer = document.createElement("div");
        const saveButton = this.kendoHelper.createButton("Save");
        const cancelButton = this.kendoHelper.createButton("Cancel");
      
        buttonContainer.setAttribute("style","margin: 0 5px 5px 0px");
        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(cancelButton);
        window.appendChild(buttonContainer);

        this.createTable(window, students, previoustudents);
       
        var popupWindow = $(`#${window.id}`).kendoWindow({
            width: "690px",
            height: "705px",
            modal: true,
            scrollable: true,
            actions: ["Maximize", "Close"],
            resizable: false,
            title: 'Select Students'
        }).data("kendoWindow");

        cancelButton.onclick = () => {
            popupWindow.close();
        };

        saveButton.onclick = () => { 
            previoustudents.splice(0, previoustudents.length);
            var lookup = Enumerable.From(students).ToDictionary(x => x.id, x => x);
            Enumerable.From(this.studentCheckboxes).Where(x => x.checked).ForEach(x => {
                var studentid = parseInt(this.commonUtils.getUid(x.id));
                if (lookup.Contains(studentid)) {
                    previoustudents.push(lookup.Get(studentid));
                }
            });
            
         
            popupWindow.close();

            const tmpCallback = callback;
            if (tmpCallback) {
                tmpCallback(previoustudents);
            }
        };

        $(`#${window.id}`).parent().addClass("h-window-caption");
        popupWindow.center().open();
    }
}
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

