class BandTableControl {
    private tableElementName = "band-definition-table";
    private bandSet: BandSet;
    private tableContainerElementName: string;
    private table: HTMLTableElement;
    private headerTable: HTMLTableSectionElement;
    private bodyTable: HTMLTableSectionElement;
    private columnHeaderRow: HTMLTableRowElement;
    private studentsRow: HTMLTableRowElement;
    private bandRow: HTMLTableRowElement;
    private classRows: Array<HTMLTableRowElement> = [];
    private bandCount: number;

    private kendoHelper = new KendoHelper();

    private studentBandControls: Array<StudentBandInputContainer> = [];
    private classBandControls: Array<ClassBandInputContainer> = [];
    private studentClassControls: Array<StudentClassInputContainer> = [];

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
        this.studentsRow = this.bodyTable.insertRow();
        this.bandRow = this.bodyTable.insertRow();

        this.classRows.splice(0, this.classRows.length);

        this.kendoHelper.createLabel(this.columnHeaderRow.insertCell(), "");
        this.kendoHelper.createLabel(this.studentsRow.insertCell(), "# Students");
        this.kendoHelper.createLabel(this.bandRow.insertCell(), "# Classes");

        this.bandCount = bandSet.bands.length;
        for (let band of bandSet.bands) {
            this.kendoHelper.createLabel(this.columnHeaderRow.insertCell(),
                band.bandName === null || band.bandName === "" ? `Band ${band.bandNo}` : band.bandName);
            this.addStudentBandCell(band);
            this.addClassBandCell(band, band.bandNo, band.classCount);
        }

        const maxClassNo = Enumerable.From(bands).Max(x => x.classCount);
        for (let classNo = 1; classNo <= maxClassNo; classNo++) {
            this.addStudentClassRow(classNo, bands, true);
        }
    }

    // Create student count cell for a band
    private addStudentBandCell = (band: BandDefinition) => {
        const studentCell = this.studentsRow.insertCell();
        this.studentBandControls.push(
            new StudentBandInputContainer(studentCell, band, this.studentCountInBandChangedCallback, false));
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
        console.log("#Student Band " + bandItem.bandNo, newValue, bandItem.studentCount);

    }

    // This function is called when the number of students in a band is changed
    private classCountInBandChangedCallback = (bandItem: BandDefinition,
        newValue: number,
        oldValue: number,
        inputControl: kendo.ui.NumericTextBox) => {
        console.log("#Classes Band " + bandItem.bandNo, newValue, bandItem.classCount);

        bandItem.setClassCount(newValue);

        this.init(this.tableContainerElementName, this.bandSet);
        //for (let classItem of bandItem.classes) {
        //    if (classItem.index <= this.classRows.length) {
        //        const container = Enumerable.From(this.studentClassControls)
        //            .FirstOrDefault(null, x => x.classItem.parent.bandNo === classItem.parent.bandNo
        //                && x.classItem.index === classItem.index);
        //        if (container) {
        //            container.classItem = classItem;
        //            container.showInput(classItem.count);
        //        }
        //        continue;
        //    }
        //    this.addStudentClassRow(classItem.index, bandItem.parent.bands, true);
        //}

        //Enumerable.From(this.studentClassControls)
        //    .Where(x => x.classItem.parent.bandNo === bandItem.bandNo && x.classItem.index > bandItem.classes.length)
        //    .ForEach(x => x.hideInput());


    }

    // This function is called when the number of students in class is changed
    private studentCountInClassChangedCallback = (classItem: ClassDefinition,
        newValue: number,
        oldValue: number,
        inputControl: kendo.ui.NumericTextBox) => {
        console.log("Class " + classItem.index, newValue, classItem.count);

    }
}
