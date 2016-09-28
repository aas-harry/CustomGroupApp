class CustomClassGrid {
    
}

class CustomClassGridCollection {

    private groupingHelper = new GroupingHelper();
    private studentClassListControls = new StudentClassListControls();
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

            this.studentClassListControls
                .createStudentClassInputContainer(this.classRow.insertCell(),
                    classItem,
                    this.onEditGroupName,
                    this.onDropItem);
        }
    };

    onDropItem = (targetUid: string, sourceUid: string, studentId: number) : boolean => {
        var targetClass = Enumerable.From(this.classes).FirstOrDefault(undefined, x => x.uid === this.getUid(targetUid));
        var sourceClass = Enumerable.From(this.classes).FirstOrDefault(undefined, x => x.uid === this.getUid(sourceUid));
        var student = Enumerable.From(sourceClass.students).FirstOrDefault(undefined, x => x.id === studentId);

        if (targetClass && sourceClass && student && targetClass.index !== sourceClass.index) {
            sourceClass.removeStudent(student);
            targetClass.addStudent(student);

            sourceClass.calculateClassesAverage();
            targetClass.calculateClassesAverage();

            this.studentClassListControls.updateClassSummaryContent(sourceClass);
            this.studentClassListControls.updateClassSummaryContent(targetClass);

            return true;
        }
        return false;
    }

    onEditGroupName = (e: any) => {
        var uid = this.getUid(e.sender.element[0].id);
        var classItem = Enumerable.From(this.classes).FirstOrDefault(undefined, x => x.uid === uid);
        var inputField = e.sender as kendo.ui.MaskedTextBox;
        if (classItem && inputField) {
            classItem.name = inputField.value();
        }
    }

    clear = () => {
        this.items.splice(0, this.items.length);
    }

    createClassHeader = (classItem: ClassDefinition) => {
        this.kendoHelper.createLabel(this.headerRow.insertCell(), classItem.name);

    }

    private getUid = (elementName: string) => {
        return  elementName.substr(elementName.indexOf("-") + 1);
    }

    private parseElementClass = (elementName: string) => {
        var base = elementName.substr(elementName.indexOf("-") + 1);
        var bandNo = base.substr(0, base.indexOf("-"));
        var classNo = base.substr(base.indexOf("-", 1) + 1);
        return { bandNo: parseInt(bandNo), classNo: parseInt(classNo) };
    }
}