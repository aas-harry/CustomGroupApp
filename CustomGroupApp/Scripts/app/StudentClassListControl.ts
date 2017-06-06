class StudentClassListControl {
    private kendoHelper = new KendoHelper();
    private groupingHelper = new GroupingHelper();
    private editGroupNameCallback: (classItem: ClassDefinition, status: boolean) => any;
    private updateStudentsCallback: (classItem: ClassDefinition, status: boolean) => any;
    private hideClassCallback: (classItem: ClassDefinition) => any;
    private dragdropCallback: (targetUid: string, sourceUid: string, studentId: number) => any;
    private editClassMode = false;
    private classItem: ClassDefinition;
    private students: Array<StudentClass>;
    private popupWindowElement: string;
    private gridControl: kendo.ui.Grid;

    constructor(classItem: ClassDefinition,
        students: Array<StudentClass>,
        editClassMode = false,
        popupWindowElement: string) {
        this.classItem = classItem;
        this.students = students;
        this.editClassMode = editClassMode;
        this.popupWindowElement = popupWindowElement;
    }

    destroy = () => {
        // TODO
    }

    createStudentClassInputContainer = (
        cell: HTMLTableCellElement,
        editGroupNameCallback: (classItem: ClassDefinition, status: boolean) => any,
        updateStudentsCallback: (classItem: ClassDefinition, status: boolean) => any,
        hideClassCallback: (classItem: ClassDefinition) => any,
        dragdropCallback: (targetUid: string, sourceUid: string, studentId: number) => any): kendo.ui.Grid => {
        this.editGroupNameCallback = editGroupNameCallback;
        this.updateStudentsCallback = updateStudentsCallback;
        this.dragdropCallback = dragdropCallback;
        this.hideClassCallback = hideClassCallback;

        const classGridHeight = this.classItem.parent.classes.length > 3 &&
            this.classItem.parent.bandType === BandType.None
            ? "500px"
            : "600px";

        const classGridWidth = this.classItem.parent.parent.parent.testFile.isUnisex ? "400px" : "300px";

        const container = document.createElement("div") as HTMLDivElement;
        container.setAttribute("style", `width: ${classGridWidth}; height: ${classGridHeight}; padding: 2.5px`);
        container.id = `class-${this.classItem.uid}-container`;

        const gridElement = document.createElement("div") as HTMLDivElement;
        gridElement.setAttribute("style", "height: 100%;");
        gridElement.id = `class-${this.classItem.uid}`;

        const summaryElement = this.createClassSummary();
        container.appendChild(gridElement);

        cell.appendChild(container);
        cell.appendChild(summaryElement);

        return this.createStudentClassGrid(gridElement.id, this.classItem);
    };

    calculateHeight = (): string => {
        return "";
    }

    createStudentClassGrid = (element: string, classItem: ClassDefinition): kendo.ui.Grid => {
        this.gridControl = this.createClassGrid(element);

        $(`#${element}`)
            .kendoDraggable({
                filter: "tr",
                hint(e) {
                    const studentName = e[0].cells[0].textContent;
                    return $(`<div style="background-color: DarkOrange; color: black"><div class="k-grid k-widget" style="padding=15px">${
                        studentName}</div></div>`);
                },
                group: "classGroup"
            });

        var dropCallback = this.dragdropCallback;
        this.gridControl.table.kendoDropTarget({
            drop(e) {
                const sourceClass = $(e.draggable.element).attr('id');
                const sourceGrid = $(`#${sourceClass}`).data("kendoGrid");
                const sourceDatasource = sourceGrid.dataSource.view();
                const sourceObject = (Object)(e.draggable.currentTarget[0]);
                if (! sourceObject || sourceObject.rowIndex >= sourceDatasource.length) {
                    return;
                }
                const student = sourceDatasource[sourceObject.rowIndex];
                if (dropCallback(`class-${classItem.uid}`, sourceClass, student.id)) {

                    const targetGrid = $(`#class-${classItem.uid}`).data("kendoGrid");
                    const targetDatasource = targetGrid.dataSource.view();
                    for (let i = 0; i < sourceDatasource.length; i++) {
                        if (sourceDatasource[i].id === student.id) {
                            let student = sourceDatasource[i];
                            sourceDatasource.remove(student);
                            targetDatasource.push(student);
                            sourceGrid.refresh();
                            targetGrid.refresh();
                        }
                    }
                }
            },
            group: "classGroup"
        });

        // Populate the grid
        this.setDatasource();
        return this.gridControl;
    }

    setDatasource = () => {
        var students: Array<StudentClassRow> = [];
        Enumerable.From(this.classItem.students)
            .OrderBy(x => x.name)
            .ForEach(x => students.push(new StudentClassRow(x)));
        this.gridControl.dataSource.data(students);
        this.gridControl.refresh();
        this.gridControl.resize();
    }

    createClassGrid = (element: string): kendo.ui.Grid => {
        const self = this;
        const groupNameElementId = "groupname-" + this.classItem.uid;
        const updateClassElementId = "updateclass" + this.classItem.uid;
        const hideClassElementId = "hideclass" + this.classItem.uid;
        const isUniSex = this.classItem.parent.parent.parent.testFile.isUnisex;

        let columns: any;
        if (isUniSex) {
            columns = [
                { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                { field: "gender", title: "Sex", width: "80px", attributes: { 'class': "text-center" } },
                {
                    field: "score",
                    title: "Score",
                    width: "80px",
                    attributes: { 'class': "text-nowrap", 'style': "text-align: center" }
                }
            ];
        } else {
            columns = [
                { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                {
                    field: "score",
                    title: "Score",
                    width: "50px",
                    attributes: { 'class': "text-nowrap", 'style': "text-align: center" }
                }
            ];
        }

        const btnStyle = "style = 'margin-right: 0px'";
        // Create students grid
        $(`#${element}`)
            .kendoGrid({
                columns: columns,
                sortable: {
                    mode: "single",
                    allowUnsort: true
                },
                toolbar: [
                    {
                        template: kendo.template(
                            `Group: <input id='${groupNameElementId}' style='margin: 0 5px 0 5px' />` +
                            (this.editClassMode
                                ? `<button id='${updateClassElementId}' ${btnStyle}'>Edit Class</button>`
                                : `<button id='${hideClassElementId}' ${btnStyle}'>Hide</button>`)
                        )
                    }
                ],
                selectable: "row",
                dataSource: []
            });

        // The Tooltip
        this.kendoHelper.createToolTip(updateClassElementId, "Add or Remove students from this custom group");

        // create edit button to add and remove students
        this.kendoHelper.createKendoButton(updateClassElementId,
            (e) => {
                const studentSelector = new StudentSelector();
                studentSelector.openDialog(document.getElementById(self.popupWindowElement),
                    self.students,
                    self.classItem.students,
                    (students) => {
                        self.classItem.clearAddStudents(students);
                        self.classItem.calculateClassesAverage();
                        self.setDatasource();
                        self.updateClassSummaryContent();

                        this.groupingHelper.updateStudentsInClass(self.classItem,
                            (status) => {
                                if (status) {
                                    const callback = self.updateStudentsCallback;
                                    if (callback) {
                                        callback(self.classItem, true);
                                    }
                                }
                            });
                    },
                    30);
            });

        // Crerate hide button
        this.kendoHelper.createKendoButton(hideClassElementId,
            (e) => {
                const callback = self.hideClassCallback;
                if (callback) {
                    callback(self.classItem);
                }
            });

        // create group name field
        $(`#${groupNameElementId}`)
            .kendoMaskedTextBox({
                value: this.classItem.name,
                change: (e) => {
                    var inputControl = e.sender as kendo.ui.MaskedTextBox;

                    self.classItem.name = inputControl.value();
                    // Update group name in the database
                    if (self.editClassMode) {
                        self.groupingHelper.updateGroupName(this.classItem,
                            (status) => {
                                const callback = self.editGroupNameCallback;
                                if (callback) {
                                    callback(self.classItem, status);
                                }
                            });
                    } else {
                        self.editGroupNameCallback(self.classItem, true);
                    }
                }
            });

        // Create name tooltip
        $(`#${element}`)
            .kendoTooltip({
                filter: "td:nth-child(1)", //this filter selects the first column cells
                showOn: "click",
                position: "bottom",
                content(e) {
                    const dataItem = $(`#${element}`).data("kendoGrid").dataItem(e.target.closest("tr"));
                    const student = dataItem as StudentClassRow;
                    let tooltipText = `<strong>${student
                        .name}</strong><br>Gender: ${student.gender}<br>Composite Score: ${student.score}`;

                    if (student.hasLanguagePrefs) {
                        tooltipText += `<br><br>1st Language Pref: ${
                            student.langPref1 === "" ? "None" : student.langPref1
                            }`;
                        tooltipText += `<br>2nd Language Pref: ${student.langPref2 === "" ? "None" : student.langPref2
                            }`;
                        tooltipText += `<br>3rd Language Pref: ${student.langPref3 === "" ? "None" : student.langPref3
                            }`;
                    }

                    return "<div style='background-color: lightgoldenrodyellow'><div style='text-align: left; padding: 15px;'>" + tooltipText + "</div></div>";
                }
            })
            .data("kendoTooltip");

        return $(`#${element}`).data("kendoGrid");
    }

    private createClassSummary = (): HTMLDivElement => {
        var element = document.createElement("div");
        element.id = `summary-${this.classItem.uid}`;
        element.setAttribute("style",
            "color: black; border-style: solid; border-color: #bfbfbf; border-width: 1px; padding: 5px; margin: 2.5px");

        return this.createClassSummaryContent(element);
    };

    updateClassSummaryContent = () => {
        var element = document.getElementById(`summary-${this.classItem.uid}`) as HTMLDivElement;
        if (element) {
            this.createClassSummaryContent(element);
        }
    }

    private createClassSummaryContent = (container: HTMLDivElement): HTMLDivElement => {
        if (container.childElementCount > 0) {
            while (container.hasChildNodes()) {
                container.removeChild(container.lastChild);
            }
        }
        if (this.classItem.parent.parent.parent.testFile.isUnisex) {
            const table = document.createElement("table") as HTMLTableElement;
            const header = table.createTHead();
            const headerRow = header.insertRow();
            this.kendoHelper.createLabel(headerRow.insertCell(), "", 400);
            this.kendoHelper.createLabel(headerRow.insertCell(), "Count", 100, "center");
            this.kendoHelper.createLabel(headerRow.insertCell(), "Average", 100, "center");

            const body = table.createTBody();

            let schoolRow = body.insertRow();
            this.kendoHelper.createLabel(schoolRow.insertCell(), "Composite Score Avg.", 400);
            this.kendoHelper.createNumberLabel(schoolRow.insertCell(), this.classItem.count, 100);
            this.kendoHelper.createLabel(schoolRow.insertCell(), this.classItem.average.toFixed(0), 100);
            schoolRow = body.insertRow();
            this.kendoHelper.createLabel(schoolRow.insertCell(), "Girls Comp. Score Avg.", 400);
            this.kendoHelper.createNumberLabel(schoolRow.insertCell(), this.classItem.girlsCount, 100);
            this.kendoHelper.createLabel(schoolRow.insertCell(), this.classItem.girlsAverage.toFixed(0), 100);
            schoolRow = body.insertRow();
            this.kendoHelper.createLabel(schoolRow.insertCell(), "Boys Comp. Score Avg.", 400);
            this.kendoHelper.createNumberLabel(schoolRow.insertCell(), this.classItem.boysCount, 100);
            this.kendoHelper.createLabel(schoolRow.insertCell(), this.classItem.boysAverage.toFixed(0), 100);

            container.appendChild(table);
        } else {
            var elementCnt = document.createElement("div");
            elementCnt.textContent = "No. of Students: " + this.classItem.count;
            var elementAvg = document.createElement("div");
            elementAvg.textContent = "Composite Score Avg.: " + Math.round(this.classItem.average);
            container.appendChild(elementCnt);
            container.appendChild(elementAvg);
        }
        return container;
    }

}