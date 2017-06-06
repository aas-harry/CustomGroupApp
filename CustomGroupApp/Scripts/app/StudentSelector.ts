class StudentSelector {

    container: HTMLElement;
    name: string;
    private students: Array<StudentClass> = [];
    maxRows = 21;

    private studentSelectedChanged: (count: number) => any;
    private studentCheckboxes = new Array<HTMLInputElement>();
    private commonUtils = new CommonUtils();
    private kendoHelper = new KendoHelper();
    saveButton: kendo.ui.Button;
    cancelButton: kendo.ui.Button;
    popupWindow: kendo.ui.Window;
    windowContent: HTMLElement;
    popupWindowContainer: HTMLElement;  // this is the div that contains popupWindow

    destroy = () => {
        this.students = [];
        this.studentCheckboxes = [];
        this.studentSelectedChanged = undefined;
        if (this.saveButton) {
            this.saveButton.options.click = undefined;
            this.saveButton.destroy();
        }
        if (this.cancelButton) {
            this.cancelButton.options.click = undefined;
            this.cancelButton.destroy();
        }

        // remove window content
        if (this.windowContent) {
            const parent = this.windowContent.parentNode as HTMLElement;
            parent.parentNode.removeChild(parent);

        }
    }

    createTable = (element: HTMLElement, students: Array<StudentClass>, previoustudents: Array<StudentClass> = [], studentSelectedChanged: (count: number) => any) => {
        this.students = [];
        for (let s of students) {
            this.students.push(s.copy());
        }
        this.studentSelectedChanged = studentSelectedChanged;

        var cnt = 0;
        var maxRows = 3;
        var previousStudentRows = [];
        this.studentCheckboxes = [];
        this.container = element;
        if (previoustudents.length > 0) {
            // Create the table
            const previousStudentsContainer = document.createElement("div");
            previousStudentsContainer.setAttribute("style",
                `padding: 5px; margin-right: 5px; margin-bottom: 5px; overflow: hidden`);
            this.container.appendChild(previousStudentsContainer);

            const descLabel = document.createElement("div");
            descLabel.setAttribute("style", "font-weight: bold; margin-bottom: 5px");
            descLabel
                .textContent = "Previously selected students, un-check the checkbox to remove students from the list.";
            previousStudentsContainer.appendChild(descLabel);

            const previousTableContainer = document.createElement("div");
            previousTableContainer.setAttribute("style", "overflow-y: hidden; overflow-x: auto");

            const previousStudentsTable = document.createElement("table") as HTMLTableElement;
            previousStudentsTable.setAttribute("style", "margin-bottom: 10px");
            previousStudentsContainer.appendChild(previousTableContainer);
            previousTableContainer.appendChild(previousStudentsTable);
            const previousStudentBody = previousStudentsTable.createTBody();
            previousStudentRows.push(previousStudentBody.insertRow());

            for (let student of Enumerable.From(previoustudents).OrderBy(x => x.name).ToArray()) {
                if (cnt > maxRows) {
                    cnt = 0;
                }
                if (cnt >= previousStudentRows.length) {
                    previousStudentRows.push(previousStudentBody.insertRow());
                }
                this.createStudentCell(previousStudentRows[cnt]
                    .insertCell(),
                    student,
                    true);
                cnt++;
            }
            this.container.appendChild(document.createElement("hr"));
        }

        maxRows = this.maxRows;
        // Increase the height of the available students if nothing selected previously
        if (previoustudents.length === 0) {
            maxRows += 3;
        } else if (previoustudents.length === 1) {
            maxRows -= 2;
        } else if(previoustudents.length === 2) {
            maxRows -= 3;
        } else if(previoustudents.length === 3) {
            maxRows -= 4;
        } else if (previoustudents.length > 12) {
            maxRows -= 6;
        } else {
            maxRows -= 5;
        }


        // Create the table
        cnt = 0;
        var studentRows = [];

        const availableStudentsContainer = document.createElement("div");
        availableStudentsContainer.setAttribute("style", "padding: 5px; overflow: hidden");
        const label = document.createElement("div");
        label.textContent = "Select one or more students from the list below:";
        label.setAttribute("style", "margin-right: 5px; margin-bottom: 5px; font-weight: bold");
        this.container.appendChild(availableStudentsContainer);
        availableStudentsContainer.appendChild(label);

        const availableTableContainer = document.createElement("div");
        availableTableContainer.setAttribute("style", "overflow-y: hidden; overflow-x: auto;");
        availableStudentsContainer.appendChild(availableTableContainer);

        const table = document.createElement("table") as HTMLTableElement;
        table.setAttribute("style", "margin-bottom: 10px");
        availableTableContainer.appendChild(table);
        const body = table.createTBody();
        studentRows.push(body.insertRow());

        const previousStudentLookup = Enumerable.From(previoustudents).ToDictionary(s => s.studentId, s => s);
        for (let student of Enumerable.From(this.students).OrderBy(x => x.name).ToArray()) {
            if (previousStudentLookup.Contains(student.studentId)) {
                continue;
            }
            if (cnt > maxRows) {
                cnt = 0;
            }
            if (cnt >= studentRows.length) {
                studentRows.push(body.insertRow());
            }
            this.createStudentCell(studentRows[cnt]
                .insertCell(),
                student);
            cnt++;
        }
    }

    createStudentCell = (cell: HTMLTableCellElement, student: StudentClass, isSelected: boolean = false) => {
        const container = document.createElement("div");
        container.setAttribute("style", "width: 200px; margin-right: 15px");
        cell.appendChild(container);

        const self = this;
        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.id = `studentid-${student.id}`;
        if (isSelected) {
            checkBox.checked = true;
        }

        if (self.studentSelectedChanged)
        {
            checkBox.addEventListener("click", (e) => {
            const tmpCallback = self.studentSelectedChanged;
            if (tmpCallback) {
                tmpCallback(1);
            }
            });
        }

        this.studentCheckboxes.push(checkBox);
        container.appendChild(checkBox);

        const label = document.createElement("span");
        label.textContent = student.name;
        label.setAttribute("style", "margin-left: 5px");
        container.appendChild(label);
    }

    openDialog = (element: HTMLElement,
        students: Array<StudentClass>,
        previoustudents: Array<StudentClass> = [],
        callback: (students: Array<StudentClass>) => any,
        maxRows: number = null) => {
        if (maxRows) {
            this.maxRows = this.maxRows;
        }
        this.popupWindowContainer = element;

        // create window content
        this.windowContent = document.createElement("div");
        this.windowContent.setAttribute("style", "margin: 10px 0 10px 0; overflow: none");
        this.windowContent.id = `popup-content-${this.commonUtils.createUid()}`;

        if (element.childElementCount > 0) {
            while (element.hasChildNodes()) {
                element.removeChild(element.lastChild);
            }
        }
        element.appendChild(this.windowContent);

        this.popupWindow = $(`#${this.windowContent.id}`)
            .kendoWindow({
                width: "700px",
                height: "625px",
                modal: true,
                scrollable: true,
                actions: ["Maximize", "Close"],
                resizable: false,
                title: "Select Students"
            })
            .data("kendoWindow");

        // Create save and cancel buttons
        const buttonContainer = document.createElement("div");
        const saveButtonElement = document.createElement("button");
        saveButtonElement.id = `save-button-${this.commonUtils.createUid()}`;
        saveButtonElement.textContent = "Save";
        saveButtonElement.setAttribute("style", "margin-left: 2.5px; margin-right: 2.5px");

        const cancelButtonElement = document.createElement("button");
        cancelButtonElement.id = `cancel-button-${this.commonUtils.createUid()}`;
        cancelButtonElement.textContent = "Cancel";

        buttonContainer.setAttribute("style", "margin: 0 5px 5px 0px");
        buttonContainer.appendChild(saveButtonElement);
        buttonContainer.appendChild(cancelButtonElement);
        this.windowContent.appendChild(buttonContainer);

        const self = this;
        this.saveButton = this.kendoHelper.createKendoButton(saveButtonElement.id,
            (e) => {

                var selectedStudents = self.selectedStudents();

                const tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(selectedStudents);
                }
                self.popupWindow.close();
                self.destroy();
            });

        this.cancelButton = this.kendoHelper.createKendoButton(cancelButtonElement.id,
            (e) => {
                self.popupWindow.close();
                self.destroy();
            });

        this.createTable(this.windowContent, students, previoustudents, null);
        
        $(`#${this.windowContent.id}`).parent().addClass("h-window-caption");
        this.popupWindow.center().open();
    }

    selectedStudents = (): Array<StudentClass> => {
        const selectedStudents = new Array<StudentClass>();
        var lookup = Enumerable.From(this.students).ToDictionary(x => x.id, x => x);
        Enumerable.From(this.studentCheckboxes)
            .Where(x => x.checked)
            .ForEach(x => {
                var studentid = parseInt(this.commonUtils.getUid(x.id));
                if (lookup.Contains(studentid)) {
                    selectedStudents.push(lookup.Get(studentid));
                }
            });

        return selectedStudents;
    }
}