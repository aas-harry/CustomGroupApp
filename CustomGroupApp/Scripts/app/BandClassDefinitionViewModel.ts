class BandClassDefinitionViewModel extends kendo.data.ObservableObject {

   
    classes: kendo.data.ObservableArray = new kendo.data.ObservableArray(
        [
            { classNo: 1, studentCount: 1 }
        ]);
    constructor(public studentCount: number = 0) {
        super();
        super.init(this);

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

    private groupingHelper = new GroupingHelper();
    private kendoHelper = new KendoHelper();

    onStudentCountChanged = () => {
    };

    onBandCountChange = () => {
        $("#classes-settings-container").html("<table id='band-definition-table'></table>");
        var table = document.getElementById("band-definition-table") as HTMLTableElement;
        var header = table.createTHead();

        var colNo = 0;
        var columnHeader = header.insertRow();
        var bandRow = header.insertRow();
        var classCountRow = header.insertRow();

        this.kendoHelper.createLabel(columnHeader.insertCell(0), "<span style='width: 100px'></span>");
        this.kendoHelper.createLabel(bandRow.insertCell(0), "Number of Classes");
        this.kendoHelper.createLabel(classCountRow.insertCell(0), "Class 1");

        for (let i = 1; i <= this.bandCount; i++) {
            this.kendoHelper.createLabel(columnHeader.insertCell(i), "Band "+colNo);
            this.kendoHelper.createBandInputContainer(bandRow.insertCell(i), i);
            this.kendoHelper.createBandInputContainer(classCountRow.insertCell(i), i);
            colNo++;
          
        }
        //  $("#classes-settings-container").append(table.innerHTML);
    }

    private createNumberInputField = (elementId: string, name: string): HTMLElement => {
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
