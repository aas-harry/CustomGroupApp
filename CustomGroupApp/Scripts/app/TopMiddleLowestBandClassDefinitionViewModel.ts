
class TopMiddleLowestBandClassDefinitionViewModel extends CustomGroupBaseViewModel
     {
    constructor(classesDefn: ClassesDefinition, onStudentCountChangedEvent: (classCount: number) => any) {
        super(classesDefn, onStudentCountChangedEvent);


        this.reset();
        
        this.bandTableControl = new BandTableControl(this.callOnStudentCountChangedEvent);
    }

    bandCount = 3;
    classCount = 1;

 
    protected studentCountChanged(value: number) {
        this.bandSet.studentCount = value;
    }
    
    private bandTableControl: BandTableControl;


    get studentInAllClassesCount(): number {
        for (let bandItem of this.bandSet.bands) {
            bandItem.studentCount = Enumerable.From(bandItem.classes).Sum(x => x.count);
        }

        return Enumerable.From(this.bandSet.bands).SelectMany(b => b.classes).Sum(x => x.count);
    } 

    reset() {
        this.bandSet = this.classesDefn.createTopMiddleBottomBandSet("class", this.classesDefn.studentCount);
        this.studentCount = this.classesDefn.studentCount;
        this.set("bandCount", 3);
        this.set("classCount", 1);
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