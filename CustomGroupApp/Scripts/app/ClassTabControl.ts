class ClassTableControl {
    constructor(studentCountChangedCallback: () => any) {
        this.studentCountChangedCallback = studentCountChangedCallback;
    }
    private tableElementName = "class-definition-table";
    private bandSet: BandSet;
    private tableContainerElementName: string;
    private table: HTMLTableElement;
    private bodyTable: HTMLTableSectionElement;
    private kendoHelper = new KendoHelper();
    private maxColumns = 4;
    private studentCountChangedCallback;
    private studentClassControls = new Array <StudentClassInputContainer>();

    init(elementName: string, bandSet: BandSet) {
        this.tableContainerElementName = elementName;
        this.bandSet = bandSet;

        // Create the table
        $(`#${this.tableContainerElementName}`).html(`<table id='${this.tableElementName}'></table>`);
        this.table = document.getElementById(this.tableElementName) as HTMLTableElement;
        this.bodyTable = this.table.createTBody();

        this.updateStudentClassRows();
    }

    updateStudentClassRows = () => {
        while (this.bodyTable.rows.length > 0) {
            this.bodyTable.deleteRow(0);
        }
        for (let ctrl of this.studentClassControls) {
            ctrl.dispose();
        }
        this.studentClassControls = [];

        let classRow = this.bodyTable.insertRow();
        let cnt = 0;
        for (let classItem of this.bandSet.bands[0].classes) {
            if (cnt === this.maxColumns) {
                cnt = 0;
                classRow = this.bodyTable.insertRow();
            }
            cnt++;

            this.studentClassControls.push(new StudentClassInputContainer(classRow.insertCell(),
                classItem,
                this.studentCountInClassChangedCallback,
                true));

        }
    }

    // This function is called when the number of students in class is changed
    private studentCountInClassChangedCallback = (classItem: ClassDefinition,
        newValue: number,
        oldValue: number,
        inputControl: kendo.ui.NumericTextBox) => {

        const studentCountChangedCallback = this.studentCountChangedCallback;
        if (studentCountChangedCallback != null) {
            studentCountChangedCallback();
        }
    }
}