﻿class CustomGroupRowViewModel extends kendo.data.ObservableObject {
    name: string;
    groupSetId: number;
    studentCount: number;
    source: ClassDefinition;

    constructor(classItem: ClassDefinition) {
        super();

        this.source = classItem;
         this.updateProperties(classItem);

    }

    updateProperties = (classItem: ClassDefinition) => {
        this.set("name", classItem.name);
        this.set("groupSetId", classItem.groupSetid);
        this.set("studentCount", classItem.count);
    }
}

// Create a custom group list control
class CustomGroupListControl {
    private kendoHelper = new KendoHelper();
    private gridControl: kendo.ui.Grid;
    private dataSource = new Array<CustomGroupRowViewModel>();
// ReSharper disable InconsistentNaming
    private _selectedItems = new Array<ClassDefinition>();
// ReSharper restore InconsistentNaming

    classItems: Array<ClassDefinition>;
    selectedItemsCallback: (items: Array<number>) => any;
    selectedItemCallback: (item: ClassDefinition) => any;

    get selectedItems() {
        return this._selectedItems;
    }

    get selectedItem() {
        if (!this.gridControl) {
            return null;
        }

        const row = this.gridControl.dataItem(this.gridControl.select()) as CustomGroupRowViewModel;
        return row ? row.source : null;
    }

    create = (
        parentElement: HTMLElement,
        classItems: Array<ClassDefinition>,
        selectedItemsCallback: (items: Array<number>) => any,
        selectedItemCallback: (item: ClassDefinition) => any) => {

        this.classItems = classItems;
        this.selectedItemCallback = selectedItemCallback;
        this.selectedItemsCallback = selectedItemsCallback;

        var container = document.createElement("div") as HTMLDivElement;
        container.setAttribute("style", `width: 370px; height: 800px; margin: 5px 0 0 0;`);
        container.id = `class-list-container`;
        var gridElement = document.createElement("div") as HTMLDivElement;
        gridElement.setAttribute("style", "height: 100%;");
        gridElement.id = `class-list`;
        container.appendChild(gridElement);

        parentElement.appendChild(container);

        return this.createClassList(gridElement.id, selectedItemsCallback, selectedItemCallback);;
    };

    deleteClassItems = (classItems: Array<ClassDefinition>) => {
        this.classItems = Enumerable.From(this.classItems).Except(classItems, x => x.groupSetid).ToArray();
        this.setDatasouce();
    }

    updateClassItem = (classItem: ClassDefinition) => {
       
        const item = Enumerable.From(this.classItems).FirstOrDefault(null, x => x.groupSetid === classItem.groupSetid);
        if (item) {
            item.name = classItem.name;
            item.count = classItem.count;
            item.copy(classItem);
        }
        const row = Enumerable.From(this.dataSource).FirstOrDefault(null, x => x.groupSetId === classItem.groupSetid);
        if (row) {
            row.updateProperties(classItem);
        }
    }

    //on click of the checkbox:
    toggleSelectedItem = (e) => {
        const checkBox = e.target;
        if (!checkBox) {
            return;
        }

        const self = this;
        const row = $(checkBox).closest("tr");
        const item = this.gridControl.dataItem(row);

        const classDefn = Enumerable.From(self.classItems)
            .FirstOrDefault(null, s => s.groupSetid === item.get("groupSetId"));

        if (!classDefn) {
            return;
        }

        classDefn.isSelected = checkBox.checked;
        self._selectedItems = Enumerable.From(self.classItems)
            .Where(s => s.isSelected)
            .ToArray();

        if (this._selectedItems.length > 0) {
            this.selectedItemsCallback(Enumerable.From(this._selectedItems).Select(x=> x.groupSetid).ToArray());
        }
    }


    createClassList = (
        element: string,
        selectedItemsCallback: (items: Array<number>) => any,
        selectedItemCallback: (item: ClassDefinition) => any): kendo.ui.Grid => {
        const self = this;

        $(`#${element}`)
            .kendoGrid({
                columns: [
                    { width: "30px", template: "<input type='checkbox' class='checkbox' />" },
                    { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                    { field: "studentCount", title: "Count", width: "50px", attributes: { 'class': "text-nowrap" } }
                ],
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
                },
                change: e => {
                    // an item has been selected from check box, do not display the selected item
                    if (Enumerable.From(self.classItems).Any(x => x.isSelected)) {
                        return;
                    }

                    var gridControl = e.sender as kendo.ui.Grid;
                    const row = gridControl.select().closest("tr");
                    const item = gridControl.dataItem(row);

                    const classDefn = Enumerable.From(self.classItems)
                        .FirstOrDefault(null, s => s.groupSetid === item.get("groupSetId"));
                    const tmpCallback = selectedItemCallback;
                    if (tmpCallback != null) {
                        tmpCallback(classDefn);
                    }
                }
            });


        this.gridControl = $(`#${element}`).data("kendoGrid");
        //bind click event to the checkbox
        this.gridControl.table.on("click", ".checkbox", this.toggleSelectedItem);

        this.setDatasouce();
      
        return this.gridControl;
    }

    setDatasouce = () => {
        this.dataSource = [];
        Enumerable.From(this.classItems)
            .ForEach(s => this.dataSource.push(new CustomGroupRowViewModel(s)));
        // Populate the grid
        this.gridControl.dataSource.data(this.dataSource);
        this.gridControl.refresh();
        this.gridControl.resize();
    }
}