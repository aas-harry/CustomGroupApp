class ClassDefinitionViewModel extends CustomGroupBaseViewModel {

    constructor(classesDefn: ClassesDefinition, onStudentCountChangedEvent: (classCount: number) => any) {
        super(classesDefn, onStudentCountChangedEvent);

        this.reset();
        this.classTableControl = new ClassTableControl(this.callOnStudentCountChangedEvent);
    }
  
    protected studentCountChanged(value: number) {
        this.bandSet.studentCount = value;
        this.bandSet.bands[0].studentCount = value;
    }

    classCount = 3;

    private groupingHelper = new GroupingHelper();
    private kendoHelper = new KendoHelper();
    private classTableControl : ClassTableControl;

    get studentInAllClassesCount(): number {
        return Enumerable.From(this.bandSet.bands[0].classes).Sum(x => x.count);
    }

    genderChanged = (gender: Gender, studentCount: number) => {
        this.studentCount = studentCount;
        this.addBandsAndClassesControl();
    }
    onClassCountChanged = (count: number) => {
        this.classCount = count;
        this.addBandsAndClassesControl();
    }

    reset() {
        this.bandSet = this.classesDefn.createBandSet("class", this.classesDefn.studentCount);
        this.bandSet.bands[0].setClassCount(3);
        this.set("classCount", 3);
        this.set("studentCount", this.classesDefn.studentCount);

    }

   loadOptions() {
        this.classTableControl.init("classes-settings-container", this.bandSet);
    }

   addBandsAndClassesControl = () => {
       this.bandSet.bands[0].setClassCount(this.classCount);
       this.classTableControl.updateStudentClassRows();
   };

}
