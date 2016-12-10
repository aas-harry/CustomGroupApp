class CustomGroupRowViewModel extends kendo.data.ObservableObject {
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
    private _selectedItem: ClassDefinition;
    private _selectedItems = new Array<ClassDefinition>();
    // ReSharper restore InconsistentNaming

    classItems: Array<ClassDefinition>;
    selectedItemsCallback: (items: Array<number>) => any;
    selectedItemCallback: (item: ClassDefinition) => any;

    get selectedItems() {
        return this._selectedItems;
    }

    get selectedItem() {
        return this._selectedItem;
    }

    set selectedItem(newValue: ClassDefinition) {
       if (this._selectedItem === newValue) {
            return;
        }
        this._selectedItem = newValue;

        // an item has been selected from check box, do not display the selected item
        if (this.selectedItems.length > 0 || !newValue){
            return;
        }


        const tmpCallback = this.selectedItemCallback;
        if (tmpCallback != null) {
            tmpCallback(newValue);
        }

   }

    private resetSelectedItems = () => {
        this._selectedItems = [];
        for (let classItem of this.classItems) {
            classItem.isSelected = false;
        }
    }

    create = (
        parentElement: HTMLElement,
        classItems: Array<ClassDefinition>,
        selectedItemsCallback: (items: Array<number>) => any,
        selectedItemCallback: (item: ClassDefinition) => any) => {

        this.classItems = classItems;
        this.resetSelectedItems();

        this.selectedItemCallback = selectedItemCallback;
        this.selectedItemsCallback = selectedItemsCallback;

        var gridElement = document.createElement("div") as HTMLDivElement;
        gridElement.setAttribute("style", "width: 370px; height: 100%;");
        gridElement.id = `class-list`;

        parentElement.appendChild(gridElement);

        return this.createClassList(gridElement.id);;
    };

    deleteClassItems = (classItems: Array<ClassDefinition>) => {
        this.resetSelectedItems();
        this.classItems = Enumerable.From(this.classItems).Except(classItems, x => x.groupSetid).ToArray();
        this.setDatasouce();
    }

    addClassItems = (classItems: Array<ClassDefinition>) => {
        this.resetSelectedItems();
        for (let classItem of classItems) {
            this.classItems.push(classItem);
        }
        this.setDatasouce(classItems.length > 0 ? classItems[0] : null);
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

    private showSelectedItems = () => {
        this._selectedItems = Enumerable.From(this.classItems)
            .Where(s => s.isSelected)
            .ToArray();

     if (this._selectedItems.length > 0) {
            this.selectedItemsCallback(Enumerable.From(this._selectedItems).Select(x => x.groupSetid).ToArray());
        } else {
            if (this._selectedItem)
            {this.selectedItemsCallback(Enumerable.From([this._selectedItem]).Select(x => x.groupSetid).ToArray());}
        }
        
    }

    private toggleAllItemsSelections(checked) {
        const self = this;

        for (let classItem of self.classItems) {
            classItem.isSelected = checked;
        }

       $(".checkbox-select").prop("checked", checked);
      
        self.showSelectedItems();  
    }

    //on click of the checkbox:
    private toggleSelectedItem = (e) => {
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

        self.showSelectedItems();
    }


    createClassList = (element: string): kendo.ui.Grid => {
        const self = this;

        $(`#${element}`)
            .kendoGrid({
                columns: [
                    {
                        width: "30px",
                        template: "<input type='checkbox' class='checkbox-select' />",
                        headerTemplate: '<input type="checkbox" id="check-all" />'
                    },
                    {
                        field: "name", title:"Select All", width: "200px",
                        attributes: { 'class': "text-nowrap"}
                    },
                    {
                        field: "studentCount",
                        title: "Count",
                        width: "50px",
                        attributes: { 'class': "text-nowrap", 'style': "text-align: center" }
                    }
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: true
                },
                selectable: "row",
                dataSource: [],
                dataBound(e) {
                   this.element.find("tbody tr:first").addClass("k-state-selected");
                   const row = this.select().closest("tr");
                    var value = this.dataItem(row) as CustomGroupRowViewModel;

                   self.selectedItem = (value)
                       ? Enumerable.From(self.classItems)
                           .FirstOrDefault(null, s => s.groupSetid === value.get("groupSetId"))
                       : null;

                  

                },
                change: e => {
                    var gridControl = e.sender as kendo.ui.Grid;
                    const row = gridControl.select().closest("tr");
                    var value = gridControl.dataItem(row) as CustomGroupRowViewModel;
                    
                    self.selectedItem = (value)
                        ? Enumerable.From(self.classItems)
                        .FirstOrDefault(null, s => s.groupSetid === value.get("groupSetId"))
                        : null;
                
                }
            });


        this.gridControl = $(`#${element}`).data("kendoGrid");
        //bind click event to the checkbox
        this.gridControl.table.on("click", ".checkbox-select", this.toggleSelectedItem);
        $("#check-all")
            .click((e) => {
                const checkBox = e.target as HTMLInputElement;
                if (!checkBox) {
                    return;
                }
                this.toggleAllItemsSelections(checkBox.checked);
            });


        this.setDatasouce();
        return this.gridControl;
    }

  

    setDatasouce = (classItem: ClassDefinition = null) => {
        this.dataSource = [];
        Enumerable.From(this.classItems)
            .ForEach(s => this.dataSource.push(new CustomGroupRowViewModel(s)));
        // Populate the grid
        this.gridControl.dataSource.data(this.dataSource);
        this.gridControl.refresh();
        this.gridControl.resize();

        if (classItem) {
            const self = this;
            let foundIt = false;
            $.each(this.gridControl.tbody.find('tr'),
                function() {
                    const foundItem = self.gridControl.dataItem(this) as CustomGroupRowViewModel;
                    if (foundItem.get("groupSetId") === classItem.groupSetid) {
                        $('[data-uid=' + foundItem.uid + ']').addClass('k-state-selected');

                        self.selectedItem = (foundItem)
                            ? Enumerable.From(self.classItems)
                                .FirstOrDefault(null, s => s.groupSetid === foundItem.get("groupSetId"))
                            : null;


                        foundIt = true;
                        return false;
                    }
                });

            //calculate scrollTop distance
            if (foundIt) {
                const scrollContentOffset = this.gridControl.element.find("tbody").offset().top;
                const selectContentOffset = this.gridControl.select().offset().top;
                const distance = selectContentOffset - scrollContentOffset;
                this.gridControl.element.find(".k-grid-content")
                    .animate({
                            scrollTop: distance
                        },
                    400);
            }
        }
    }
}