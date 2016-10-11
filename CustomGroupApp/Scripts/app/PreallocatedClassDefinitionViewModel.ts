class PreallocatedClassDefinitionViewModel extends kendo.data.ObservableObject
    implements ICustomGroupViewModel {

    constructor(public classesDefn: ClassesDefinition, onStudentCountChangedEvent: (classCount: number) => any) {
        super();

        this.bandSet = classesDefn.createBandSet("class", classesDefn.studentCount);
        this.studentCount = classesDefn.studentCount;

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

    loadOptions(): boolean {
       this.classTableControl.init("classes-settings-container", this.bandSet);
        $("#import-preallocated-classes").hide();
        return true;
    }

    preAllocatedStudentsCount = 0;
    preAllocatedStudentsMatchedCount = 0;
    hasPreallocatedStudents = false;
    showPreallocatedStudentsList = false;
    showPreallocatedStudents = () => {
        this.set("showPreallocatedStudentsList", !this.showPreallocatedStudentsList);
        if (this.showPreallocatedStudentsList) {
            this.set("showStudentCaption", "Hide Students");
            this.kendoHelper.createPreAllocatedStudentGrid("preallocated-students-list", this.preallocatedStudents);
            this.classTableControl.init("classes-settings-container", this.bandSet);
        } else {
            this.set("showStudentCaption", "Show Students");
        }
    }

    importStudents = () => {
        this.kendoHelper.createUploadControl("files", "Customgroup\\importPreallocatedClasses?id=" + this.bandSet.parent.testFile.fileNumber, this.onUploadCompleted);
        $("#import-preallocated-classes").show();
        this.set("showPreallocatedClasses", false);
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
            const studentLookup = Enumerable.From(this.bandSet.parent.testFile.students)
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
                this.bandSet.bands[0].classes[classNo].index = classNo + 1;
                this.bandSet.bands[0].classes[classNo].name = `Class ${classItem.Key()}`;
                this.bandSet.bands[0].classes[classNo].students = [];
                for (let s of classItem.source) {
                    if (studentLookup.Contains(s)) {
                        const studentClass = new StudentClass(studentLookup.Get(s));
                        studentClass.canMoveToOtherClass = false;
                        this.bandSet.bands[0].classes[classNo].addStudent(studentClass);
                    }
                }
                classNo++;
            }
            
            this.bandSet.students = Enumerable.From(this.bandSet.parent.testFile.students)
                .Except(this.preallocatedStudents, x => x.studentId)
                .Select(x=> new StudentClass(x)).ToArray();
            this.bandSet.bands[0].students = this.bandSet.students;

            //const unallocatedStudents = Enumerable.From(this.bandSet.parent.testFile.students)
            //    .Except(this.preallocatedStudents, x => x.studentId)
            //    .ToArray();

            //const lastClassNo = classGroups.length;
            //for (let s of unallocatedStudents) {
            //    this.bandSet.bands[0].classes[lastClassNo].students.push(new StudentClass(s));
            //}
            //this.bandSet.bands[0].classes[lastClassNo].count = this.bandSet.bands[0].classes[lastClassNo].students.length;

            this.showPreallocatedStudents();

        }
        $("#import-preallocated-classes").hide();
        this.set("showPreallocatedClasses", true);
        this.set("showStudentCaption", "Hide Students");
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
