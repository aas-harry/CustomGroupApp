// Create a custom group list control
class CustomGroupListControl {
    private kendoHelper = new KendoHelper();
    private gridControl: kendo.ui.Grid;

    get selectedItem() {
        return this.gridControl ? this.gridControl.dataItem(this.gridControl.select()) : null;
    }

    create = (
        parentElement: HTMLElement,
        classItems: Array<ClassDefinition>,
        height = 500) => {
        var container = document.createElement("div") as HTMLDivElement;
        container.setAttribute("style", `width: 400px; height: ${height}px; margin: 5px 0 0 0;`);
        container.id = `class-list-container`;
        var gridElement = document.createElement("div") as HTMLDivElement;
        gridElement.setAttribute("style", "height: 100%;");
        gridElement.id = `class-list`;
        container.appendChild(gridElement);

        parentElement.appendChild(container);

        return this.createClassList(gridElement.id, classItems);;
    };

    createClassList = (
        element: string,
        classItems: Array<ClassDefinition>): kendo.ui.Grid => {

        $(`#${element}`)
            .kendoGrid({
                columns: [{ field: "name", title: "Name", width: "300px", attributes: { 'class': "text-nowrap" } }],
                sortable: {
                    mode: "single",
                    allowUnsort: true
                },
                selectable: "row",
                dataSource: [],
                dataBound(e) {
                    const grid = e.sender;
                    if (grid) {
                        grid.select("tr:eq(0)");
                    }
                }
            });

        this.gridControl =  $(`#${element}`).data("kendoGrid");


        // Populate the grid
        this.gridControl.dataSource.data(classItems);
        this.gridControl.refresh();
        this.gridControl.resize();
        return this.gridControl;
    }

    
}
