class ClassDefinitionViewModel extends kendo.data.ObservableObject {

    classes: kendo.data.ObservableArray = new kendo.data.ObservableArray(
        [
            { classNo: 1, studentCount: 1 }
        ]);
    constructor(public studentCount: number = 0) {
        super();
        super.init(this);

        this.classCount = 1;
    }

    classCount = 1;

    getClasses = (): Array<number> => {
        var classes = new Array<number>();
        this.classes.forEach((val : any) => {
            var classCnt = $(`#class${val.classNo}`).data("kendoNumericTextBox");
            classes.push(classCnt.value());
        });
        return classes;
    }

    groupingHelper = new GroupingHelper();

    onStudentCountChanged = () => {
    };

    onClassCountChange = () => {
        var tmpClasses = this.groupingHelper.calculateClassesSize(this.studentCount, this.classCount);

        this.classes.splice(0, this.classes.length);
        $("#classes-settings-container").html("");
        var cnt = 0;
        for (let i = 1; i <= this.classCount; i++) {
            this.classes.push({ classNo: i, studentCount: tmpClasses[i-1] });
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
            $(`#class${i}`)
                .kendoNumericTextBox({
                    options: {  },
                    change: this.onStudentCountChanged,
                    spin: this.onStudentCountChanged

                } as kendo.ui.NumericTextBoxOptions);
            const spinnerInputField = $(`#class${i}`).data("kendoNumericTextBox");
            spinnerInputField.options.format = "n0";
            spinnerInputField.value(tmpClasses[i - 1]);
            spinnerInputField.max(250);
            spinnerInputField.min(1);
            spinnerInputField.options.decimals = 0;
        }
    } 
}
