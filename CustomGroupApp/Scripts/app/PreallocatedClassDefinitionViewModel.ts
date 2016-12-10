class PreallocatedClassDefinitionViewModel extends kendo.data.ObservableObject
    implements ICustomGroupViewModel {

    constructor(public classesDefn: ClassesDefinition, onStudentCountChangedEvent: (classCount: number) => any) {
        super();

       this.reset();

        this.onStudentCountChangedEvent = onStudentCountChangedEvent;
        this.classTableControl = new ClassTableControl(this.callOnStudentCountChangedEvent);
    }

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

    get studentInAllClassesCount(): number {
        return 0;
    }
    set studentInAllClassesCount(value: number) {
    }
    addBandsAndClassesControl = () => { };

    bandSet: BandSet;
    classCount = 1;
    showStudentCaption = "Show Students";
    preallocatedStudents = new Array< PreAllocatedStudent>();

    private parentContainer: CustomGroupViewModel;
    private groupingHelper = new GroupingHelper();
    private kendoHelper = new KendoHelper();
    private classTableControl: ClassTableControl;

    onStudentCountChangedEvent: (classCount: number) => any;

    onClassCountChanged = () => {
        this.bandSet.bands[0].setClassCount(this.classCount);
        this.classTableControl.init("classes-settings-container", this.bandSet);

        const onStudentCountChangedEvent = this.onStudentCountChangedEvent;
        if (onStudentCountChangedEvent != null) {
            onStudentCountChangedEvent(Enumerable.From(this.bandSet.bands[0].classes).Sum(x => x.count));
        }
    }

    callOnStudentCountChangedEvent = () => {
        const onStudentCountChangedEvent = this.onStudentCountChangedEvent;
        if (onStudentCountChangedEvent != null) {
            onStudentCountChangedEvent(Enumerable.From(this.bandSet.bands[0].classes).Sum(x => x.count));
        }
    };

    reset() {
        this.bandSet = this.classesDefn.createPreAllocatedClassBandSet("class", this.classesDefn.studentCount);
        this.set("classCount", 1);
    }

    loadOptions(): boolean {
        this.classTableControl.init("classes-settings-container", this.bandSet);

        this.set("showPreallocatedStudentsList", false);
        this.showPreallocatedStudents(false);
        $("#import-preallocated-classes").hide();
        return true;
    }

    preAllocatedStudentsCount = 0;
    preAllocatedStudentsMatchedCount = 0;
    hasPreallocatedStudents = false;
    showPreallocatedStudentsList = false;

    togglePreallocatedStudents = () => {
        this.set("showPreallocatedStudentsList", !this.showPreallocatedStudentsList);
        this.showPreallocatedStudents(this.showPreallocatedStudentsList);
    }
    showPreallocatedStudents = (showList) => {
        if (showList) {
            this.set("showStudentCaption", "Hide Students");
            this.kendoHelper.createPreAllocatedStudentGrid("preallocated-students-list", this.preallocatedStudents);
        } else {
            this.set("showStudentCaption", "Show Students");
        }
    }
    

    importStudents = () => {
        const container = document.getElementById("uploader-container");
        container.innerHTML = '<input type="file" id= "files" name= "files" />';
        this.kendoHelper.createUploadControl("files", "..\\Customgroup\\importPreallocatedClasses?id=" + this.bandSet.parent.testFile.fileNumber, this.onUploadCompleted);
        $("#import-preallocated-classes").show();
        this.set("showPreallocatedStudentsList", false);
        this.showPreallocatedStudents(false);
    };

    onUploadCompleted = (e: any): any => {
        this.preallocatedStudents = [];
        if (e && e.response) {
            for (let item of e.response) {
                if (!item.Class || item.Class === "") {
                    continue;
                }
                this.preallocatedStudents.push(new PreAllocatedStudent(item));
            }
            const studentLookup = Enumerable.From(this.bandSet.parent.students)
                .ToDictionary(x => x.studentId, x => x);

            this.set("preAllocatedStudentsMatchedCount",
                Enumerable.From(this.preallocatedStudents)
                .Count(x => x.studentId !== null));
            this.set("hasPreallocatedStudents", this.preAllocatedStudentsMatchedCount > 0);
            this.set("preAllocatedStudentsCount", this.preallocatedStudents.length);

            const classGroups = Enumerable.From(this.preallocatedStudents).Where(x => x.studentId !== null)
                .GroupBy(x => x.className, x => x.studentId).ToArray();
            this.bandSet.bands[0].setClassCount(classGroups.length);
            let classNo = 0;
            for (let classItem of classGroups) {
                const allocatedStudentCount = classItem.source.length;
                this.bandSet.bands[0].classes[classNo].index = classNo + 1;
                this.bandSet.bands[0].classes[classNo].name = `Class ${classItem.Key()}`;
                this.bandSet.bands[0].classes[classNo].students = [];

                this.bandSet.bands[0].classes[classNo].preallocatedStudentCount = allocatedStudentCount;
                if (this.bandSet.bands[0].classes[classNo].count < allocatedStudentCount) {
                    this.bandSet.bands[0].classes[classNo].count = allocatedStudentCount;
                    this.bandSet.bands[0].classes[classNo].notAllocatedStudentCount = 0;
                } else {
                    this.bandSet.bands[0].classes[classNo]
                        .notAllocatedStudentCount = this.bandSet.bands[0].classes[classNo]
                        .count -
                        allocatedStudentCount;
                }

                for (let s of classItem.source) {
                    if (studentLookup.Contains(s)) {
                        const studentClass = studentLookup.Get(s);
                        this.bandSet.bands[0].classes[classNo].addStudent(studentClass, false);
                    }
                }
                classNo++;
            }
            
            this.bandSet.students = Enumerable.From(this.bandSet.parent.students)
                .Except(this.preallocatedStudents, x => x.studentId)
                .Select(x=> x).ToArray();
            this.bandSet.bands[0].students = this.bandSet.students;

            this.classTableControl.init("classes-settings-container", this.bandSet);

            //const unallocatedStudents = Enumerable.From(this.bandSet.parent.testFile.students)
            //    .Except(this.preallocatedStudents, x => x.studentId)
            //    .ToArray();

            //const lastClassNo = classGroups.length;
            //for (let s of unallocatedStudents) {
            //    this.bandSet.bands[0].classes[lastClassNo].students.push(new StudentClass(s));
            //}
            //this.bandSet.bands[0].classes[lastClassNo].count = this.bandSet.bands[0].classes[lastClassNo].students.length;
        }
        $("#import-preallocated-classes").hide();
        this.set("showPreallocatedStudentsList", true);
        this.showPreallocatedStudents(true);
    }

    getBandSet(): BandSet {
        return this.bandSet;
    }

    genderChanged = (gender: Gender, studentCount: number) => {
        this.bandSet.studentCount = studentCount;
        this.bandSet.bands[0].studentCount = studentCount;
        this.studentCount = studentCount;
        this.onClassCountChanged();
    }

    showStudentLanguagePreferences = () => { };

}
