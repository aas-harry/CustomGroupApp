class StudentNavigationControl {
    constructor(public elementName: string) {
        this.hostElement = document.getElementById(elementName);
    }

    private students: Array<Student>;
    private studentRows: Array<StudentRow> = [];
    private commonUtils = new CommonUtils();
    private kendoHelper = new KendoHelper();
    private prevButton: kendo.ui.Button;
    private nextButton : kendo.ui.Button;
    hostElement: HTMLElement;
    comboBoxControl: kendo.ui.ComboBox;

    studentSelectedCallback: (student: Student) => any;
   

    create = (
        name = "students",
        studentSelectedCallback: (student: Student) => any) => {

        this.studentSelectedCallback = studentSelectedCallback;
        const self = this;

        if (this.hostElement.childElementCount > 0) {
            while (this.hostElement.hasChildNodes()) {
                this.hostElement.removeChild(this.hostElement.lastChild);
            }
        }

        // Create HTML element for hosting the grid control
        var container = document.createElement("div") as HTMLDivElement;
        container.setAttribute("style", `margin: 5px 0 0 0;`);
        container.id = `${name}-${this.commonUtils.createUid()}-container`;

        var comboBoxElement = document.createElement("div") as HTMLDivElement;
        comboBoxElement.setAttribute("style", "width: 300px;");
        comboBoxElement.id = `${name}-${this.commonUtils.createUid()}-list`;

     
        const prevButton = document.createElement("div") as HTMLDivElement;
        prevButton.setAttribute("style", "margin-left: 2px; margin-right: 2px");
        prevButton.id = "buttonPrev";
        prevButton.textContent = "Previous";
        const nextButton = document.createElement("div") as HTMLDivElement;
        nextButton.setAttribute("style", "margin-left: 2px; margin-right: 2px");
        nextButton.id = "buttonNext";
        nextButton.textContent = "Next";
        
       
    //    container.appendChild(comboBoxElement);
        this.hostElement.appendChild(prevButton);
        this.hostElement.appendChild(comboBoxElement);  
        this.hostElement.appendChild(nextButton);

        this.prevButton = this.kendoHelper.createKendoButton(prevButton.id, this.showPreviousStudent,"arrow-w");
        this.nextButton = this.kendoHelper.createKendoButton(nextButton.id, this.showNextStudent, "arrow-e");
        this.prevButton.enable(false);


        $(`#${comboBoxElement.id}`)
            .kendoComboBox({
                options: {},
                suggest: true,
                placeholder: "select a student...",
                filter: "contains",
                dataTextField: "name",
                dataValueField: "id",
                index: 0,
                change: (e) => {
                    var inputControl = e.sender as kendo.ui.ComboBox;
                    this.onStudentChanged(inputControl.dataItem() as StudentRow);
                }
               
            } as kendo.ui.ComboBoxOptions);

        this.comboBoxControl = $(`#${comboBoxElement.id}`).data("kendoComboBox");

        return self;
    };

    private showPreviousStudent = () => {
        let index = this.comboBoxControl.select();
        
        index--;
        this.comboBoxControl.select(index);
        this.comboBoxControl.trigger("change");

        this.prevButton.enable(index > 0);
        this.nextButton.enable(index < this.studentRows.length);
    }
    private showNextStudent = () => {
        let index = this.comboBoxControl.select();
        index++;
        this.comboBoxControl.select(index);
        this.comboBoxControl.trigger("change");

        this.prevButton.enable(index > 0);
        this.nextButton.enable(index+1 < this.studentRows.length);
    }

    private onStudentChanged = (studentRow: StudentRow) => {
        if (!studentRow) {
            return;
        }
        var student = Enumerable.From(this.students).FirstOrDefault(null, x => x.studentId === studentRow.id);
        const tmpCallback = this.studentSelectedCallback;
        if (tmpCallback != null && student != null) {
            tmpCallback(student);
        }
    }

    setDatasource = (students: Array<Student>): StudentNavigationControl => {
        const self = this;
      
        // Populate the grid
        this.students = students;

        this.studentRows = [];
        Enumerable.From(students).ForEach(x => this.studentRows.push(new StudentRow(x)));
        this.comboBoxControl.dataSource.data(this.studentRows);
        this.comboBoxControl.refresh();
      
        return self;
    }
}