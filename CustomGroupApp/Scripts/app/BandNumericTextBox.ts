enum BandNumericTextBoxUsage {
    BandSize,
    ClassSize,
    StudentSize
}

class BandNumericTextBox {
    private hidden = false;
    oldValue: number = null;

    get value(): number {
        return this.inputControl.value();
    }

    setValue = (newValue: number) => {
        this.oldValue = this.value;
        this.inputControl.value(newValue);
        this.inputControl.enable(true);
    }

    hideInput = () => {
        this.hidden = true;
        this.inputControl.value(this.inputControl.min());
        this.inputControl.enable(false);
    }

    showInput = () => {
        this.hidden = false;
    }
    constructor(
        public parent: HTMLTableCellElement,
        public studentCount: number,
        public inputControl: kendo.ui.NumericTextBox,
        public bandNo: number,
        public classNo: number,
        public usage: BandNumericTextBoxUsage,
        hidden = false) {
        this.oldValue = inputControl.value();

        if (hidden) {
            this.hideInput();
        } else {
            this.showInput();
        }
        if (usage === BandNumericTextBoxUsage.ClassSize)
            console.log("New ", bandNo, classNo, hidden);
    }
}

class BandTableControl {
    private bands: Array<BandDefinition>;

    private studentCountInBandControls : Array<kendo.ui.NumericTextBox
    init(elementName: string, bands: Array<BandDefinition>) {
        this.bands = bands;
    }
}

class BandNumericTextBoxCollection {
    private groupingHelper = new GroupingHelper();
    private kendoHelper = new KendoHelper();
    private me = this;
    items: Array<BandNumericTextBox> = [];
    table: HTMLTableElement;
    header: HTMLTableSectionElement;
    columnHeaderRow: HTMLTableRowElement;
    studentsRow: HTMLTableRowElement;
    bandRow: HTMLTableRowElement;
    classRows: Array<HTMLTableRowElement> = [];
    bandCount: number;

    private bands : Array<BandDefinition>;
    get classCount(): number {
        return this.classRows.length;
    }

    initTable(elementName: string, bands: Array<BandDefinition>) {
        this.bands = bands;
        this.clear();

        $("#classes-settings-container").html("<table id='band-definition-table'></table>");
        this.table = document.getElementById("band-definition-table") as HTMLTableElement;
        this.header = this.table.createTHead();
        this.classRows.splice(0, this.classRows.length);
        this.columnHeaderRow = this.header.insertRow();
        this.studentsRow = this.header.insertRow();
        this.bandRow = this.header.insertRow();

        this.kendoHelper.createLabel(this.columnHeaderRow.insertCell(), "");
        this.kendoHelper.createLabel(this.studentsRow.insertCell(), "# Students");
        this.kendoHelper.createLabel(this.bandRow.insertCell(), "# Classes");

        this.bandCount = bands.length;
        for (let band of bands) {
            this.createBandColumnInTable(band);
        }

        var maxClassNo = Enumerable.From(bands).Max(x => x.classCount);
        for (let classNo = 1; classNo <= maxClassNo; classNo++ ) {
            this.createStudentCountInClassRow(classNo, bands, true);
        }
        for (let band of bands) {
            if (band.classes.length < maxClassNo) {
                this.disableUnusedClassCell(band.classes.length, maxClassNo, band.bandNo);
            }
        }
    }

    // the studentCount pass to this paameter can be from two different sources:
    // 1. From band definition class or
    // 2. Zero if the class no is not in the band classes definition. 
    //    In the UI this control will be disabled if studentCount == 0 
    add = (
        parent: HTMLTableCellElement,
        band: BandDefinition,
        studentCount: number,
        inputControl: kendo.ui.NumericTextBox,
        bandNo: number,
        classNo: number,
        usage: BandNumericTextBoxUsage,
        hidden = false) => {
        this.items.push(new BandNumericTextBox(parent, studentCount, inputControl, bandNo, classNo, usage, hidden));
    }
    clear = () => {
        this.items.splice(0, this.items.length);
    }

    updateClassSizes = (classItem: BandNumericTextBox) => {
        //classItem.setValue(studentCount);
    }

    updateStudentSize = (studentItem: BandNumericTextBox) => {
        studentItem.oldValue = studentItem.value;
        studentItem.studentCount = studentItem.value;

        let bandItem = Enumerable.From(this.items)
            .First(x => x.usage === BandNumericTextBoxUsage.BandSize &&
                x.bandNo === studentItem.bandNo);
        this.updateClassSizeInBand(bandItem, studentItem.value);
    }


    // This event is called when the number of classes in a band is changed
    updateClassSizeInBand = (bandItem: BandNumericTextBox, studentCount: number) => {
        const bandNo = bandItem.bandNo;
        bandItem.oldValue = bandItem.value;

        var tmpClases = this.groupingHelper.calculateClassesSize(studentCount, bandItem.value);
        let classCount = bandItem.value;
        for (let i = 0; i < classCount; i++) {
            const classNo = i + 1;
            const studentCountInClass = tmpClases[i];

            // Class row has not been created, add it now
            if (classNo > this.classRows.length) {
                let tmpBands = new Array<BandDefinition>();
                for (let j = 1; j <= this.bandCount; j++) {
                    tmpBands.push(new BandDefinition(null,
                        j,
                        `band${j}`,
                        j === bandNo ? studentCountInClass : 0,
                        classCount));
                }
                this.createStudentCountInClassRow(classNo, tmpBands);
            }

            // check if class cell has been created
            const classCell = Enumerable.From(this.items)
                .FirstOrDefault(null, x => x.usage === BandNumericTextBoxUsage.ClassSize && x.bandNo === bandNo
                    && x.classNo === classNo);
            if (classCell != null) {
                classCell.setValue(tmpClases[i]);
                classCell.showInput();
            }
        }

        // hide unused class in the selected band
        this.disableUnusedClassCell(classCount, this.classRows.length, bandNo);
    }

    private disableUnusedClassCell(fromClassNo: number, toClassNo: number, bandNo: number) {
        for (let i = fromClassNo + 1; i <= toClassNo; i++) {
            const classNo = i;
            const classCell = Enumerable.From(this.items)
                .FirstOrDefault(null, x => x.usage === BandNumericTextBoxUsage.ClassSize && x.bandNo === bandNo
                    && x.classNo === classNo);

            if (classCell != null) {
                classCell.hideInput();
            }
        }
    }

    createBandColumnInTable = (band: BandDefinition) => {
        this.kendoHelper.createLabel(this.columnHeaderRow.insertCell(),
            band.bandName === null || band.bandName === "" ? "Band " + band.bandNo : band.bandName);
        this.createStudentCountInBandCell(band);
        this.createBandCountCell(band, band.bandNo, band.classCount);

    }

    // Create student count cell for a band
    createStudentCountInBandCell = (band: BandDefinition) => {
        const bandNo = band.bandNo;
        const studentCount = band.studentCount;
        const studentCell = this.studentsRow.insertCell();
        this.add(studentCell, band, studentCount,
            this.kendoHelper.createStudentsInputContainer(studentCell, studentCount, 1, bandNo, this.oStudentSettingsChange),
            bandNo,
            1,
            BandNumericTextBoxUsage.StudentSize);
    }

    // Create student count cell for a class in a band
    createStudentCountInClassRow = (classNo: number, bands: Array<BandDefinition>, showClass = false) => {
        var classRow = this.header.insertRow();
        this.kendoHelper.createLabel(classRow.insertCell(), `Class ${classNo}`);
        this.classRows.push(classRow);
        // Create student in class count cell for all the classes in a band
        for (let band of bands) {
            const bandNo = band.bandNo;
            const classCell = classRow.insertCell();
            const studentCount = classNo <= band.classes.length ? band.classes[classNo - 1].count : 0;
            this.add(classCell,band, studentCount,
                this.kendoHelper.createClassInputContainer(classCell, studentCount, classNo, bandNo,
                    this.onClassSettingsChange()),
                bandNo,
                classNo,
                BandNumericTextBoxUsage.ClassSize, !showClass);
        }
    }

    // Create band count cell
    createBandCountCell = (band: BandDefinition, bandNo: number, classCount: number) => {
        const bandCell = this.bandRow.insertCell();
        this.add(bandCell, classCount,
            this.kendoHelper.createBandInputContainer(bandCell, bandNo, classCount, this.onBandSettingsChange),
            bandNo,
            0,
            BandNumericTextBoxUsage.BandSize);
    }

    // This function is called when the number of students in a band is changed
    oStudentSettingsChange = () => {
        for (let studentItem of Enumerable.From(this.items)
            .Where(x => x.usage === BandNumericTextBoxUsage.StudentSize && x.oldValue !== x.value)
            .Select(x => x).ToArray()) {
            this.updateStudentSize(studentItem);
        }
    }

    // This function is called when the number of classes in a band is changed
    onBandSettingsChange = () => {
        for (let bandItem of Enumerable.From(this.items)
            .Where(x => x.usage === BandNumericTextBoxUsage.BandSize && x.oldValue !== x.value)
            .Select(x => x).ToArray()) {

            const studentItem = Enumerable.From(this.items)
                .FirstOrDefault(null, x => x.usage === BandNumericTextBoxUsage.StudentSize &&
                    x.bandNo === bandItem.bandNo);

            this.updateClassSizeInBand(bandItem, studentItem.studentCount);
        }
    }

    // This function is called when the number of students in a class is changed
    onClassSettingsChange = () => {
        for (let classItem of Enumerable.From(this.items)
            .Where(x => x.usage === BandNumericTextBoxUsage.ClassSize && x.oldValue !== x.value)
            .Select(x => x).ToArray()) {
            this.updateClassSizes(classItem);
        }
    }

    private convertToBands = (studentCounts: Array<number>): Array<BandDefinition> => {
        var classes = new Array<BandDefinition>();
        for (let i = 0; i < studentCounts.length; i++) {
            const bandNo = i + 1;
            classes.push(new BandDefinition(null, bandNo, "Band " + bandNo, studentCounts[i], 1));
        }
        return classes;
    };
}