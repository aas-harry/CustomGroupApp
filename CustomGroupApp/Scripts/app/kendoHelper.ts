class StudentClassRow extends kendo.data.ObservableObject{
    constructor(student: StudentClass) {
        super(null);
        this.convert(student);
    }
    name: string;
    gender: string;
    score: number;
    class: number;
    langPref1: string;
    langPref2: string;
    langPref3: string;
    hasLanguagePrefs = false;

    convert = (student: StudentClass) => {
        this.name = student.name;
        this.gender = student.gender;
        this.score = student.score;
        this.class = student.classNo;
        this.langPref1 = student.langPref1;
        this.langPref2 = student.langPref2;
        this.langPref3 = student.langPref3;
        if (this.langPref1 !== "" || this.langPref2 !== "" || this.langPref3 !== "") {
            this.hasLanguagePrefs = true;
        }
    }

    
}

class KendoHelper
{
    private integerFormat = "n0";

    createBandInputContainer = (
        cell: HTMLTableCellElement,
        bandNo: number,
        classCount = 1,
        callback,
        addLabel = false): kendo.ui.NumericTextBox => {
        if (addLabel) {
            const label = document.createElement("span");
            label.textContent = `Band ${bandNo}`;
            label.setAttribute("style", "margin-right: 5px");
            cell.appendChild(label);
        }

        var element = document.createElement("input") as HTMLInputElement;
        element.type = "text";
        element.setAttribute("style", "width: 100px");
        element.id = `band-${bandNo}`;
        cell.appendChild(element);

        return this.createBandInputField(element.id, classCount, callback);
    }

    createStudentClassInputContainer = (
        cell: HTMLTableCellElement,
        classItem: ClassDefinition,
        editGroupNameCallback: any
    ) => {
        var classGridHeight = classItem.parent.classes.length > 3 ? "500px" : "700px";
        var container = document.createElement("div") as HTMLDivElement;
        container.setAttribute("style", `width: 300px; height: ${classGridHeight}; margin: 5px 0 0 0;`);
        container.id = `class${classItem.parent.bandNo}-${classItem.index}-container`;
        var gridElement = document.createElement("div") as HTMLDivElement;
        gridElement.setAttribute("style", "height: 100%;");
        gridElement.id = `class${classItem.parent.bandNo}-${classItem.index}`;
        var summaryElement = this.createClassSummary(classItem);
        container.appendChild(gridElement);

        cell.appendChild(container);
        cell.appendChild(summaryElement);

        return this.createStudentClassGrid(gridElement.id, classItem, editGroupNameCallback);;
    };

    createClassInputContainer = (
        cell: HTMLTableCellElement,
        studentCount = 1,
        classNo: number,
        bandNo: number = 1,
        callbackChangeEvent = null,
        addLabel = false): kendo.ui.NumericTextBox => {
        if (addLabel) {
            const label = document.createElement("span");
            label.textContent = `Class ${classNo}`;
            label.setAttribute("style", "margin-right: 5px");
            cell.appendChild(label);
        }

        var element = document.createElement("input") as HTMLInputElement;
        element.type = "text";
        element.setAttribute("style", "width: 100px");
        element.id = `class${bandNo}-${classNo}`;
        cell.appendChild(element);

        return this.createClassInputField(element.id, studentCount, callbackChangeEvent);;
    }

    createStudentsInputContainer = (
        cell: HTMLTableCellElement,
        studentCount: number,
        classNo: number,
        bandNo: number = 1,
        callbackChangeEvent = null,
        addLabel = false): kendo.ui.NumericTextBox => {
        if (addLabel) {
            const label = document.createElement("span");
            label.textContent = "No. Students";
            label.setAttribute("style", "margin-right: 5px");
            cell.appendChild(label);
        }

        var element = document.createElement("input") as HTMLInputElement;
        element.type = "text";
        element.setAttribute("style", "width: 100px");
        element.id = `students-${bandNo}-${classNo}`;
        cell.appendChild(element);

        return this.createStudentsInputField(element.id, studentCount, callbackChangeEvent);
    }

    createLabel = (cell: HTMLTableCellElement, description: string) => {
     var label = document.createElement("span");
        label.textContent = description;
        label.setAttribute("style", "margin-right: 5px");
        cell.appendChild(label);

    }
    createMultiLineLabel = (cell: HTMLTableCellElement, line1: string, line2: string, separator: string = "/") => {
        var label = document.createElement("span");
        label.textContent = line1;
        label.setAttribute("style", "margin-right: 5px");
        cell.appendChild(label);

    }

    createStudentClassGrid = (
        element: string,
        classItem: ClassDefinition,
        editGroupNameCallback: any): kendo.ui.Grid => {
        var grid = this.createClassGrid(element, classItem, editGroupNameCallback);

        $(`#${element}`).kendoDraggable({
            filter: "tr",
            hint(e) {
                var item = $('<div class="k-grid k-widget" style="background-color: DarkOrange; color: black;"><table><tbody><tr>' + e.html() + "</tr></tbody></table></div>");
                return item;
            },
            group: "classGroup"
        });

        
        grid.table.kendoDropTarget({
            drop(e) {
                
                var foo = e.draggable.currentTarget.data("uid");

                //var dataItem = dataSource1.getByUid(e.draggable.currentTarget.data("uid"));
                //dataSource1.remove(dataItem);
                //dataSource2.add(dataItem);

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

    createClassInputField = (
        element: string,
        studentCount = 1,
        callbackChangeEvent = null) : kendo.ui.NumericTextBox => {
        return this.createNumericTextBox(
            element,
            studentCount,
            0,
            250,
            this.integerFormat,
            callbackChangeEvent);
    }

    createBandInputField = (
        element: string,
        classCount = 1,
        callbackChangeEvent = null): kendo.ui.NumericTextBox => {
        return this.createNumericTextBox(
            element,
            classCount,
            1,
            5,
            this.integerFormat,
            callbackChangeEvent);
    }

    createStudentsInputField = (
        element: string,
        studentCount: number = 1,
        callbackChangeEvent = null): kendo.ui.NumericTextBox => {
        return this.createNumericTextBox(
            element,
            studentCount,
            1,
            250,
            this.integerFormat,
            callbackChangeEvent);
    }

    createClassGrid = (element: string, classItem: ClassDefinition, editGroupCallback: any): kendo.ui.Grid => {
        const groupNameElementId = "groupname-" + classItem.uid;
        $(`#${element}`)
            .kendoGrid({
                columns: [
                    { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                    { field: "score", title: "Score", width: "80px", attributes: { 'class': "text-center" } }
                ],
                toolbar: [{ template: kendo.template("Group Name: <input id='${groupNameElementId}' style='margin: 0 5px 0 5px' data-validmask-msg='Group name must not be blank' required='required' />")}],
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
                    tooltipText += `<br>1st Language Pref: ${student.langPref1 === "" ? "None" : student.langPref1}`;
                    tooltipText += `<br>2nd Language Pref: ${student.langPref2 === "" ? "None" : student.langPref2}`;
                    tooltipText += `<br>3rd Language Pref: ${student.langPref3 === "" ? "None" : student.langPref3}`;
                }

                return "<div style='text-align: left; margin: 10px; padding: 5px'>" + tooltipText + "</div>";
            }
        }).data("kendoTooltip");

        return $(`#${element}`).data("kendoGrid");
    }

    private createClassSummary = (classItem: ClassDefinition): HTMLDivElement => {
        var element = document.createElement("div");
        element.setAttribute("style", "border-style: solid; border-color: #bfbfbf; border-width: 1px; padding: 5px 5px 5px 10px; margin: 5px 0 0 0");
        var elementCnt = document.createElement("div");
        elementCnt.textContent = "No. of Students: " + classItem.count;
        var elementAvg = document.createElement("div");
        elementAvg.textContent = "Composite Score Avg.: " + Math.round(classItem.average);
        element.appendChild(elementCnt);
        element.appendChild(elementAvg);
        return element;
    };

    createNumericTextBox = (
        element: string,
        defaultValue = 0,
        min = 0,
        max = 10,
        format = this.integerFormat,
        callbackChangeEvent = null) : kendo.ui.NumericTextBox => {

        $(`#${element}`)
            .kendoNumericTextBox({
                options: {},
                change: callbackChangeEvent
                //spin: callbackChangeEvent
            } as kendo.ui.NumericTextBoxOptions);

        const numericTextBox = $(`#${element}`).data("kendoNumericTextBox");
        numericTextBox.options.format = format;
        numericTextBox.value(defaultValue);
        numericTextBox.max(max);
        numericTextBox.min(min);
        return numericTextBox;
    }
}