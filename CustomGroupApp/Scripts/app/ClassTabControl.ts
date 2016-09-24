class ClassTableControl {
    private tableElementName = "class-definition-table";
    private bandSet: BandSet;
    private tableContainerElementName: string;
    private table: HTMLTableElement;
    private bodyTable: HTMLTableSectionElement;
    private kendoHelper = new KendoHelper();
    private maxColumns = 4;


    init(elementName: string, bandSet: BandSet) {
        this.tableContainerElementName = elementName;
        this.bandSet = bandSet;

        // Create the table
        $(`#${this.tableContainerElementName}`).html(`<table id='${this.tableElementName}'></table>`);
        this.table = document.getElementById(this.tableElementName) as HTMLTableElement;
        this.bodyTable = this.table.createTBody();
        let classRow = this.bodyTable.insertRow();

        let cnt = 0;
        for (let classItem of bandSet.bands[0].classes) {
            if (cnt === this.maxColumns) {
                cnt = 0;
                classRow = this.bodyTable.insertRow();
            }
            cnt++;
            const ctrl =new StudentClassInputContainer(classRow.insertCell(),
                classItem,
                this.studentCountInClassChangedCallback,
                true);
        }
    }

    // This function is called when the number of students in class is changed
    private studentCountInClassChangedCallback = (classItem: ClassDefinition,
        newValue: number,
        oldValue: number,
        inputControl: kendo.ui.NumericTextBox) => {
        console.log("Class " + classItem.index, newValue, classItem.count);
    }
}