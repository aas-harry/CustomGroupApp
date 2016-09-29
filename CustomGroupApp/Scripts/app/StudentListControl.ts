﻿class StudentRow extends kendo.data.ObservableObject{
    constructor(student: Student) {
        super(null);
        this.convert(student);
    }
    id: number;
    name: string;
    gender: string;

    convert = (student: Student) => {
        this.id = student.studentId;
        this.name = student.name;
        this.gender = student.sex;
    }
}

class StudentListControl {
    createStudentGrid = (element: string, isCoedSchool: boolean): kendo.ui.Grid => {
        var columns: { field: string; title: string; width: string; attributes: { class: string } }[];
        if (isCoedSchool) {
            columns = [
                { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                { field: "gender", title: "Sex", width: "80px", attributes: { 'class': "text-center" } },
                { field: "id", title: "Id", width: "0px", attributes: { 'class': "text-nowrap" } }
            ];
        } else {
            columns = [
                { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                { field: "id", title: "Id", width: "0px", attributes: { 'class': "text-nowrap" } }
            ];
        }

        $(`#${element}`)
            .kendoGrid({
                columns: columns,
                sortable: {
                    mode: "single",
                    allowUnsort: true
                },
                selectable: "row",
                dataSource: []
            });

        return $(`#${element}`).data("kendoGrid");
    }

    createStudentClassInputContainer = (
        name: string,
        cell: HTMLTableCellElement,
        students: Array<Student>,
        isCoedSchool: boolean,
        width = 300,
        height = 500) => {
        var container = document.createElement("div") as HTMLDivElement;
        container.setAttribute("style", `width: ${width}px; height: ${height}px; margin: 5px 0 0 0;`);
        container.id = `${name}-container`;
        var gridElement = document.createElement("div") as HTMLDivElement;
        gridElement.setAttribute("style", "height: 100%;");
        gridElement.id = `${name}-list`;
        container.appendChild(gridElement);

        cell.appendChild(container);

        this.createStudentListGrid(name, gridElement.id, students, isCoedSchool);
      
    };

    createStudentListGrid = (
        name: string,
        element: string,
        students: Array<Student>,
        isCoedSchool: boolean): kendo.ui.Grid => {
        var grid = this.createStudentGrid(element, isCoedSchool);

        // Populate the grid
        var studentRows: Array<StudentRow> = [];
        Enumerable.From(students).ForEach(x => studentRows.push(new StudentRow(x)));
        grid.dataSource.data(students);
        grid.refresh();
        grid.resize();
        return grid;
    }

}
