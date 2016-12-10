class ImportSchoolClassViewModel extends kendo.data.ObservableObject {

    constructor(public testFile: TestFile) {
        super();
        this.classesDefn = new ClassesDefinition(testFile, null);
        this.reset();

        this.importStudents();
    }

    private popupWindowElementName = "popup-window-container";

    // ReSharper disable once InconsistentNaming
    private _studentCount = 0;

    get studentCount(): number {
        return this._studentCount;
    }

    set studentCount(value: number) {

        this.bandSet.studentCount = value;
        this.bandSet.bands[0].studentCount = value;
        this._studentCount = value;
    }

    hasImportedClasses = false;
    invalidUploadFileFormat = false;
    hasUnMatchedStudents = false;
    classesDefn: ClassesDefinition;
    bandSet: BandSet;
    classCount = 1;
    preallocatedStudents = new Array<PreAllocatedStudent>();
    unMatchedStudents = new Array<string>();
    private dataSource = new Array<CustomGroupRowViewModel>();

    private groupingHelper = new GroupingHelper();
    private kendoHelper = new KendoHelper();
    private messageBox = new MessageBoxDialog();
    isSaved = false;
    private uploader: kendo.ui.Upload;

    reset() {
        this.preallocatedStudents = [];
        this.unMatchedStudents = [];

        this.bandSet = this.classesDefn.createPreAllocatedClassBandSet("class", this.classesDefn.studentCount);
        this.set("classCount", 1);
        this.set("hasImportedClasses", false);
        this.set("hasUnMatchedStudents", false);
        this.set("invalidUploadFileFormat", false);
        this.set("isSaved", false);
    }

    downloadTemplate = () => {
        this.groupingHelper.downloadTemplateFile("DownloadSchoolClassTemplate", this.classesDefn.testFile.fileNumber);
    }

    askToSaveClasses = (callback: (status: boolean) => any) => {
        if (this.hasImportedClasses && this.isSaved === false) {
            this.messageBox.showYesNoCancelDialog(this.popupWindowElementName, "Do you want to save the imported classes?", "Save Classes",
                (dialogResult: DialogResult) => {
                    const tmpcallback = callback;
                    if (! tmpcallback) {
                        return;
                    }

                    if (dialogResult === DialogResult.Cancel) {
                        tmpcallback(false);
                        return;
                    }
                    if (dialogResult === DialogResult.Yes) {
                        this.saveClasses((res) => {
                            if (res) {
                                tmpcallback(res);
                            }
                        });
                    }
                    if (dialogResult === DialogResult.No) {
                        tmpcallback(true);
                    }
                });
        } else {
            const tmpcallback = callback;
            if (tmpcallback) {
                tmpcallback(true);
            }
        }
    }

    openCustomGroups = () => {
        this.askToSaveClasses((status) => {
            if (status) {
                $.ajax({
                    url: "..\\Customgroup\\CustomGroupListView",
                    type: 'POST',
                    success(html) {
                        $("#reportContent").replaceWith(html);
                        $(window).trigger('resize');
                    }
                });
            }
        });
    }

    startOver = () => {
        this.askToSaveClasses((status) => {
            if (status) {
                this.reset();
            }
        });
    }

    saveClasses = (callback: (status) => any) => {
        const self = this;
       this.groupingHelper.saveClasses(this.bandSet, (status, classItems) => {
           if (status) {
               toastr.info("Classes have been save successfully.");

               for (let classItem of classItems) {
                   self.classesDefn.testFile.customGroups.push(classItem);
               }
               this.set("isSaved", true);

               const tmpCallback = callback;
               if (tmpCallback && typeof tmpCallback === "function") {
                   tmpCallback(true);
               }

           } else {
               this.messageBox.showWarningDialog(this.popupWindowElementName, "Failed to save classes.", "Saved");
               const tmpCallback = callback;
               if (tmpCallback && typeof tmpCallback === "function") {
                   tmpCallback(false);
               }
           }
       });
    }

    importStudents = () => {
        const container = document.getElementById("uploader-container");
        container.innerHTML = '<input type="file" id= "files" name= "files" />';
        this.uploader =  this.kendoHelper.createUploadControl("files",
            "..\\Customgroup\\ImportSchoolClasses?id=" + this.classesDefn.testFile.fileNumber,
            this.onUploadCompleted);
    };

    showClasses = () => {
        const table = document.getElementById("class-list-container") as HTMLTableElement;
        const tbody = table.tBodies[0] as HTMLTableSectionElement;
        while (tbody.rows.length > 0) {
            tbody.deleteRow(0);
        }

        let cnt = 1;
        for (let classItem of Enumerable.From(this.bandSet.bands[0].classes).OrderBy(c=> c.name).ToArray()) {
            const row = tbody.insertRow();
            this.kendoHelper.addNumberCell(row, cnt);
            this.kendoHelper.addCell(row, classItem.name);
            this.kendoHelper.addNumberCell(row, classItem.count);
            cnt++;
        }
    }

    showUnmatchedStudents = () => {
        const table = document.getElementById("unmatched-student-list-container") as HTMLTableElement;
        const tbody = table.tBodies[0] as HTMLTableSectionElement;
        while (tbody.rows.length > 0) {
            tbody.deleteRow(0);
        }

        let cnt = 1;
        for (let name of this.unMatchedStudents) {
            const row = tbody.insertRow();
            this.kendoHelper.addNumberCell(row, cnt);
            this.kendoHelper.addCell(row, name);
            cnt++;
        }
    }

    onUploadCompleted = (e: any): any => {
        const self = this;
        self.reset();

        if (!e || !e.response) {
            self.showClasses();
            if (self.hasUnMatchedStudents) {
                self.showUnmatchedStudents();
            }
            return;
        }

        self.preallocatedStudents = [];
        for (let item of e.response.StudentClasses) {
            if (!item.Class || item.Class === "") {
                continue;
            }
            self.preallocatedStudents.push(new PreAllocatedStudent(item));
        }

        self.unMatchedStudents = [];
        for (let name of e.response.UnMatchedStudents) {
            if (!name){
                continue;
            }
            self.unMatchedStudents.push(name);
        }

        const studentLookup = Enumerable.From(self.classesDefn.students)
            .ToDictionary(x => x.studentId, x => x);

        const classGroups = Enumerable.From(self.preallocatedStudents)
            .Where(x => x.studentId !== null)
            .GroupBy(x => x.className, x => x.studentId)
            .ToArray();

        self.bandSet.bands[0].setClassCount(classGroups.length);
        let classNo = 0;
        for (let classItem of classGroups) {
            const allocatedStudentCount = classItem.source.length;
            self.bandSet.bands[0].classes[classNo].index = classNo + 1;
            self.bandSet.bands[0].classes[classNo].name = classItem.Key();
            self.bandSet.bands[0].classes[classNo].students = [];

            self.bandSet.bands[0].classes[classNo].preallocatedStudentCount = allocatedStudentCount;
            if (self.bandSet.bands[0].classes[classNo].count < allocatedStudentCount) {
                self.bandSet.bands[0].classes[classNo].count = allocatedStudentCount;
                self.bandSet.bands[0].classes[classNo].notAllocatedStudentCount = 0;
            } else {
                self.bandSet.bands[0].classes[classNo]
                    .notAllocatedStudentCount = self.bandSet.bands[0].classes[classNo]
                    .count -
                    allocatedStudentCount;
            }

            for (let s of classItem.source) {
                if (studentLookup.Contains(s)) {
                    const studentClass = studentLookup.Get(s);
                    self.bandSet.bands[0].classes[classNo].addStudent(studentClass, false);
                }
            }
            self.bandSet.bands[0].classes[classNo].count = self.bandSet.bands[0].classes[classNo].students.length;
            classNo++;
        }

        self.bandSet.students = Enumerable.From(self.bandSet.parent.students)
            .Except(self.preallocatedStudents, x => x.studentId)
            .Select(x => x)
            .ToArray();
        self.bandSet.bands[0].students = self.bandSet.students;

        self.set("isSaved", self.preallocatedStudents.length === 0);
        self.set("hasImportedClasses", true);
        self.set("hasUnMatchedStudents", self.unMatchedStudents.length > 0);
        self.set("invalidUploadFileFormat", self.preallocatedStudents.length === 0);

        self.showClasses();
        if (self.hasUnMatchedStudents) {
            self.showUnmatchedStudents();
        }
    
    }
}