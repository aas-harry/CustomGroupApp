class CustomClassGridCollection {

    private groupingHelper = new GroupingHelper();
    private kendoHelper = new KendoHelper();
    private hiddenClasses: Array<string> = [];
    private elementName: string;
    private bands: Array<BandDefinition>;
    table: HTMLTableElement;
    header: HTMLTableSectionElement;
    headerRow: HTMLTableRowElement;
    classRow: HTMLTableRowElement;
    footerRow: HTMLTableRowElement;
    classes: Array<ClassDefinition> = [];
    students: Array<StudentClass>;
    classCount = 0;
    editClassMode = false;
    popupWindowElement: string;
    classListControls: Array<{ classId: string, studentClassListControls: StudentClassListControl}>;


    initTable = (elementName: string, bands: Array<BandDefinition>, editClassMode = false, students,
            popupWindowElement = "popup-window-container") => {
        this.elementName = elementName;
        this.bands = bands;
        this.editClassMode = editClassMode;
        this.popupWindowElement = popupWindowElement;
        this.students = students;

        $(elementName).html("<table id='custom-classes-table'></table>");
        this.table = document.getElementById("custom-classes-table") as HTMLTableElement;
        this.header = this.table.createTBody();

        this.classListControls = [];
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

                this.classListControls.push({
                    classId: classItem.uid,
                    studentClassListControls: this.createStudentClassListControl(classItem)
                });
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

                    this.classListControls.push({
                        classId: classItem.uid,
                        studentClassListControls: this.createStudentClassListControl(classItem)
                    });
                }
            }
        }
    };

    createStudentClassListControl = (classItem: ClassDefinition): StudentClassListControl => {
        const studentClassListControl = new
            StudentClassListControl(classItem, this.students, this.editClassMode, this.popupWindowElement);

        studentClassListControl.createStudentClassInputContainer(this.classRow.insertCell(),
            this.onEditGroupName,
            this.onUpdateStudentsInClass,
            this.onHideClass,
            this.onDropItem);
        return studentClassListControl;
    }
    
    showAllClasses = () => {
        this.hiddenClasses = [];
        this.initTable(this.elementName, this.bands, this.editClassMode, this.students, this.popupWindowElement);
    }

    hideClassCallback: (classItem: ClassDefinition) => any;
    classChangedCallback: (classItem: ClassDefinition) => any;

    // Remove the selected class from the screen  
    onHideClass = (classItem: ClassDefinition) => {
        this.hiddenClasses.push(classItem.uid);
        this.initTable(this.elementName, this.bands, this.editClassMode, this.students, this.popupWindowElement);

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

            const sourceControl = this.getstudentClassListControl(sourceClass);
            if (sourceControl) {
                sourceControl.updateClassSummaryContent();
            }
            const targetControl = this.getstudentClassListControl(targetClass);
            if (targetControl) {
                targetControl.updateClassSummaryContent();
            }
            

            // save the changes in database
            if (this.editClassMode) {
                this.groupingHelper.addDeleteStudentsInClass(targetClass.groupSetid,
                    [student.studentId],
                    sourceClass.groupSetid,
                    [student.studentId],
                    (status) => {
                        //
                        if (status) {
                            // Notify the caller the affected classes
                            const callback = this.classChangedCallback;
                            if (callback) {
                                callback(sourceClass);
                                callback(targetClass);
                            }
                        }
                    });
            }

       
            return true;
        }
        return false;
    }

    getstudentClassListControl = (classItem: ClassDefinition): StudentClassListControl => {
        const item = Enumerable.From(this.classListControls).FirstOrDefault(null, x => x.classId === classItem.uid);
        return item ? item.studentClassListControls : null;
    }

    onUpdateStudentsInClass = (classItem: ClassDefinition, status: boolean) => {
        // Use this callback function to notify the user
        // Notify the caller the affected classes
        const callback = this.classChangedCallback;
        if (callback) {
            callback(classItem);
        }
    }

    onEditGroupName = (classItem: ClassDefinition, status: boolean) => {
        if (!status) {
            return;
        }

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