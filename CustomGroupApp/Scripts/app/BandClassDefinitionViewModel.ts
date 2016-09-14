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

    bandCount = 6;
    classCount = 1;

    getClasses = (): Array<number> => {
        var classes = new Array<number>();
        this.classes.forEach((val: any) => {
            var classCnt = $(`#class${val.classNo}`).data("kendoNumericTextBox");
            classes.push(classCnt.value());
        });
        return classes;
    }

    groupingHelper = new GroupingHelper();

    onStudentCountChanged = () => {
    };

    onBandCountChange = () => {
        var tmpClasses = this.groupingHelper.calculateClassesSize(this.studentCount, this.bandCount);
        $("#classes-settings-container").html("<table id='band-definition-table'></table>");
        var table = document.getElementById("band-definition-table") as HTMLTableElement;
        var header = table.createTHead();

        var cnt = 0;
        var colNo = 0;
        var bandRow = header.insertRow();
        for (let i = 1; i <= this.bandCount; i++) {
            const cell1 = bandRow.insertCell(colNo);
            cell1.appendChild(this.createNumberInputField());
            colNo++;
            cnt++;
            if (cnt === 3) {
                bandRow = header.insertRow();
                cnt = 0;
                colNo = 0;
            }
        }
        kendo.init("#class-settings-container");
        //  $("#classes-settings-container").append(table.innerHTML);
    }

    private createNumberInputField = () : HTMLElement => {
        var element = document.createElement("input") as HTMLInputElement;
        element.type = "text";
        
        element.setAttribute('style', "width: 80px; margin-right: 15px; margin-left: 10px; margin-bottom: 5px");
        element.setAttribute('data-max','10');
        element.setAttribute('data-min', '1');
        element.setAttribute('data-format', 'n0');
        element.setAttribute('data-role', 'numerictextbox');
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
