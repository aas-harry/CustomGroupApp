// Input container to enter number of students in a band
class StudentClassInputContainer {
    constructor(cell: HTMLTableCellElement,
        public classItem: ClassDefinition,
        callback: (classItem: ClassDefinition, newValue: number, oldValue: number, inputControl: kendo.ui.NumericTextBox) => any,
        addLabel = false) {

        this.cell = cell;
        this.cellContainer = document.createElement("div");
        this.cellContainer.setAttribute("style", "margin: 5px 5px 0 0");
        this.cell.appendChild(this.cellContainer);
        this.classItem = classItem;
        this.callbackAction = callback;
        this.addLabel = addLabel;

        this.init();
    }

    private cellContainer: HTMLDivElement;
    private cell: HTMLTableCellElement;
    private callbackAction: (classItem: ClassDefinition, newValue: number, oldValue: number, inputControl: kendo.ui.NumericTextBox) => any;
    private addLabel: boolean;
    private inputControl: kendo.ui.NumericTextBox;
    private kendoHelper = new KendoHelper();

    dispose = () => {
        this.kendoHelper = null;
        this.callbackAction = null;

        this.inputControl.destroy();
        this.inputControl = null;
    }

    private init = () => {
        if (this.addLabel) {
            const container = document.createElement("div") as HTMLDivElement;
            container.setAttribute("style", "margin: 5px 5px 0 0");

            const label = document.createElement("span");
            label.textContent = `Class ${this.classItem.index}`;

            container.appendChild(label);
            this.cellContainer.appendChild(container);
        }

        if (this.classItem.parent.parent.bandType === BandType.PreallocatedClass) {
            const container = document.createElement("div") as HTMLDivElement;
            container.setAttribute("style", "margin: 5px 5px 0 0");

            const label = document.createElement("span");
            label.textContent = `Pre-alloc: ${this.classItem.preallocatedStudentCount}`;

            container.appendChild(label);
            this.cellContainer.appendChild(container);
        }

        let container = document.createElement("div") as HTMLDivElement;
        container.setAttribute("style", "margin: 5px 5px 0 0");

        var element = document.createElement("input") as HTMLInputElement;
        element.type = "text";
        element.setAttribute("style", "width: 100px; margin-right: 5px 5px 5px 20px");
        const elementId = this.classItem ? this.classItem.uid : createUuid();
        element.id = `studentclass-${elementId}`;

        container.appendChild(element);
        this.cellContainer.appendChild(container);

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
