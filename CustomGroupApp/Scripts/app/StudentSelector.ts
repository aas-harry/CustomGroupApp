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