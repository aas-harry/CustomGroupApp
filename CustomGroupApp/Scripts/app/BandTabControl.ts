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
    private commonHeaderRow: HTMLTableRowElement;
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
        const hasCommonBand = Enumerable.From(bands).Any(x => x.commonBand);

        // Create the table
        $(`#${this.tableContainerElementName}`).html(`<table id='${this.tableElementName}'></table>`);
        this.table = document.getElementById(this.tableElementName) as HTMLTableElement;
        this.headerTable = this.table.createTHead();
        this.bodyTable = this.table.createTBody();
        this.columnHeaderRow = this.headerTable.insertRow();
        if (hasCommonBand && bands.length > 1) {
            this.commonHeaderRow = this.headerTable.insertRow();
        }
        this.bandRow = this.bodyTable.insertRow();

        this.kendoHelper.createLabel(this.columnHeaderRow.insertCell(), "");
        if (hasCommonBand && bands.length > 1) {
            this.kendoHelper.createLabel(this.commonHeaderRow.insertCell(), "");
        }
        this.kendoHelper.createLabel(this.bandRow.insertCell(), "# Classes");

        this.bandCount = bandSet.bands.length;
        for (let band of bandSet.bands) {
            this.kendoHelper.createLabel(this.columnHeaderRow.insertCell(),
                band.bandName === null || band.bandName === "" ? `Band ${band.bandNo}` : band.bandName);
           this.addSplitCommonBand(hasCommonBand, band);
            this.addClassBandCell(band, band.bandNo, band.classCount, hasCommonBand);
        }

        this.updateStudentClassRows();
      
    }

    updateStudentClassRows = () => {

        while (this.bodyTable.rows.length > 1) {
            this.bodyTable.deleteRow(1);
        }

        for (let ctrl of this.studentClassControls) {
            ctrl.dispose();
        }
        this.studentClassControls = [];

        const maxClassNo = Enumerable.From(this.bandSet.bands).Max(x => x.classCount);
        this.classRows.splice(0, this.classRows.length);
        for (let classNo = 1; classNo <= maxClassNo; classNo++) {
            this.addStudentClassRow(classNo, this.bandSet.bands, true);
        }
    }

    addSplitCommonBand = (hasCommonBand, band: BandDefinition) => {
        if (! hasCommonBand || this.bandSet.bands.length <= 1) {
            return;
        }

        if (band.commonBand) {
            this.kendoHelper.createButtonWithId(this.commonHeaderRow.insertCell(),
                "Add to others",
                band.uid,
                this.addBandToOthers, 75, "left", 5, 0, 5, 0);
        } else {
            this.kendoHelper.createLabel(this.commonHeaderRow.insertCell(), "");
        }
    }
    addBandToOthers = (uid: string) => {
        const notCommonBands = Enumerable.From(this.bandSet.bands).Where(x => !x.commonBand).ToArray();
        const band = Enumerable.From(this.bandSet.bands).FirstOrDefault(null, x => x.uid === uid);
        if (!band) {
            return;
        }

     
        band.setClassCount(notCommonBands.length);
        band.prepare("", band.students, [], []);

        let cnt = 0;
        for (let otherBand of notCommonBands) {
            for (let s of band.classes[cnt].students) {
                otherBand.students.push(s);
                otherBand.classes[0].count +=1 ;
            }
            otherBand.studentCount = otherBand.students.length;
            cnt++;
        }
        band.students = [];
        band.studentCount = 0;

        this.bandSet.bands = Enumerable.From(this.bandSet.bands).Where(x => x.uid !== uid).ToArray();

        // fix the band no
        for (let bandItem of this.bandSet.bands) {
            bandItem.bandNo -= 1;
        }
        this.init(this.tableContainerElementName, this.bandSet);
    }

    // Create band count cell
    addClassBandCell = (band: BandDefinition, bandNo: number, classCount: number, hasCommonBand = false) => {
        let bandCell = this.bandRow.insertCell();
        this.classBandControls.push(
            new ClassBandInputContainer(bandCell, band, this.classCountInBandChangedCallback, false));

    }
    // Create student count cell for a class in a band
    addStudentClassRow = (classNo: number, bands: Array<BandDefinition>, showClass = false) => {
        var classRow = this.bodyTable.insertRow();
        this.classRows.push(classRow);
        
        this.kendoHelper.createLabel(classRow.insertCell(), `Class ${classNo}`, 150, "left", 5, 5, 0, 0);
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

        this.updateStudentClassRows();
      
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
