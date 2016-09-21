﻿class CustomClassGrid {
    
}

class CustomClassGridCollection {

    private groupingHelper = new GroupingHelper();
    private kendoHelper = new KendoHelper();
    private me = this;
    items: Array<CustomClassGrid> = [];
    table: HTMLTableElement;
    header: HTMLTableSectionElement;
    headerRow: HTMLTableRowElement;
    classRow: HTMLTableRowElement;
    footerRow: HTMLTableRowElement;
    classes: Array<ClassDefinition> = [];
    classCount = 0;

    initTable = (elementName: string, bands: Array<BandDefinition>) => {
        
        $(elementName).html("<table id='custom-classes-table'></table>");
        this.table = document.getElementById("custom-classes-table") as HTMLTableElement;
        this.header = this.table.createTBody();
        this.classRow = this.header.insertRow();

        this.classes = Enumerable.From(bands).SelectMany(b => b.classes).ToArray();
        this.classCount = this.classes.length;

        var cnt = 0;
        for (let classItem of this.classes) {
            if (cnt === 3) {
                this.classRow = this.header.insertRow();
                cnt = 0;
            }
            cnt++;
            
            this.kendoHelper.createStudentClassInputContainer(this.classRow.insertCell(), classItem);
        }
    };

    clear = () => {
        this.items.splice(0, this.items.length);
    }

    createClassHeader = (classItem: ClassDefinition) => {
        this.kendoHelper.createLabel(this.headerRow.insertCell(), classItem.name);

    }
}