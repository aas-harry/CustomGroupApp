class ClassDefinitionViewModel extends kendo.data.ObservableObject {

    classes: kendo.data.ObservableArray = new kendo.data.ObservableArray(
        [
            { classNo: 1, studentCount: 11 },
            { classNo: 2, studentCount: 12 },
            { classNo: 3, studentCount: 13 },
            { classNo: 4, studentCount: 14 }
        ]);
    constructor() {
        super();
        super.init(this);
    }

    classCount = 4;

    onStudentCountChanged = (e) => {
        
    };

    onClassCountChange = () => {
        console.log("Class Cnt: ", this.classCount);
        this.classes.splice(0, this.classCount);
        for (let i = 1; i < this.classCount; i++) {
            this.classes.push({ classNo: i, studentCount: 11 });
            $("#classes-setting-container2").append("<input id='class"+ i+ "' style='width: 80px; margin-right: 10px; margin-left: 10px; margin-bottom: 5px'" +
              "></input");

            var foo = $(`#class${i}`)
                .kendoNumericTextBox({
                    options: { format: "n0" },
                    change: this.onStudentCountChanged,
                    spin: this.onStudentCountChanged

                } as kendo.ui.NumericTextBoxOptions);
            var bar = <kendo.ui.NumericTextBox>$(`#class${i}`).data("kendoNumericTextBox");
            bar.value(1);
            bar.max(5);
            bar.min(1);
            bar.options.format = "n0";
            bar.options.decimals = 0;
            // widget.options.change(this.onStudentCountChanged as kendo.ui.NumericTextBoxChangeEvent);
        }

    } 
}
