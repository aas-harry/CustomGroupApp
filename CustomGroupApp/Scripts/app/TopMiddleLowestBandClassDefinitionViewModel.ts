
class TopMiddleLowestBandClassDefinitionViewModel extends CustomGroupBaseViewModel
     {
    constructor(classesDefn: ClassesDefinition, onStudentCountChangedEvent: (classCount: number) => any) {
        super(classesDefn, onStudentCountChangedEvent);
    

        this.bandSet = classesDefn.createTopMiddleBottomBandSet("class", classesDefn.studentCount);
        this.studentCount = classesDefn.studentCount;
        
        this.bandTableControl = new BandTableControl(this.callOnStudentCountChangedEvent);
    }

    bandCount = 3;
    classCount = 1;

 
    protected studentCountChanged(value: number) {
        this.bandSet.studentCount = value;
    }
    
    private bandTableControl: BandTableControl;


    get studentInAllClassesCount(): number {
        return Enumerable.From(this.bandSet.bands).SelectMany(b => b.classes).Sum(x => x.count);
    } 

    loadOptions(): boolean {
        this.bandTableControl.init("classes-settings-container", this.bandSet);
        return true;
    }

    genderChanged = (gender: Gender, studentCount: number) => {
        this.studentCount = studentCount;
        this.bandSet.studentCount = studentCount;
        this.addBandsAndClassesControl();
    }

    addBandsAndClassesControl = () => {
        this.bandSet.createBands("Band", this.studentCount, this.bandCount);
        this.bandTableControl.init("classes-settings-container", this.bandSet);
    };
}