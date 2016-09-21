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
        classItem: ClassDefinition
    ) => {
        var element = document.createElement("div") as HTMLDivElement;
        element.setAttribute("style", "width: 200px");
        element.id = `class${classItem.parent.bandNo}-${classItem.index}`;
        cell.appendChild(element);

        return this.createStudentClassGrid(element.id, classItem);;
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
        classItem: ClassDefinition) : kendo.ui.Grid=> {
        var grid = this.createGrid(element);

        $(`#${element}`).kendoDraggable({
            filter: "tr",
            hint(e) {
                var item = $('<div class="k-grid k-widget" style="background-color: DarkOrange; color: black;"><table><tbody><tr>' + e.html() + '</tr></tbody></table></div>');
                return item;
            },
            group: "classGroup"
        });

        
        grid.table.kendoDropTarget({
            drop(e) {
                debugger;
                var foo = e.draggable.currentTarget.data("uid");

                //var dataItem = dataSource1.getByUid(e.draggable.currentTarget.data("uid"));
                //dataSource1.remove(dataItem);
                //dataSource2.add(dataItem);

            },
            group: "classGroup"
        });
        var students = [];

        Enumerable.From(classItem.students).ForEach(x => students.push({'name': x.name}));
        grid.dataSource.data(students);
        grid.refresh();
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

    createGrid = (element: string): kendo.ui.Grid => {
        $(`#${element}`).kendoGrid({
            columns: [
                { field: "name" }
            ],
            dataSource: [
                { name: "Jane Doe", age: 30 },
                { name: "John Doe", age: 33 }
            ]
        });
        var grid = $(`#${element}`).data("kendoGrid");
        
        return grid;
    }

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