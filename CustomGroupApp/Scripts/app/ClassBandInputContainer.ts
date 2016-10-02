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