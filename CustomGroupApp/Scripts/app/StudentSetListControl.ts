class StudentSetListControl {
    constructor(
        public name: string,
        public studentSets: Array<StudentSet>,
        public students: Array<StudentClass> = [],
        public popupWindowElement: HTMLElement) {
        this.uid = this.commonUtils.createUid();
    }

    private kendoHelper = new KendoHelper();
    private commonUtils = new CommonUtils();
    private gridControl: kendo.ui.Grid;

    get selectedItem() {
        return this.gridControl ? this.gridControl.dataItem(this.gridControl.select()) : null;
    }

    uid: string;

    createStudentSetContainer = (
        cell: HTMLTableCellElement,
        isCoedSchool: boolean,
        width = 600,
        height = 200) => {
        var container = document.createElement("div") as HTMLDivElement;
        container.setAttribute("style", `width: ${width}px; height: ${height}px; margin: 5px 0 0 0;`);
        container.id = `${this.name}-studentsets-${this.uid}-container`;
        var gridElement = document.createElement("div") as HTMLDivElement;
        gridElement.setAttribute("style", "height: 100%;");
        gridElement.id = `${this.name}-studentsets-${this.uid}`;
        container.appendChild(gridElement);
        cell.appendChild(container);

        return this.createStudentSetGrid(this.name, gridElement.id);
    };

   
    onAddPairStudent = (elementId: string): boolean => {
        if (!this.gridControl || !this.isEqual(elementId)) {
            return false;
        }
        const studentSelector = new StudentSelector(20);
        studentSelector.openDialog(this.popupWindowElement, this.students, [], (students) => {
            const studentSet = new StudentSet();
            studentSet.students = students;
            this.studentSets.push(studentSet);

            this.setDataSource();
           
        }, 30);

        return true;
    }

    onEditPairStudent = (elementId: string): boolean => {
        if (!this.gridControl || !this.isEqual(elementId)) {
            return false;
        }
     
        var selectedItem = this.selectedItem;
        if (selectedItem != null) {
            const studentSet = this.findStudentSetItem(selectedItem.get("studentSetId")) ;
            const studentSelector = new StudentSelector(20);
            studentSelector.openDialog(this.popupWindowElement, this.students, studentSet.students, (students) => {
                studentSet.students = students;

                this.gridControl.dataSource.data(this.studentSets);
                this.gridControl.refresh();
            });
            return true;
        }
        return false;
    }

    onDeletePairStudent = (elementId: string): boolean => {
        if (!this.gridControl || !this.isEqual(elementId)) {
            return false;
        }
        var selectedItem = this.selectedItem;
        if (selectedItem != null) {
            const data = this.gridControl.dataSource.view();
            data.remove(selectedItem);
            this.gridControl.refresh();

            const studentSet = this.findStudentSetItem(selectedItem.get("studentSetId"));
            if (studentSet) {
                const index = this.studentSets.indexOf(studentSet);
                this.studentSets.splice(index, 1);
            }

            return true;
        }
        return false;
    }

    createStudentSetGrid = (
        name: string,
        element: string): kendo.ui.Grid => {
        this.gridControl = this.createStudentSetGridControl(name, element);

        // Populate the grid
        this.setDataSource();
       
        this.gridControl.resize();
        return this.gridControl;
    }

    createStudentSetGridControl = (name: string, element: string): kendo.ui.Grid => {
        var btnStyle = "style = 'margin-right: 2px'";
        var btnClass = "class='btn-xs btn-default'";
        var columns = [
            {
                field: "studentList", width: "400px", attributes: { 'class': "text-nowrap" },
                headerTemplate: `<button ${btnClass} id='${name}-add' style='margin: 0 5px 0 5px' data-bind='click: addPairStudent'>Add ${name} Students list</button>` +
                `<button ${btnClass} id='${name}-edit' data-bind='click: editPairStudent' ${btnStyle}'>Edit</button>` +
                `<button ${btnClass} id='${name}-delete' data-bind='click: deletePairStudent' ${btnStyle}>Delete</i></button>`
            }
        ];

        $(`#${element}`)
            .kendoGrid({
                columns: columns,
                sortable: false,
                selectable: "row",
                dataSource: [],
                dataBound(e) {
                    const grid = e.sender;
                    if (grid) {
                        grid.select("tr:eq(0)");
                    }
                }
            });

        return $(`#${element}`).data("kendoGrid");
    }

    isEqual = (elementId: string): boolean => {
        return this.name === elementId.substr(0, elementId.indexOf("-"));
    }

    private findStudentSetItem = (uid: string): any => {
        for (let item of this.studentSets) {
            if (item.studentSetId === uid) {
                return item;
            }
        }
        return null;
    }
    private setDataSource = () => {
        this.gridControl.dataSource.data(this.studentSets);
        this.gridControl.refresh();
      
    };
}