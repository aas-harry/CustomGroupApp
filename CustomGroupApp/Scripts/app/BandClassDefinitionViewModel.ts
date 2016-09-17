enum BandNUmericTextBoxUsage {
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
        //this.inputControl.element.hide();
    }

    showInput =() => {
        this.hidden = false;
        //this.inputControl.element.show();
    }
    constructor(
        public parent: HTMLTableCellElement,
        public studentCount: number,
        public inputControl: kendo.ui.NumericTextBox,
        public bandNo: number,
        public classNo: number,
        public usage: BandNUmericTextBoxUsage,
        hidden= false) {
        this.oldValue = inputControl.value();

        if (hidden) {
            this.hideInput();
        } else {
            this.showInput();
        }
        if (usage === BandNUmericTextBoxUsage.ClassSize)
            console.log("New ", bandNo, classNo, hidden);
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

    get classCount(): number {
        return this.classRows.length;
    }

    initTable(elementName: string, bands: Array<BandDefinition>) {
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
            this.createBandColumnInTable(band.bandNo, band.studentCount);
        }
        this.createStudentCountInClassRow(1, bands, true);
    }

    add = (
        parent: HTMLTableCellElement,
        studentCount: number,
        inputControl: kendo.ui.NumericTextBox,
        bandNo: number,
        classNo: number,
        usage: BandNUmericTextBoxUsage,
        hidden = false) => {
        this.items.push(new BandNumericTextBox(parent, studentCount, inputControl, bandNo, classNo, usage, hidden));
    }
    clear = () => {
        this.items.splice(0, this.items.length);
    }

    updateClassSizes = (classItem: BandNumericTextBox) =>{
        //classItem.setValue(studentCount);
    }

    updateStudentSize = (studentItem: BandNumericTextBox) => {
        studentItem.oldValue = studentItem.value;
        studentItem.studentCount = studentItem.value;

        let bandItem = Enumerable.From(this.items)
            .First(x => x.usage === BandNUmericTextBoxUsage.BandSize &&
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
                .FirstOrDefault(null, x => x.usage === BandNUmericTextBoxUsage.ClassSize && x.bandNo === bandNo
                    && x.classNo === classNo);
            if (classCell != null) {
                classCell.setValue(tmpClases[i]);
                classCell.showInput();
            }
        }

        // hide unused class in the selected band
        for (let i = classCount + 1; i <= this.classRows.length; i++) {
            const classNo = i;
            const classCell = Enumerable.From(this.items)
                .FirstOrDefault(null, x => x.usage === BandNUmericTextBoxUsage.ClassSize && x.bandNo === bandNo
                    && x.classNo === classNo);

            if (classCell != null) {
                classCell.hideInput();
            }
        }
    }

    createBandColumnInTable = (bandNo: number, studentCount: number) => {
        this.kendoHelper.createLabel(this.columnHeaderRow.insertCell(), "Band " + bandNo);

        this.createStudentCountInBandCell(bandNo, studentCount);
        this.createBandCountCell(bandNo, studentCount);

    }

    // Create student count cell for a band
    createStudentCountInBandCell = (bandNo: number, studentCount: number) => {
        const studentCell = this.studentsRow.insertCell();
        this.add(studentCell, studentCount,
            this.kendoHelper.createStudentsInputContainer(studentCell, studentCount, 1, bandNo, this.oStudentSettingsChange),
            bandNo,
            1,
            BandNUmericTextBoxUsage.StudentSize);
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
            this.add(classCell, band.studentCount,
                this.kendoHelper.createClassInputContainer(classCell, band.studentCount, classNo, bandNo,
                    this.onClassSettingsChange()),
                bandNo,
                classNo,
                BandNUmericTextBoxUsage.ClassSize, ! showClass);
        }
    }

    // Create band count cell
    createBandCountCell = (bandNo: number, studentCount: number) => {
        const bandCell = this.bandRow.insertCell();
        this.add(bandCell, studentCount,
            this.kendoHelper.createBandInputContainer(bandCell, bandNo, this.onBandSettingsChange),
            bandNo,
            1,
            BandNUmericTextBoxUsage.BandSize);
    }

    // This function is called when the number of students in a band is changed
    oStudentSettingsChange = () => {
        for (let studentItem of Enumerable.From(this.items)
            .Where(x => x.usage === BandNUmericTextBoxUsage.StudentSize && x.oldValue !== x.value)
            .Select(x => x).ToArray()) {
            this.updateStudentSize(studentItem);
        }
    }
    
    // This function is called when the number of classes in a band is changed
    onBandSettingsChange = () => {
        for (let bandItem of Enumerable.From(this.items)
            .Where(x => x.usage === BandNUmericTextBoxUsage.BandSize && x.oldValue !== x.value)
            .Select(x => x).ToArray()) {

            const studentItem = Enumerable.From(this.items)
                .FirstOrDefault(null, x => x.usage === BandNUmericTextBoxUsage.StudentSize &&
                    x.bandNo === bandItem.bandNo);

            this.updateClassSizeInBand(bandItem, studentItem.studentCount);
        }
    }

    // This function is called when the number of students in a class is changed
    onClassSettingsChange = () => {
        for (let classItem of Enumerable.From(this.items)
            .Where(x => x.usage === BandNUmericTextBoxUsage.ClassSize && x.oldValue !== x.value)
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

class TopMiddleLowest extends BandClassDefinitionViewModel {
    constructor(public studentCount: number = 0) {
        super(studentCount, 3);
    }
}

class BandClassDefinitionViewModel extends kendo.data.ObservableObject {
    classes: kendo.data.ObservableArray = new kendo.data.ObservableArray(
        [
            { classNo: 1, studentCount: 1 }
        ]);
    constructor(public studentCount: number = 0, bandCount = 1) {
        super();

        this.bandCount = 1;
        this.onBandCountChange();
    }

    bandCount = 1;
    classCount = 1;
    
    getClasses = (): Array<number> => {
        var classes = new Array<number>();
        this.classes.forEach((val: any) => {
            var classCnt = $(`#class${val.classNo}`).data("kendoNumericTextBox");
            classes.push(classCnt.value());
        });
        return classes;
    }

    private bandSet = new BandSet(null, "Custom", this.studentCount, 1);
    private groupingHelper = new GroupingHelper();
    private kendoHelper = new KendoHelper();
    private bandNumerixTextBoxes = new BandNumericTextBoxCollection();

    private table: HTMLTableElement;
    private header: HTMLTableSectionElement;
    private columnHeaderRow: HTMLTableRowElement;
    private studentsRow: HTMLTableRowElement;
    private bandRow: HTMLTableRowElement;
    private classRows: Array<HTMLTableRowElement> = [];

    onStudentCountChanged = () => {
    };

    onBandCountChange = () => {
        this.bandSet.createBands("custom", this.studentCount, this.bandCount);
        this.bandNumerixTextBoxes.initTable("#classes-settings-container", this.bandSet.bands);
    }

    private createNumberInputField = (elementId: string): HTMLElement => {
        var element = document.createElement("input") as HTMLInputElement;
        element.type = "text";
        element.setAttribute("style","width: 100px");
        element.id = elementId;
        return element;
    };


    onClassCountChange = () => {
        var tmpClasses = this.groupingHelper.calculateClassesSize(this.studentCount, this.classCount);

        this.classes.splice(0, this.classes.length);

        var cnt = 0;
        for (let i = 1; i <= this.classCount; i++) {
            this.classes.push({ classNo: i, studentCount: tmpClasses[i - 1] });
            cnt++;
            $("#classes-settings-container")
                .append("<span style='width: 100px;text-align: right'>Class " +
                i +
                "</span><input id='class" +
                i +
                "' style='width: 100px; margin-right: 10px; margin-left: 10px; margin-bottom: 5px'" +
                "></input");
            if (cnt === 3) {
                $("#classes-settings-container")
                    .append("<div></div>");
                cnt = 0;
            }

        }
    }
}
