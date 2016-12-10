class SchoolGroupClassDefinitionViewModel extends kendo.data.ObservableObject
    implements ICustomGroupViewModel {
    constructor(public classesDefn: ClassesDefinition, onStudentCountChangedEvent: (classCount: number) => any) {
        super();

        this.reset();

        this.onStudentCountChangedEvent = onStudentCountChangedEvent;
        this.bandTableControl = new BandTableControl(this.callOnStudentCountChangedEvent);
    }

    private uploadElement = "upload-school-group-control";
    private uploadContainerElement = "uploader-container";
    private studentsListElement = "student-school-groups-list";
    private showStudentCaptionFieldname = "showStudentCaption";
    private showStudentListFlagFieldname = "showStudentListFlag";

    bandCount = 1;
    classCount = 1;
    studentSets: Array<StudentSet> = [];

    // ReSharper disable once InconsistentNaming
    private _studentCount = 0;
    get studentCount(): number {
        return this._studentCount;
    }
    set studentCount(value: number) {
        this.bandSet.studentCount = value;
        this._studentCount = value;
    }

    get studentInAllClassesCount(): number {
        return Enumerable.From(this.bandSet.bands).SelectMany(b => b.classes).Sum(x => x.count);
    }
    set studentInAllClassesCount(value: number) {
    }

    bandSet: BandSet;
    private groupingHelper = new GroupingHelper();
    private kendoHelper = new KendoHelper();
    private bandTableControl: BandTableControl;
    private hasBandSetInitialised = false;

    reset() {
        this.bandSet = this.classesDefn.createSchoolGroupBandSet("Band", this.classesDefn.studentCount, 1);
        this.studentCount = this.classesDefn.studentCount;
        this.set("bandCount", 1);
        this.set("classCount", 1);
    }

    loadOptions(): boolean {
        this.createClassSet();
        this.addBandsAndClassesControl();

        this.set(this.showStudentListFlagFieldname, false);
        this.showStudentList(false);

        $(`#${this.uploadElement}`).hide();
        return true;
    }

    getBandSet() {
        return this.bandSet;
    }

    genderChanged = (gender: Gender, studentCount: number) => {
    }

    showStudentCaption = "View Students";

    toggleShowStudents = () => {
        this.set(this.showStudentListFlagFieldname, !this.showStudentListFlag);
        this.showStudentList(this.showStudentListFlag);
    }

    showStudentList = (showList) => {

        if (showList) {
            this.set(this.showStudentCaptionFieldname, "Hide Students");
            this.kendoHelper.createStudentSchoolGroupGrid(this.studentsListElement, this.classesDefn.students, true);
        } else {
            this.set(this.showStudentCaptionFieldname, "Show Students");
        }
    }

    importStudents = () => {
        const container = document.getElementById(this.uploadContainerElement);
        container.innerHTML = '<input type="file" id= "files" name= "files" />';
        this.kendoHelper.createUploadControl("files", `..\\Customgroup\\ImportStudentsSchoolGroup?id=${this.classesDefn.testFile.fileNumber}`, this.onUploadCompleted);
        $(`#${this.uploadElement}`).show();

        this.set(this.showStudentListFlagFieldname, false);
        this.showStudentList(false);
    };

    onUploadCompleted = (e: any): any => {
        if (e && e.response) {
            this.classesDefn.testFile.setSchoolGroup(e.response);
            this.classesDefn.setSchoolGroups();
            this.createClassSet();
            this.addBandsAndClassesControl();
        }
        $(`#${this.uploadElement}`).hide();
        this.set(this.showStudentListFlagFieldname, true);
        this.showStudentList(true);
    }

    private createClassSet = () => {
        this.set("studentWithSchoolGroupCount",
            Enumerable.From(this.classesDefn.students).Count(x => x.schoolGroup));
        this.studentSets = [];

        for (let s of this.classesDefn.students) {
            let matched = Enumerable.From(this.studentSets)
                .FirstOrDefault(null, x => x.setName === s.schoolGroup);

            if (matched == null) {
                matched = new StudentSet(StudentSetType.CustomGroup);
                matched.setName = s.schoolGroup;
                this.studentSets.push(matched);
            }
            matched.students.push(s);
        }
        this.set("hasSchoolGroup", this.studentWithSchoolGroupCount > 0);
    }

    hasSchoolGroup = false;


    showStudentListFlag = false;
    studentWithSchoolGroupCount = 0;
    // ReSharper disable once InconsistentNaming


    onStudentCountChangedEvent: (classCount: number) => any;
    callOnStudentCountChangedEvent = () => {
        const onStudentCountChangedEvent = this.onStudentCountChangedEvent;
        if (onStudentCountChangedEvent != null) {
            onStudentCountChangedEvent(this.studentInAllClassesCount);
        }
    };

    addBandsAndClassesControl = () => {
        this.bandSet.createBands("schoolgroup", this.studentCount, this.studentSets.length);
        let i = 0;
        for (let item of this.studentSets) {
            this.bandSet.bands[i].bandName = item.setName ? item.setName : "Unallocated";
            this.bandSet.bands[i].studentCount = item.students.length;
            this.bandSet.bands[i].students = item.students;
            this.bandSet.bands[i].setClassCount(1);
            this.bandSet.bands[i].commonBand = item.setName ? false : true;
            i++;
        }

        this.bandTableControl.init("classes-settings-container", this.bandSet);
    };
}