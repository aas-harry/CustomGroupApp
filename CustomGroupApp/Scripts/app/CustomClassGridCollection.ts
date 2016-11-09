class CustomClassGridCollection {

    private groupingHelper = new GroupingHelper();
    private studentClassListControls = new StudentClassListControl();
    private kendoHelper = new KendoHelper();
    private hiddenClasses: Array<string> = [];
    private elementName: string;
    private bands: Array<BandDefinition>;
    private me = this;
    table: HTMLTableElement;
    header: HTMLTableSectionElement;
    headerRow: HTMLTableRowElement;
    classRow: HTMLTableRowElement;
    footerRow: HTMLTableRowElement;
    classes: Array<ClassDefinition> = [];
    classCount = 0;
    editClassMode = false;

    initTable = (elementName: string, bands: Array<BandDefinition>, editClassMode = false) => {
        this.elementName = elementName;
        this.bands = bands;
        this.editClassMode = editClassMode;

        $(elementName).html("<table id='custom-classes-table'></table>");
        this.table = document.getElementById("custom-classes-table") as HTMLTableElement;
        this.header = this.table.createTBody();

        const hiddenClassLookup = Enumerable.From(this.hiddenClasses).ToDictionary(x => x, x => x);

        if (bands.length === 1) {
            this.classRow = this.header.insertRow();
            this.classes = Enumerable.From(bands).SelectMany(b => b.classes).ToArray();
            this.classCount = this.classes.length;

            let cnt = 0;
            for (let classItem of this.classes) {
                if (hiddenClassLookup.Contains(classItem.uid)) {
                    continue;
                }
                if (cnt === 3) {
                    this.classRow = this.header.insertRow();
                    cnt = 0;
                }
                cnt++;

                this.studentClassListControls
                    .createStudentClassInputContainer(this.classRow.insertCell(),
                        classItem,
                        this.onEditGroupName,
                        this.onUpdateStudentsInClass,
                        this.onHideClass,
                        this.onDropItem, editClassMode);
            }
        } else {
            for (let band of bands) {
                this.classes = Enumerable.From(bands).SelectMany(b => b.classes).ToArray();
                this.classCount = this.classes.length;

                this.classRow = this.header.insertRow();
                for (let classItem of band.classes) {
                    if (hiddenClassLookup.Contains(classItem.uid)) {
                        continue;
                    }

                    this.studentClassListControls
                        .createStudentClassInputContainer(this.classRow.insertCell(),
                        classItem,
                        this.onEditGroupName,
                        this.onUpdateStudentsInClass,
                        this.onHideClass,
                        this.onDropItem, editClassMode);
                }
            }
        }
    };

    showAllClasses = () => {
        this.hiddenClasses = [];
        this.initTable(this.elementName, this.bands, this.editClassMode);
    }

    hideClassCallback: (classItem: ClassDefinition) => any;
    classChangedCallback: (classItem: ClassDefinition) => any;

    // Remove the selected class from the screen  
    onHideClass = (classItem: ClassDefinition) => {
        this.hiddenClasses.push(classItem.uid);
        this.initTable(this.elementName, this.bands, this.editClassMode);

        const tmpCallback = this.hideClassCallback;
        if (tmpCallback) {
            tmpCallback(classItem);
        }
    }

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

            // save the changes in database
            if (this.editClassMode) {
                this.groupingHelper.addDeleteStudentsInClass(targetClass.groupSetid,
                    [student.studentId],
                    sourceClass.groupSetid,
                    [student.studentId],
                    (status) => {
                        //
                    });
            }

            // Notify the caller the affected classes
            const callback = this.classChangedCallback;
            if (callback) {
                callback(sourceClass);
                callback(targetClass);
            }
            return true;
        }
        return false;
    }

    onUpdateStudentsInClass = (classItem: ClassDefinition, status: boolean) => {
        // Use this callback function to notify the user
        // Notify the caller the affected classes
        const callback = this.classChangedCallback;
        if(callback) {
            callback(classItem);
        }
    }

    onEditGroupName = (classItem: ClassDefinition, status: boolean) => {
        // Use this callback function to notify the user
        // Notify the caller the affected classes
        const callback = this.classChangedCallback;
        if (callback) {
            callback(classItem);
        }
    }

    clear = () => {
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