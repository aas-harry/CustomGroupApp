class StudentSelector {

    container: HTMLElement;
    name: string;
    students: Array<Student> = [];
    maxRows = 21;

    private studentCheckboxes = new Array<HTMLInputElement>();
    private commonUtils = new CommonUtils();
    private kendoHelper = new KendoHelper();

    createTable = (element: HTMLElement, students: Array<StudentClass>, previoustudents: Array<StudentClass> = []) => {
        var cnt = 0;
        var maxRows = 3;
        var previousStudentRows = [];
        this.studentCheckboxes = [];
        this.container = element;
        if (previoustudents.length > 0) {
            // Create the table
            const previousStudentsContainer = document.createElement("div");
            previousStudentsContainer.setAttribute("style",
                "padding: 5px; margin-right: 5px; margin-bottom: 5px; overflow-y: none; overflow-x: auto");
            this.container.appendChild(previousStudentsContainer);

            const descLabel = document.createElement("div");
            descLabel.setAttribute("style", "font-weight: bold; margin-bottom: 5px");
            descLabel
                .textContent = "Previously selected students, un-check the checkbox to remove students from the list.";
            previousStudentsContainer.appendChild(descLabel);

            const previousStudentsTable = document.createElement("table") as HTMLTableElement;
            previousStudentsContainer.appendChild(previousStudentsTable);
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
        availableStudentsContainer.setAttribute("style", "padding: 5px; overflow-y: none; overflow-x: auto");
        const label = document.createElement("div");
        label.textContent = "Select one or more students from the list below:";
        label.setAttribute("style", "margin-right: 5px; margin-bottom: 5px; font-weight: bold");
        this.container.appendChild(availableStudentsContainer);
        availableStudentsContainer.appendChild(label);

        const table = document.createElement("table") as HTMLTableElement;
        availableStudentsContainer.appendChild(table);
        const body = table.createTBody();
        studentRows.push(body.insertRow());

        const previousStudentLookup = Enumerable.From(previoustudents).ToDictionary(s => s.studentId, s => s);
        for (let student of Enumerable.From(students).OrderBy(x => x.name).ToArray()) {
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

    popupWindow: kendo.ui.Window;
    openDialog = (element: HTMLElement,
        students: Array<StudentClass>,
        previoustudents: Array<StudentClass> = [],
        callback: (students: Array<StudentClass>) => any,
        maxRows: number = null) => {
        if (maxRows) {
            this.maxRows = this.maxRows;
        }

        // create window content
        const window = document.createElement("div");
        window.setAttribute("style", "margin: 10px 0 10px 0; overflow: none");
        window.id = this.commonUtils.createUid();

        if (element.childElementCount > 0) {
            while (element.hasChildNodes()) {
                element.removeChild(element.lastChild);
            }
        }
        element.appendChild(window);

        this.popupWindow = $(`#${window.id}`)
            .kendoWindow({
                width: "700px",
                height: "625px",
                modal: true,
                scrollable: true,
                actions: ["Maximize", "Close"],
                resizable: false,
                title: 'Select Students'
            })
            .data("kendoWindow");

        const buttonContainer = document.createElement("div");
        const saveButtonElement = document.createElement("button");
        saveButtonElement.id = "save-button";
        saveButtonElement.textContent = "Save";
        saveButtonElement.setAttribute("style", "margin-left: 2.5px; margin-right: 2.5px");
        const cancelButtonElement = document.createElement("button");
        cancelButtonElement.id = "cancel-button";
        cancelButtonElement.textContent = "Cancel";

        buttonContainer.setAttribute("style", "margin: 0 5px 5px 0px");
        buttonContainer.appendChild(saveButtonElement);
        buttonContainer.appendChild(cancelButtonElement);
        window.appendChild(buttonContainer);

        this.createTable(window, students, previoustudents);

        this.kendoHelper.createKendoButton("save-button",
            (e) => {
                var selectedStudents = new Array<StudentClass>();
                var lookup = Enumerable.From(students).ToDictionary(x => x.id, x => x);
                Enumerable.From(this.studentCheckboxes)
                    .Where(x => x.checked)
                    .ForEach(x => {
                        var studentid = parseInt(this.commonUtils.getUid(x.id));
                        if (lookup.Contains(studentid)) {
                            selectedStudents.push(lookup.Get(studentid));
                        }
                    });


                this.popupWindow.close().destroy();

                const tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(selectedStudents);
                }
            });

        this.kendoHelper.createKendoButton("cancel-button",
            (e) => {
                this.popupWindow.close().destroy();
            });

        $(`#${window.id}`).parent().addClass("h-window-caption");
        this.popupWindow.center().open();
    }
}