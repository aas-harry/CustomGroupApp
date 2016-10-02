﻿// Input container to enter number of students in a band
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
