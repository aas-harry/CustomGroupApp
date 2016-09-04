enum GroupType {
    Unknown = 0,
    MixedAbility = 1,
    Streaming = 2,
    Banding = 3,
    TopMiddleLowest = 4,
    Language = 5,
    CustomGroup = 6
}

enum SearchDirection {
    Forward,
    Backward
}

enum Gender {
    All = 0,
    Girls = 1,
    Boys = 2
}

enum BandType {
    None = 0,
    Custom = 1,
    Top = 2,
    Middle = 3,
    Lowest = 4
}

enum StreamType {
    None = 0,
    OverallAbilty = 1,
    English = 1,
    MathsAchievement = 2
}

enum BandStreamType {
    None = 0,
    Streaming = 1,
    Parallel = 2,
}

function createUuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

class SummaryClass {
    classNo: number;
    average: number;
    count: number;
}

class StudentClass {
    constructor(public s: Student) {
        this.source = s;
        this.name = s.name;
        this.gender = s.sex;
        this.score = s.genab.raw + s.mathPerformance.raw + s.reading.raw + s.spelling.raw;
    }
    source: Student;
    gender: string;
    score: number;
    name: string;
    classNo: number;
    bandNo: number;
    flag: number;
}

class SearchClassContext {
    constructor(public classNo: number,
        public firstClassNo: number,  
        public lastClassNo: number,
        public isLastClass: boolean) { }
}

class ClassDefinition {
    constructor(public parent: BandDefinition, public index: number, public count: number) {
        this.uid = createUuid();
        this.students = new Array<StudentClass>();
    }
    uid: string;
    students: Array<StudentClass> = [];
    average: number;

    get moreStudents(): number {
        return this.count - (this.students ? this.students.length : 0);
    }

}

class BandDefinition {
    constructor(public parent: ClassesDefinition, public bandNo: number, public bandName: string,
        public studentCount: number, classCount: number,  public bandType: BandType = BandType.None) {
        this.uid = createUuid();
        this.mixBoysGirls = false;
        this.streamType = StreamType.OverallAbilty;
        this.students = new Array<StudentClass>();

        this.setClassCount(classCount);
    }
    uid: string;
    classes: Array<ClassDefinition> = [];
    students: Array<StudentClass> = [];
    groupType: GroupType;
    mixBoysGirls: boolean;
    streamType: StreamType;

    get classCount() {
        return this.classes ? this.classes.length : 0;
    }

    setClassCount = (classCount: number) => {
        this.classes = this.calculateClassesSize(this, this.studentCount, classCount);
    }

    calculateTotalScore = (students: Array<StudentClass>) => {
        if (this.streamType === StreamType.OverallAbilty) {
            this.setOveralAbilityScore(students);
        }
        if (this.streamType === StreamType.English) {
            this.setEnglishScore(students);
        }
        if (this.streamType === StreamType.MathsAchievement) {
            this.setMathAchievementScore(students);
        }
    };

    private setOveralAbilityScore = (students: Array<StudentClass>) => {
        for (let i = 0; i < students.length; i++) {
            students[i].score = students[i].source.overallAbilityScore();
        }
    };
   
    private setEnglishScore = (students: Array<StudentClass>) => {
        for (let i = 0; i < students.length; i++) {
            students[i].score = students[i].source.englishScore();
        }
    };

    private setMathAchievementScore = (students: Array<StudentClass>) => {
        for (let i = 0; i < students.length; i++) {
            students[i].score = students[i].source.mathsAchievementScore();
        }
    };

    distributeStudents = (groupType: GroupType, streamType: StreamType, mixBoysGirls: boolean) => {
        switch (groupType) {
            case GroupType.MixedAbility:
                break;
            case GroupType.Streaming:
                break;
            case GroupType.Banding:
                break;
            case GroupType.TopMiddleLowest:
                break;
            case GroupType.Language:
                break;
            case GroupType.CustomGroup:
                break;
        }
    };

    calculateAverage = (classes: Array<ClassDefinition>) => {
        for (let i = 0; i < classes.length; i++) {
            classes[i].average = Enumerable.From(classes[i].students).Average(x => x.score);
        }
    };

    groupByMixAbility = (students: Array<StudentClass>, mixBoysGirls: boolean) => {
        this.calculateTotalScore(students);

        if (!mixBoysGirls) {
            this.classes = this.groupByMixAbilityInternal(students, true);
            return;
        }

        var femaleClasses = this.groupByMixAbilityInternal(Enumerable.From(students)
            .Where(s => (s.gender === "F")).Select(s => s).ToArray(), false);
        var maleClasses = this.groupByMixAbilityInternal(Enumerable.From(students)
            .Where(s => (s.gender === "M")).Select(s => s).ToArray(), false);
      
        var index = this.classCount - 1;

        for (let i = 0; i < this.classCount; i++) {
            if (i < femaleClasses.length) {
                this.classes[i].students = (this.classes[i].students.concat(femaleClasses[i].students));
            }
            if (index < maleClasses.length) {
                for (let j = 0; j < maleClasses[index].students.length; j++) {
                    maleClasses[index].students[j].classNo = i + 1;
                }
                this.classes[i].students = (this.classes[i].students.concat(maleClasses[index].students));
            }
            index--;
        }

    };

    groupByStreaming = (students: Array<StudentClass>, mixBoysGirls: boolean) => {
        this.calculateTotalScore(students);

        if (!mixBoysGirls) {
            this.classes = this.groupByStreamingInternal(students, true);
            return;
        }

        var femaleStudents = Enumerable.From(students).Where(s => (s.gender === "F")).Select(s => s).ToArray();
        var maleStudents = Enumerable.From(students).Where(s => (s.gender === "F")).Select(s => s).ToArray();

        var maleClasses = this.groupByStreamingInternal(maleStudents, false);
        var femaleClasses = this.groupByStreamingInternal(femaleStudents, false);

        if (femaleStudents.length < maleStudents.length) {
            for (let i = 0; i < this.classCount; i++) {
                if (i < femaleClasses.length) {
                    for (let j = 0; j < femaleClasses[i].students.length; j++) {
                        if (this.classes[i].count <= this.classes[i].students.length) {
                            break;
                        }
                        femaleClasses[i].students[j].flag = 1;
                        this.classes[i].students.push(femaleClasses[i].students[j]);
                    }
                }
            }
        }

        for (let i = 0; i < this.classCount; i++) {
            if (i < femaleClasses.length) {
                this.classes[i].students = (this.classes[i].students.concat(femaleClasses[i].students));
            }
            if (i < maleClasses.length) {
                this.classes[i].students = (this.classes[i].students.concat(maleClasses[i].students));
            }
        }
    };

    private groupByMixAbilityInternal = (students: Array<StudentClass>, allStudents: boolean): Array<ClassDefinition> => {
        var classes = allStudents ? this.classes : this.calculateClassesSize(this, students.length, this.classCount);
        var sortedStudents = Enumerable.From(students).OrderByDescending(s => s.score).Select(s => s).ToArray();
        var nextClass = new SearchClassContext(0, 0, this.classCount-1, false);
        for (let i = 0; i < sortedStudents.length; i++) {
            const student = sortedStudents[i];
            student.classNo = nextClass.classNo + 1;
            student.bandNo = this.bandNo;
            classes[nextClass.classNo].students.push(student);
            nextClass = this.getNextClassToAddNewStudent(classes, nextClass);
        }
        return classes;
    };

    private getNextClassToAddNewStudent = (classes: Array<ClassDefinition>, context: SearchClassContext): SearchClassContext => {
        // this is the logic to get the next class
        // 1. Get the next available class 
        // 2. If the next class is the last class and then we need to ctart again from the last initial class no + 1
        //    This is will distribute the smarter students evently across all classes.
      
        var result = new SearchClassContext(-1, context.firstClassNo, context.lastClassNo, false);
        var nextClassNo: number;
        if (context.isLastClass) {
            nextClassNo = context.firstClassNo;
            result.lastClassNo = nextClassNo < classes.length ? context.firstClassNo : (classes.length-1);
            result.firstClassNo = nextClassNo < classes.length ? (nextClassNo + 1) : 0;
        } else {
            nextClassNo = context.classNo;
        }

        // get the class in the right order to pick up
        var classQueue = [];
        for (let i = nextClassNo + 1; i < classes.length; i++) {
            classQueue.push(classes[i]);
        }
        for (let i = 0; i <= nextClassNo; i++) {
            classQueue.push(classes[i]);
        }

        for (let i = 0; i < classQueue.length; i++) {
            if (classQueue[i].students.length >= classQueue[i].count) {
                continue;
            }
            result.classNo = classQueue[i].index - 1;

            // we have reach the last class
            if (result.lastClassNo === (classQueue[i].index -1)) {
                result.isLastClass = true;
            }
            break;
        }
       
        // If all groups have been completed, add the rest of the students into first group
        if (result.classNo === -1) {
            result.classNo = 0;
        }
        return result;
    };

    private groupByStreamingInternal = (students: Array<StudentClass>, allStudents: boolean): Array<ClassDefinition> => {
        var classes = allStudents ? this.classes : this.calculateClassesSize(this, students.length, this.classCount);
        var sortedStudents = Enumerable.From(students).OrderByDescending(s => s.score).Select(s => s).ToArray();
        var classNo = 0;
        var numberStudentsInClass = 0;
        for (let i = 0; i < sortedStudents.length; i++) {
            const student = sortedStudents[i];
            student.classNo = classNo + 1;
            student.bandNo = this.bandNo;
            classes[classNo].students.push(student);
            numberStudentsInClass++;
            if (classes[classNo].count <= numberStudentsInClass) {
                classNo++;
                numberStudentsInClass = 0;
            }
        }
        return classes;
    };

    public calculateClassesSize = (bandDefnition: BandDefinition, totalStudents: number, classCount: number): Array<ClassDefinition> => {
        var studentInClass = Math.floor(totalStudents / classCount);
        var remainingStudents = totalStudents - (studentInClass * classCount);

        var classes = new Array<ClassDefinition>();
        for (let i = 0; i < classCount; i++) {
            classes.push(new ClassDefinition(bandDefnition, i + 1, studentInClass + (remainingStudents > 0 ? 1 : 0)));
            remainingStudents--;
        }
        return classes;
    };
}
class BandSet {
    constructor(public parent: ClassesDefinition, public name: string) {
        this.students = parent.students;
        this.bandStreamType = BandStreamType.Streaming;
        this.mixBoysGirls = false;
    }

    get students(): Array<StudentClass> {
        return this.parent && this.parent.students ? this.parent.students : new Array<StudentClass>();
    }

    bandStreamType: BandStreamType;
    mixBoysGirls: boolean;

    bands: Array<BandDefinition>;
    get count(): number {
        return this.bands ? this.bands.length : 0;
    }

    createBands = (name: string, bandCount: number) => {
        this.bands = [];

        // Create a temporary banddefinition to calculate the band sizes
        var tempBand = new BandDefinition(this.parent, 1, "Custom", this.students.length, bandCount, BandType.Custom);

        for (let i = 0; i < bandCount; i++) {
            this.bands.push(this.convertFromClasses(tempBand.classes[i], i +1));
        }
    };

    createBandClasses = (bandStreamType: BandStreamType, mixBoysGirls: boolean) => {
        if (!bandStreamType) {
            bandStreamType = this.bandStreamType;
        }
        if (!mixBoysGirls) {
            mixBoysGirls = this.mixBoysGirls;
        }

        this.bandStreamType = bandStreamType;
        this.mixBoysGirls = mixBoysGirls;

        // Create a temporary banddefinition to calculate the band sizes
        var band = this.convertToClasses(this);
        band.groupByStreaming(this.students, this.mixBoysGirls);
        for (let i = 0; i < band.classes.length; i++) {
            this.bands[i].students = band.classes[i].students;
        }    

        for (let i = 0; i < this.bands.length; i++) {
            this.bands[i].groupByMixAbility(this.bands[i].students, this.mixBoysGirls);
        }
    }

    private convertToClasses = (bandSet: BandSet): BandDefinition => {
        var band = new BandDefinition(this.parent, 1, "Band", bandSet.students.length, bandSet.bands.length);
        for (let i = 0; i < bandSet.bands.length; i++) {
            band.classes[i].count = bandSet.bands[i].studentCount;
        }
        
        return band;
    }
    private convertFromClasses = (classDefinition: ClassDefinition, bandNo: number): BandDefinition => {
        return new BandDefinition(this.parent, bandNo, "Band " + bandNo, classDefinition.count, 1);
    }

}


class TopMiddleLowestBandSet extends BandSet {
    constructor(public parent: ClassesDefinition) {
        super(parent, "TopMiddleLowest");

        this.bands = [];
        this.bands.push(new BandDefinition(this.parent, 1, "Top", 0, 1, BandType.Top));
        this.bands.push(new BandDefinition(this.parent, 2, "Middle", 0, 1, BandType.Middle));
        this.bands.push(new BandDefinition(this.parent, 3, "Lowest", 0, 1, BandType.Lowest));
    }
}

class ClassesDefinition {
    constructor(testFile: TestFile) {
        this.uid = createUuid();
        this.groupType = GroupType.MixedAbility;
        this.groupGender = testFile.isUnisex ? Gender.All : (testFile.hasBoys ? Gender.Boys : Gender.Girls);
        this.testInfo = testFile;
        this.singleBand = new BandDefinition(this, 1, "Class", testFile.studentCount, 1,  BandType.None);
        this.topMiddleLowestBands = new TopMiddleLowestBandSet(this);
        this.customBands = new BandSet(this, "Custom Bands");

        this.students = new Array<StudentClass>();
        for (let i = 0; i<testFile.students.length; i++) {
            this.students.push(new StudentClass(testFile.students[i]));
        }
     }

    uid: string;  
    testInfo: TestFile;
    students: Array<StudentClass>;
    groupName: string;
    groupType: GroupType;
    groupGender: Gender;
    streamType: StreamType;
    singleBand: BandDefinition;
    customBands: BandSet;
    topMiddleLowestBands: BandSet;
    spreadBoysGirlsEqually = false;
    excludeLeavingStudent = false;
}