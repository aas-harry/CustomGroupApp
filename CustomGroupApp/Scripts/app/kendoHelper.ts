class StudentClassRow extends kendo.data.ObservableObject{
    constructor(student: StudentClass) {
        super(null);
        this.convert(student);
    }
    id: number;
    name: string;
    gender: string;
    score: number;
    class: number;
    langPref1: string;
    langPref2: string;
    langPref3: string;
    hasLanguagePrefs = false;

    convert = (student: StudentClass) => {
        this.id = student.id;
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

// Input container to enter number of students in a band
class StudentBandInputContainer {
    constructor(cell: HTMLTableCellElement,
        bandItem: BandDefinition,
        callback: (bandItem: BandDefinition, newValue: number, oldValue: number, inputControl: kendo.ui.NumericTextBox) => any,
        addLabel = false) {

        this.cell = cell;
        this.bandItem = bandItem;
        this.callbackAction = callback;
        this.addLabel = addLabel;

        this.init();
    }

    private cell: HTMLTableCellElement;
    private bandItem: BandDefinition;
    private callbackAction : (bandItem: BandDefinition, newValue: number, oldValue: number, inputControl: kendo.ui.NumericTextBox) => any;
    private addLabel: boolean;
    private inputControl: kendo.ui.NumericTextBox;
    private kendoHelper = new KendoHelper();

    private init = () => {
        if (this.addLabel) {
            const label = document.createElement("span");
            label.textContent = `# Students ${this.bandItem.bandNo}`;
            label.setAttribute("style", "margin-right: 5px");
            this.cell.appendChild(label);
        }

        var element = document.createElement("input") as HTMLInputElement;
        element.type = "text";
        element.setAttribute("style", "width: 100px");
        element.id = `studentband-${this.bandItem.uid}`;
        this.cell.appendChild(element);

        this.kendoHelper.createStudentCountInputControl(element.id, this.bandItem.studentCount, this.onStudentCountChanged);
    }

    private onStudentCountChanged = (count: number, inputControl: kendo.ui.NumericTextBox) => {
        const oldValue = this.bandItem.studentCount;
        const newValue = count;

        this.bandItem.studentCount = count;

        if (this.callbackAction != null) {
            this.callbackAction(this.bandItem, newValue, oldValue, inputControl);
        }
    }
    
}

// Input container to enter number of classes in a band
class ClassBandInputContainer {
    constructor(cell: HTMLTableCellElement,
        bandItem: BandDefinition,
        callback: (bandItem: BandDefinition, newValue: number, oldValue: number, inputControl: kendo.ui.NumericTextBox) => any,
        addLabel = false) {

        this.cell = cell;
        this.bandItem = bandItem;
        this.callbackAction = callback;
        this.addLabel = addLabel;

        this.init();
    }

    private cell: HTMLTableCellElement;
    private bandItem: BandDefinition;
    private callbackAction: (bandItem: BandDefinition, newValue: number, oldValue: number, inputControl: kendo.ui.NumericTextBox) => any;
    private addLabel: boolean;
    private inputControl: kendo.ui.NumericTextBox;
    private kendoHelper = new KendoHelper();

    private init = () => {
        if (this.addLabel) {
            const label = document.createElement("span");
            label.textContent = `# Classes ${this.bandItem.bandNo}`;
            label.setAttribute("style", "margin-right: 5px");
            this.cell.appendChild(label);
        }

        var element = document.createElement("input") as HTMLInputElement;
        element.type = "text";
        element.setAttribute("style", "width: 100px");
        element.id = `classband-${this.bandItem.uid}`;
        this.cell.appendChild(element);

        this.kendoHelper.createClassCountInputControl(element.id, this.bandItem.classCount, this.onClassCountChanged);
    }

    private onClassCountChanged = (count: number, inputControl: kendo.ui.NumericTextBox) => {
        let oldValue = this.bandItem.classCount;
        let newValue = count;

        this.bandItem.classCount = count;

        if (this.callbackAction != null) {
            this.callbackAction(this.bandItem, newValue, oldValue, inputControl);
        }
    }

}

// Input container to enter number of students in a band
class StudentClassInputContainer {
    constructor(cell: HTMLTableCellElement,
        public classItem: ClassDefinition,
        callback: (classItem: ClassDefinition, newValue: number, oldValue: number, inputControl: kendo.ui.NumericTextBox) => any,
        addLabel = false) {

        this.cell = cell;
        this.classItem = classItem;
        this.callbackAction = callback;
        this.addLabel = addLabel;

        this.init();
    }

    private cell: HTMLTableCellElement;
    private callbackAction: (classItem: ClassDefinition, newValue: number, oldValue: number, inputControl: kendo.ui.NumericTextBox) => any;
    private addLabel: boolean;
    private inputControl: kendo.ui.NumericTextBox;
    private kendoHelper = new KendoHelper();

    private init = () => {
        if (this.addLabel) {
            const label = document.createElement("span");
            label.textContent = `Class ${this.classItem.index}`;
            label.setAttribute("style", "margin-right: 5px");
            this.cell.appendChild(label);
        }

        var element = document.createElement("input") as HTMLInputElement;
        element.type = "text";
        element.setAttribute("style", "width: 100px; margin-right: 20px");
        const elementId = this.classItem ? this.classItem.uid : createUuid();
        element.id = `studentclass-${elementId}`;
        this.cell.appendChild(element);

        const studentCount = this.classItem ? this.classItem.count : 0;
        this.inputControl = this.kendoHelper.createStudentCountInputControl(element.id, studentCount, this.onStudentCountChanged);

        if (this.classItem.notUsed) {
            this.hideInput();
        }
    }

    private onStudentCountChanged = (count: number, inputControl: kendo.ui.NumericTextBox) => {
        const oldValue = this.classItem.count;
        const newValue = count;

        this.classItem.count = count;

        if (this.callbackAction != null) {
            this.callbackAction(this.classItem, newValue, oldValue, inputControl);
        }
    }

    hideInput = () => {
        this.classItem.notUsed = true;
        this.inputControl.value(this.inputControl.min());
        this.inputControl.enable(false);
    }

    showInput = (count: number) => {
        this.classItem.notUsed = false;
        this.inputControl.value(count);
        this.inputControl.enable(true);
    }
}

class KendoHelper
{
    private integerFormat = "n0";

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
        element.id = `class-${bandNo}-${classNo}`;
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

        return this.createStudentCountInputControl(element.id, studentCount, callbackChangeEvent);
    }

    createLabel = (cell: HTMLTableCellElement, description: string, width = 150, textAlign = "left") => {
        var label = document.createElement("span");
        label.textContent = description;
        label.setAttribute("style", `margin-right: 5px; width: ${width}px; textAlign: ${textAlign}`);
        cell.appendChild(label);

    }
    createNumberLabel = (cell: HTMLTableCellElement, value: number, width = 150) => {
        var label = document.createElement("span");
        label.textContent = value.toString();
        label.setAttribute("style", `margin-right: 5px; width: ${width}px; text-align: center`);
        cell.appendChild(label);
    }

    createMultiLineLabel = (cell: HTMLTableCellElement, line1: string, line2: string, separator: string = "/") => {
        var label = document.createElement("span");
        label.textContent = line1 + " " + separator + line2;
        label.setAttribute("style", "margin-right: 5px");
        cell.appendChild(label);

    }

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
                const targetObject = (Object) (e.draggable.currentTarget[0]);
                const studentId = parseInt(targetObject.cells[1].textContent);
                const sourceClass = $(e.draggable.element).attr('id');
                if (dropCallback(`class-${classItem.uid}`, sourceClass, studentId)) {
                    let sourceGrid = $(`#${sourceClass}`).data("kendoGrid");
                    let targetGrid = $(`#class-${classItem.uid}`).data("kendoGrid");
                    var sourceDatasource = sourceGrid.dataSource.view();
                
                    var targetDatasource = targetGrid.dataSource.view();
                    for (let i=0; i< sourceDatasource.length; i++) {
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

    createClassCountInputControl = (
        element: string,
        classCount = 1,
        callbackChangeEvent: (count: number, inputControl: kendo.ui.NumericTextBox) => any = null)
        : kendo.ui.NumericTextBox => {
        return this.createNumericTextBox(
            element,
            classCount,
            1,
            50,
            this.integerFormat,
            callbackChangeEvent);
    }


    // This function convert the passed element id into numerictextbox for student count input textbox
    createStudentCountInputControl = (
        element: string,
        studentCount: number = 1,
        callbackChangeEvent: (count: number, inputControl: kendo.ui.NumericTextBox) => any = null)
        : kendo.ui.NumericTextBox => {
        return this.createNumericTextBox(
            element,
            studentCount,
            1,
            500,
            this.integerFormat,
            callbackChangeEvent);
    }

    createStudentCountInClassInputControl = (
        element: string,
        classItem: ClassDefinition,
        studentCount: number = 1,  // use this property to overwrite the student count in classItem
        callbackChangeEvent: (classItem: ClassDefinition, inputControl: kendo.ui.NumericTextBox) => any = null): kendo.ui.NumericTextBox => {
        return this.createNumericTextBox(
            element,
            studentCount,
            1,
            250,
            this.integerFormat,
            (value,e) => {

                if (classItem) {
                    classItem.count = value;
                }

                if (callbackChangeEvent != null) {
                    var inputControl = e as kendo.ui.NumericTextBox;
                    callbackChangeEvent(classItem, inputControl);
                }
            });
    }

    // Input control to enter the number of students in a band in a bandset
    createStudentCountInBandInputControl = (
        element: string,
        bandItem: BandDefinition,
        studentCount: number = 1,  // use this property to overwrite the student count in a band
        callbackChangeEvent: (bandItem: BandDefinition, inputControl: kendo.ui.NumericTextBox) => any = null): kendo.ui.NumericTextBox => {
        return this.createNumericTextBox(
            element,
            studentCount,
            1,
            250,
            this.integerFormat,
            (value, e) => {

                if (bandItem) {
                    bandItem.studentCount = value;
                }

               if (callbackChangeEvent != null) {
                   var inputControl = e as kendo.ui.NumericTextBox;
                   callbackChangeEvent(bandItem, inputControl);
                }
            });
    }

    createBandCountInBandSetInputControl = (
        element: string,
        bandSet: BandSet,
        bandCount: number,  // use this property to overwrite the band count in bandSet
        callbackChangeEvent: (bandSet: BandSet, inputControl: kendo.ui.NumericTextBox) => any = null): kendo.ui.NumericTextBox => {
        return this.createNumericTextBox(
            element,
            bandCount,
            1,
            250,
            this.integerFormat,
            (value, e) => {
                if (callbackChangeEvent != null) {
                    var inputControl = e as kendo.ui.NumericTextBox;
                    callbackChangeEvent(bandSet, inputControl);
                }
            });
    }

    createStudentLanguageGrid = (element: string = "student-language-preferences-list", students: Array<StudentClass>, isUnisex: boolean): kendo.ui.Grid => {
        var columns;
        if (isUnisex) {
            columns = [
                { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                { field: "gender", title: "Sex", width: "80px" },
                { field: "langPref1", title: "Pref1", width: "80px" },
                { field: "langPref2", title: "Pref1", width: "80px" },
                { field: "langPref3", title: "Pref1", width: "80px" }
            ];
        } else {
            columns = [
                { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                { field: "score", title: "Score", width: "80px" },
                { field: "langPref1", title: "Pref1", width: "80px" },
                { field: "langPref2", title: "Pref1", width: "80px" },
                { field: "langPref3", title: "Pref1", width: "80px" }
            ];
        }

        var studentLanguages = Enumerable.From(students).Select(x => new StudentClassRow(x)).ToArray();
        $(`#${element}`)
            .kendoGrid({
                columns: columns,
                sortable: {
                    mode: "single",
                    allowUnsort: true
                },
                selectable: "row",
                dataSource: studentLanguages
        });
        
        return $(`#${element}`).data("kendoGrid");
    }

    createClassGrid = (element: string, classItem: ClassDefinition, editGroupCallback: any): kendo.ui.Grid => {
        const groupNameElementId = "groupname-" + classItem.uid;
        var isUniSex = classItem.parent.parent.parent.testFile.isUnisex;
        var columns: { field: string; title: string; width: string; attributes: { class: string } }[];
        if (isUniSex) {
            columns = [
                { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                { field: "id", title: "Id", width: "0px", attributes: { 'class': "text-nowrap" } },
                { field: "gender", title: "Sex", width: "80px", attributes: { 'class': "text-center" } },
                { field: "score", title: "Score", width: "80px", attributes: { 'class': "text-center" } }
            ];
        } else {
            columns = [
                { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                { field: "id", title: "Id", width: "0px", attributes: { 'class': "text-nowrap" } },
                { field: "score", title: "Score", width: "80px", attributes: { 'class': "text-center" } }
            ];
        }

        $(`#${element}`)
            .kendoGrid({
                columns: columns,
                sortable: {
                    mode: "single",
                    allowUnsort: true
                },
                toolbar: [{ template: kendo.template(`Group Name: <input id='${groupNameElementId}' style='margin: 0 5px 0 5px' />`) }],
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
            this.createLabel(headerRow.insertCell(), "", 400);
            this.createLabel(headerRow.insertCell(), "Count", 100, "center");
            this.createLabel(headerRow.insertCell(), "Average", 100, "center");

            const body = table.createTBody();

            let schoolRow = body.insertRow();
            this.createLabel(schoolRow.insertCell(), "Composite Score Avg.", 400);
            this.createNumberLabel(schoolRow.insertCell(), classItem.count, 100);
            this.createLabel(schoolRow.insertCell(), classItem.average.toFixed(0), 100);
            schoolRow = body.insertRow();
            this.createLabel(schoolRow.insertCell(), "Girls Comp. Score Avg.", 400);
            this.createNumberLabel(schoolRow.insertCell(), classItem.girlsCount, 100);
            this.createLabel(schoolRow.insertCell(), classItem.girlsAverage.toFixed(0), 100);
            schoolRow = body.insertRow();
            this.createLabel(schoolRow.insertCell(), "Boys Comp. Score Avg.", 400);
            this.createNumberLabel(schoolRow.insertCell(), classItem.boysCount, 100);
            this.createLabel(schoolRow.insertCell(), classItem.boysAverage.toFixed(0), 100);

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

    createNumericTextBox = (
        element: string,
        defaultValue = 0,
        min = 0,
        max = 10,
        format = this.integerFormat,
        callbackChangeEvent: (count: number, inputControl: kendo.ui.NumericTextBox) => any = null) : kendo.ui.NumericTextBox => {
        $(`#${element}`)
            .kendoNumericTextBox({
                options: {},
                change: (e) => {
                    var inputControl = e.sender as kendo.ui.NumericTextBox;
                    if (callbackChangeEvent != null) {
                        callbackChangeEvent(inputControl.value(), inputControl);
                    }
                }
                //spin: (e) => {
                //    var inputControl = e.sender as kendo.ui.NumericTextBox;
                //    if (callbackChangeEvent != null) {
                //        callbackChangeEvent(inputControl.value(), inputControl);
                //    }
                //}
            } as kendo.ui.NumericTextBoxOptions);

        const numericTextBox = $(`#${element}`).data("kendoNumericTextBox");
        numericTextBox.options.format = format;
        numericTextBox.value(defaultValue);
        numericTextBox.max(max);
        numericTextBox.min(min);
        
        return numericTextBox;
    }

    createUuid = () => {
        const s = [];
        const hexDigits = "0123456789abcdef";
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        const uuid = s.join("");
        return uuid;
    }
}