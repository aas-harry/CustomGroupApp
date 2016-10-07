class StudentClassListControl {
    private kendoHelper = new KendoHelper();

    createStudentClassInputContainer = (
        cell: HTMLTableCellElement,
        classItem: ClassDefinition,
        editGroupNameCallback: any,
        dropCallback: (targetUid: string, sourceUid: string, studentId: number) => any
    ) => {
        var classGridHeight = classItem.parent.classes.length > 3 && classItem.parent.bandType === BandType.None ? "500px" : "700px";
        var classGridWidth = classItem.parent.parent.parent.testFile.isUnisex ? "400px" : "300px";
        var container = document.createElement("div") as HTMLDivElement;
        container.setAttribute("style", `width: ${classGridWidth}; height: ${classGridHeight}; margin: 5px 0 0 0;`);
        container.id = `class-${classItem.uid}-container`;
        var gridElement = document.createElement("div") as HTMLDivElement;
        gridElement.setAttribute("style", "height: 100%;");
        gridElement.id = `class-${classItem.uid}`;
        var summaryElement = this.createClassSummary(classItem);
        container.appendChild(gridElement);

        cell.appendChild(container);
        cell.appendChild(summaryElement);

        return this.createStudentClassGrid(gridElement.id, classItem, editGroupNameCallback, dropCallback);;
    };

    createStudentClassGrid = (
        element: string,
        classItem: ClassDefinition,
        editGroupNameCallback: any,
        dropCallback: (targetUid: string, sourceUid: string, studentId: number) => any): kendo.ui.Grid => {
        var grid = this.createClassGrid(element, classItem, editGroupNameCallback);

        $(`#${element}`).kendoDraggable({
            filter: "tr",
            hint(e) {
                const studentId = e[0].cells[1].textContent;
                const studentName = e[0].cells[0].textContent;
                return $(`<div id="student-${studentId}" style="background-color: DarkOrange; color: black"><div class="k-grid k-widget" style="padding=15px">${
                    studentName}</div></div>`);
            },
            group: "classGroup"
        });


        grid.table.kendoDropTarget({
            drop(e) {
                const targetObject = (Object)(e.draggable.currentTarget[0]);
                const studentId = parseInt(targetObject.cells[1].textContent);
                const sourceClass = $(e.draggable.element).attr('id');
                if (dropCallback(`class-${classItem.uid}`, sourceClass, studentId)) {
                    let sourceGrid = $(`#${sourceClass}`).data("kendoGrid");
                    let targetGrid = $(`#class-${classItem.uid}`).data("kendoGrid");
                    var sourceDatasource = sourceGrid.dataSource.view();

                    var targetDatasource = targetGrid.dataSource.view();
                    for (let i = 0; i < sourceDatasource.length; i++) {
                        if (sourceDatasource[i].id === studentId) {
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
        var students: Array<StudentClassRow> = [];
        Enumerable.From(classItem.students).ForEach(x => students.push(new StudentClassRow(x)));
        grid.dataSource.data(students);
        grid.refresh();
        grid.resize();
        return grid;
    }

    createClassGrid = (element: string, classItem: ClassDefinition, editGroupCallback: any): kendo.ui.Grid => {
        const groupNameElementId = "groupname-" + classItem.uid;
        var isUniSex = classItem.parent.parent.parent.testFile.isUnisex;
        var columns: { field: string; title: string; width: string; attributes: { class: string } }[];
        if (isUniSex) {
            columns = [
                { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                { field: "id", title: "", width: "0px", attributes: { 'class': "text-nowrap" } },
                { field: "gender", title: "Sex", width: "80px", attributes: { 'class': "text-center" } },
                { field: "score", title: "Score", width: "80px", attributes: { 'class': "text-center" } }
            ];
        } else {
            columns = [
                { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                { field: "id", title: "", width: "0px", attributes: { 'class': "text-nowrap" } },
                { field: "score", title: "Score", width: "80px", attributes: { 'class': "text-center" } }
            ];
        }

        var btnStyle = "style = 'margin-right: 5px'";
        var btnClass = "class='btn-xs btn-default pull-right'";
        $(`#${element}`)
            .kendoGrid({
                columns: columns,
                sortable: {
                    mode: "single",
                    allowUnsort: true
                },
                toolbar: [{
                    template: kendo.template(
                        `Group Name: <input id='${groupNameElementId}' style='margin: 0 5px 0 5px' />` +
                        `<button ${btnClass} id='class-${classItem.uid}' data-bind='click: hideClass' ${btnStyle}'>Hide</button>`
                    )
                }],
                selectable: "row",
                dataSource: []
            });

        $(`#${groupNameElementId}`)
            .kendoMaskedTextBox({
                value: classItem.name,
                change: editGroupCallback
            });

        // Create name tooltip
        $(`#${element}`).kendoTooltip({
            filter: "td:nth-child(1)", //this filter selects the first column cells
            position: "center",
            content(e) {
                const dataItem = $(`#${element}`).data("kendoGrid").dataItem(e.target.closest("tr"));
                const student = dataItem as StudentClassRow;
                let tooltipText = `<strong>${student.name}</strong><br>Gender: ${student.gender}<br>Composite Score: ${student.score}`;

                if (student.hasLanguagePrefs) {
                    tooltipText += `<br><br>1st Language Pref: ${student.langPref1 === "" ? "None" : student.langPref1}`;
                    tooltipText += `<br>2nd Language Pref: ${student.langPref2 === "" ? "None" : student.langPref2}`;
                    tooltipText += `<br>3rd Language Pref: ${student.langPref3 === "" ? "None" : student.langPref3}`;
                }

                return "<div style='background-color: lightgoldenrodyellow'><div style='text-align: left; padding: 15px;'>" + tooltipText + "</div></div>";
            }
        }).data("kendoTooltip");

        return $(`#${element}`).data("kendoGrid");
    }

    private createClassSummary = (classItem: ClassDefinition): HTMLDivElement => {
        var element = document.createElement("div");
        element.id = `summary-${classItem.uid}`;
        element.setAttribute("style", "border-style: solid; border-color: #bfbfbf; border-width: 1px; padding: 5px 5px 5px 10px; margin: 5px 0 0 0");

        return this.createClassSummaryContent(classItem, element);
    };

    updateClassSummaryContent = (classItem: ClassDefinition) => {
        var element = document.getElementById(`summary-${classItem.uid}`) as HTMLDivElement;
        if (element) {
            this.createClassSummaryContent(classItem, element);
        }
    }

    private createClassSummaryContent = (classItem: ClassDefinition, container: HTMLDivElement): HTMLDivElement => {
        if (container.childElementCount > 0) {
            while (container.hasChildNodes()) {
                container.removeChild(container.lastChild);
            }
        }
        if (classItem.parent.parent.parent.testFile.isUnisex) {
            const table = document.createElement("table") as HTMLTableElement;
            const header = table.createTHead();
            const headerRow = header.insertRow();
            this.kendoHelper.createLabel(headerRow.insertCell(), "", 400);
            this.kendoHelper.createLabel(headerRow.insertCell(), "Count", 100, "center");
            this.kendoHelper.createLabel(headerRow.insertCell(), "Average", 100, "center");

            const body = table.createTBody();

            let schoolRow = body.insertRow();
            this.kendoHelper.createLabel(schoolRow.insertCell(), "Composite Score Avg.", 400);
            this.kendoHelper.createNumberLabel(schoolRow.insertCell(), classItem.count, 100);
            this.kendoHelper.createLabel(schoolRow.insertCell(), classItem.average.toFixed(0), 100);
            schoolRow = body.insertRow();
            this.kendoHelper.createLabel(schoolRow.insertCell(), "Girls Comp. Score Avg.", 400);
            this.kendoHelper.createNumberLabel(schoolRow.insertCell(), classItem.girlsCount, 100);
            this.kendoHelper.createLabel(schoolRow.insertCell(), classItem.girlsAverage.toFixed(0), 100);
            schoolRow = body.insertRow();
            this.kendoHelper.createLabel(schoolRow.insertCell(), "Boys Comp. Score Avg.", 400);
            this.kendoHelper.createNumberLabel(schoolRow.insertCell(), classItem.boysCount, 100);
            this.kendoHelper.createLabel(schoolRow.insertCell(), classItem.boysAverage.toFixed(0), 100);

            container.appendChild(table);
        } else {
            var elementCnt = document.createElement("div");
            elementCnt.textContent = "No. of Students: " + classItem.count;
            var elementAvg = document.createElement("div");
            elementAvg.textContent = "Composite Score Avg.: " + Math.round(classItem.average);
            container.appendChild(elementCnt);
            container.appendChild(elementAvg);
        }
        return container;
    }

}
