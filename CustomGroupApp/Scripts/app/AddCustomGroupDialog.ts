class AddCustomGroupDialog{

    container: HTMLElement;
    name: string;
    students: Array<Student> = [];
    maxRows = 21;

    private studentCheckboxes = new Array<HTMLInputElement>();
    private commonUtils = new CommonUtils();
    private kendoHelper = new KendoHelper();
    private messageBox = new MessageBoxDialog();
    private groupNameElement : HTMLInputElement;

    createTable = (element: HTMLElement, students: Array<StudentClass>) => {
        var cnt = 0;
       
        this.studentCheckboxes = [];
        this.container = element;
      
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

       
        for (let student of Enumerable.From(students).OrderBy(x => x.name).ToArray()) {
          
            if (cnt > this.maxRows) {
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
        callback: (groupName: string, students: Array<StudentClass>) => any,
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
                title: 'Add a Custom Group'
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

        const groupNameContainer = document.createElement("div");
        groupNameContainer.setAttribute("style", "padding: 5px");
        const groupNameLabel = document.createElement("label");
        groupNameLabel.textContent = "Enter Group Name:";
        const groupNameTextbox = document.createElement("input");
        groupNameTextbox.type = "text";
        groupNameTextbox.id = "group-name";
        groupNameTextbox.setAttribute("style", "width: 300px; margin-left: 5px");
        groupNameTextbox.setAttribute("class", "k-textbox");
        groupNameContainer.setAttribute("placeholder", "enter group name");
        groupNameContainer.appendChild(groupNameLabel);
        groupNameContainer.appendChild(groupNameTextbox);
        window.appendChild(groupNameContainer);

        this.groupNameElement = groupNameTextbox;

        this.createTable(window, students);

        this.kendoHelper.createKendoButton("save-button",
            (e) => {
                var groupName = this.groupNameElement.value;
                if (! groupName) {
                    return;
                }
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
                    tmpCallback(groupName, selectedStudents);
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