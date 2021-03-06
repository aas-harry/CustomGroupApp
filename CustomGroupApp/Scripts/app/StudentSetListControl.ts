﻿class StudentSetListControl {
    constructor(
        public name: string,
        public students: Array<StudentClass> = [],
        public popupWindowElement: HTMLElement) {
        this.uid = this.commonUtils.createUid();
        this._studentSets = [];
    }

    // ReSharper disable once InconsistentNaming
    private _studentSets: Array<StudentSet>;
    private kendoHelper = new KendoHelper();
    private commonUtils = new CommonUtils();
    private gridControl: kendo.ui.Grid;
    private groupType: StudentSetType;

    get studentSets (): Array<StudentSet>  {
        return this._studentSets;
    }

    get selectedItem() {
        return this.gridControl ? this.gridControl.dataItem(this.gridControl.select()) : null;
    }

    uid: string;

    createStudentSetContainer = (
        cell: HTMLTableCellElement,
        groupType: StudentSetType,
        isCoedSchool: boolean,
        width = 600,
        height = 200) => {

        this.groupType = groupType;
        var container = document.createElement("div") as HTMLDivElement;
        container.setAttribute("style", `width: ${width}px; height: ${height}px; margin: 0 0 0 0;`);
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
        const studentSelector = new StudentSelector();
        studentSelector.openDialog(this.popupWindowElement, this.students, [], (students) => {
            const studentSet = new StudentSet(this.groupType);
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
            const studentSelector = new StudentSelector();
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

    clear = () => {
        this.studentSets.splice(0, this.studentSets.length);
    }

    loadStudentSets = (studentSets: Array<StudentSet>) => {
        this.studentSets.splice(0, this.studentSets.length);
        for (let s of studentSets) {
            this.studentSets.push(s);
        }
        this.setDataSource();
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
                    this.element.find("tbody tr:first").addClass("k-state-selected");
                    const row = this.select().closest("tr");
                    // var value = this.dataItem(row) as CustomGroupRowViewModel;

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
        const dataItems = [];
        for(let item of this.studentSets) {
            dataItems.push({
                'studentList': item.studentList,
                'studentSetId': item.studentSetId
            });
        }
        this.gridControl.dataSource.data(dataItems);
        this.gridControl.refresh();
      
    };
}