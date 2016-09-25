class BandTableControl {
    constructor(studentCountChangedCallback: () => any) {
        this.studentCountChangedCallback = studentCountChangedCallback;
    }

    private tableElementName = "band-definition-table";
    private bandSet: BandSet;
    private tableContainerElementName: string;
    private table: HTMLTableElement;
    private headerTable: HTMLTableSectionElement;
    private bodyTable: HTMLTableSectionElement;
    private columnHeaderRow: HTMLTableRowElement;
    private bandRow: HTMLTableRowElement;
    private classRows: Array<HTMLTableRowElement> = [];
    private bandCount: number;

    private kendoHelper = new KendoHelper();

    private studentBandControls: Array<StudentBandInputContainer> = [];
    private classBandControls: Array<ClassBandInputContainer> = [];
    private studentClassControls: Array<StudentClassInputContainer> = [];

    private studentCountChangedCallback: () => any;

    init(elementName: string, bandSet: BandSet) {
        this.tableContainerElementName = elementName;
        this.bandSet = bandSet;
        const bands = this.bandSet.bands;

        // Create the table
        $(`#${this.tableContainerElementName}`).html(`<table id='${this.tableElementName}'></table>`);
        this.table = document.getElementById(this.tableElementName) as HTMLTableElement;
        this.headerTable = this.table.createTHead();
        this.bodyTable = this.table.createTBody();
        this.columnHeaderRow = this.headerTable.insertRow();
        this.bandRow = this.bodyTable.insertRow();
        this.classRows.splice(0, this.classRows.length);

        this.kendoHelper.createLabel(this.columnHeaderRow.insertCell(), "");
        this.kendoHelper.createLabel(this.bandRow.insertCell(), "# Classes");

        this.bandCount = bandSet.bands.length;
        for (let band of bandSet.bands) {
            this.kendoHelper.createLabel(this.columnHeaderRow.insertCell(),
                band.bandName === null || band.bandName === "" ? `Band ${band.bandNo}` : band.bandName);
            this.addClassBandCell(band, band.bandNo, band.classCount);
        }

        const maxClassNo = Enumerable.From(bands).Max(x => x.classCount);
        for (let classNo = 1; classNo <= maxClassNo; classNo++) {
            this.addStudentClassRow(classNo, bands, true);
        }
    }


    // Create band count cell
    addClassBandCell = (band: BandDefinition, bandNo: number, classCount: number) => {
        const bandCell = this.bandRow.insertCell();
        this.classBandControls.push(
            new ClassBandInputContainer(bandCell, band, this.classCountInBandChangedCallback, false));

    }
    // Create student count cell for a class in a band
    addStudentClassRow = (classNo: number, bands: Array<BandDefinition>, showClass = false) => {
        var classRow = this.bodyTable.insertRow();
        this.classRows.push(classRow);

        this.kendoHelper.createLabel(classRow.insertCell(), `Class ${classNo}`);
        // Create student in class count cell for all the classes in a band
        for (let band of bands) {
            const classCell = classRow.insertCell();
            const classItem = classNo <= band.classes.length ? band.classes[classNo - 1] : new ClassDefinition(band, classNo, 0, true);
            this.studentClassControls.push(
                new StudentClassInputContainer(classCell, classItem, this.studentCountInClassChangedCallback, false));
        }
    }

    // This function is called when the number of students in a band is changed
    private studentCountInBandChangedCallback = (bandItem: BandDefinition,
        newValue: number,
        oldValue: number,
        inputControl: kendo.ui.NumericTextBox) => {

        bandItem.studentCount = Enumerable.From(bandItem.classes).Sum(b => b.count);

        const studentCountChangedCallback = this.studentCountChangedCallback;
        if (studentCountChangedCallback != null) {
            studentCountChangedCallback();
        }
    }

    // This function is called when the number of students in a band is changed
    private classCountInBandChangedCallback = (bandItem: BandDefinition,
        newValue: number,
        oldValue: number,
        inputControl: kendo.ui.NumericTextBox) => {
        console.log("#Classes Band " + bandItem.bandNo, newValue, bandItem.classCount);

        bandItem.setClassCount(newValue);

        this.init(this.tableContainerElementName, this.bandSet);
      
        const studentCountChangedCallback = this.studentCountChangedCallback;
        if (studentCountChangedCallback != null) {
            studentCountChangedCallback();
        }
    }

    // This function is called when the number of students in class is changed
    private studentCountInClassChangedCallback = (classItem: ClassDefinition,
        newValue: number,
        oldValue: number,
        inputControl: kendo.ui.NumericTextBox) => {
        console.log("Class " + classItem.index, newValue, classItem.count);

        const studentCountChangedCallback = this.studentCountChangedCallback;
        if (studentCountChangedCallback != null) {
            studentCountChangedCallback();
        }
    }
}
