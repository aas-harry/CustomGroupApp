class BandClassDefinitionViewModel extends kendo.data.ObservableObject {

   
    classes: kendo.data.ObservableArray = new kendo.data.ObservableArray(
        [
            { classNo: 1, studentCount: 1 }
        ]);
    constructor(public studentCount: number = 0) {
        super();

        this.onBandCountChange();
    }


    bandCount = 3;
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

    private table: HTMLTableElement;
    private header: HTMLTableSectionElement;
    private columnHeaderRow: HTMLTableRowElement;
    private studentsRow: HTMLTableRowElement;
    private bandRow: HTMLTableRowElement;
    private classRows: Array<HTMLTableRowElement> =[];
    onStudentCountChanged = () => {
    };

    onBandCountChange = () => {
        this.bandSet.createBands("custom", this.studentCount, this.bandCount);

        $("#classes-settings-container").html("<table id='band-definition-table'></table>");
        this.table = document.getElementById("band-definition-table") as HTMLTableElement;
        this.header = this.table.createTHead();

        this.columnHeaderRow = this.header.insertRow();
        this.studentsRow = this.header.insertRow();
        this.bandRow = this.header.insertRow();
        this.classRows.push(this.header.insertRow());

        this.kendoHelper.createLabel(this.columnHeaderRow.insertCell(), "");
        this.kendoHelper.createLabel(this.studentsRow.insertCell(), "# Students");
        this.kendoHelper.createLabel(this.bandRow.insertCell(), "# Classes");
        this.kendoHelper.createLabel(this.classRows[0].insertCell(), "Class 1");

        for (let bandNo = 1; bandNo <= this.bandCount; bandNo++) {
            this.kendoHelper.createLabel(this.columnHeaderRow.insertCell(), "Band "+bandNo);
            this.kendoHelper.createStudentsInputContainer(this.studentsRow.insertCell(), this.bandSet.bands[bandNo-1].studentCount, 1, bandNo);
            this.kendoHelper.createBandInputContainer(this.bandRow.insertCell(), bandNo);
            this.kendoHelper.createClassInputContainer(this.classRows[0].insertCell(), this.bandSet.bands[bandNo - 1].studentCount, 1, bandNo);
        }
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
