enum GroupingMethod {
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
    const s = [];
    const hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    const uuid = s.join("");
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
    }

    source: Student;
    class: ClassDefinition;
    gender: string;
    score: number;
    name: string;
    classNo: number;
    bandNo: number;
    flag: number;
    canMoveToOtherClass = true;
}

class SearchClassContext {
    constructor(public classNo: number,
        public firstClassNo: number,
        public lastClassNo: number,
        public isLastClass: boolean) {
    }
}

class GroupingHelper {
    calculateClassesSize = (totalStudents: number, classCount: number): Array<number> => {
        var studentInClass = Math.floor(totalStudents / classCount);
        var remainingStudents = totalStudents - (studentInClass * classCount);

        var classes = new Array<number>();
        for (let i = 0; i < classCount; i++) {
            classes.push(studentInClass + (remainingStudents > 0 ? 1 : 0));
            remainingStudents--;
        }
        return classes;
    };

    setOveralAbilityScore = (students: Array<StudentClass>) => {
        for (let i = 0; i < students.length; i++) {
            students[i].score = students[i].source.overallAbilityScore();
        }
    };

    setEnglishScore = (students: Array<StudentClass>) => {
        for (let i = 0; i < students.length; i++) {
            students[i].score = students[i].source.englishScore();
        }
    };

    setMathAchievementScore = (students: Array<StudentClass>) => {
        for (let i = 0; i < students.length; i++) {
            students[i].score = students[i].source.mathsAchievementScore();
        }
    };

    calculateTotalScore = (students: Array<StudentClass>, streamType: StreamType) => {
        if (streamType === StreamType.OverallAbilty) {
            this.setOveralAbilityScore(students);
        }
        if (streamType === StreamType.English) {
            this.setEnglishScore(students);
        }
        if (streamType === StreamType.MathsAchievement) {
            this.setMathAchievementScore(students);
        }
    };

    handleSeparatedStudents = (classes: Array<ClassDefinition>, separatedStudents: Array<StudentSet>) => {
        for (let i = 0; i < separatedStudents.length; i++) {

            // Check if all students are already in different classes
            var allocatedClasses = new Array<number>();
            var studentSets = Enumerable.From(separatedStudents[i].students)
                .GroupBy(x => x.classNo, x => x)
                .ToArray();
            for (let g of studentSets) {
                if (g.source.length > 1) {
                    continue;
                }
                g.source[0].canMoveToOtherClass = false;
                allocatedClasses.push(g.source[0].classNo);
            }
            const isCoed = Enumerable.From(classes).SelectMany(c => c.students).Any(x => x.gender === "M") &&
                Enumerable.From(classes).SelectMany(c => c.students).Any(x => x.gender === "F");

            const flattenedStudentList = Enumerable.From(classes).SelectMany(c => c.students).ToArray();
            for (let g of studentSets) {
                if (g.source.length === 1) {
                    continue;
                }

                allocatedClasses.push(g.source[0].classNo);
                for (let j = 1; j < g.source.length; j++) {
                    var s = g.source[j];
                    var replacement = this.findStudentReplacement(s, flattenedStudentList, allocatedClasses, true);
                    replacement = replacement != null || isCoed === false ? replacement :
                        this.findStudentReplacement(s, flattenedStudentList, allocatedClasses, false);
                    if (replacement != null) {
                        let tmpClassNo = replacement.classNo;

                        replacement.classNo = s.classNo;
                        s.classNo = tmpClassNo;
                        allocatedClasses.push(replacement.classNo);


                        return replacement;
                    }
                }
            }
        }
    };

    handleJoinedStudents = (classes: Array<ClassDefinition>, joinedStudents: Array<StudentSet>) => {

    };

    private swapStudents = (student1: StudentClass, student2: StudentClass) => {
    }
    private findStudentReplacement = (student: StudentClass
        , students: Array<StudentClass>
        , allocatedClasses: Array<number>
        , sameGender = false): StudentClass => {

        var tmpStudents = new Array<StudentClass>();
        if (sameGender)
        {
            tmpStudents = Enumerable.From(students)
            .Where(s => s.gender === student.gender && ! Enumerable.From(allocatedClasses).Contains(s.classNo))
            .Select(s => s)
                .ToArray();
        } else {
            tmpStudents = Enumerable.From(students)
                .Where(s => !Enumerable.From(allocatedClasses).Contains(s.classNo))
                .Select(s => s)
                .ToArray();
        }

         // Try to find students with 10, 20, 30, 40, 50 score difference first before pick any students
        for (var diff of [10, 20, 30, 40, 50, 300]) {
            var replacement = Enumerable.From(tmpStudents)
                .FirstOrDefault(null, x => x.canMoveToOtherClass && Math.abs(x.score - student.score) <= diff);
            if (replacement != null) {
                return replacement;
            }
        }

        return null;
    };

    groupByStreaming = (classes: Array<ClassDefinition>,
        students: Array<StudentClass>,
        streamType: StreamType,
        mixBoysGirls: boolean,
        joinedStudents: Array<StudentSet> = [],
        separatedStudents: Array<StudentSet> = []) => {

        this.calculateTotalScore(students, streamType);

        if (!mixBoysGirls) {
            this.groupByStreamingInternal(classes, students);
        } else {
            var femaleStudents = Enumerable.From(students).Where(s => (s.gender === "F")).Select(s => s).ToArray();
            var maleStudents = Enumerable.From(students).Where(s => (s.gender === "F")).Select(s => s).ToArray();

            if (femaleStudents.length < maleStudents.length) {
                this.groupByStreamingInternal(classes, femaleStudents);
                this.groupByStreamingInternal(classes, maleStudents);
            } else {
                this.groupByStreamingInternal(classes, maleStudents);
                this.groupByStreamingInternal(classes, femaleStudents);
            }
        }
        this.handleJoinedStudents(classes, joinedStudents);
        this.handleSeparatedStudents(classes, separatedStudents);

    };

    groupByMixAbility = (classes: Array<ClassDefinition>,
        students: Array<StudentClass>,
        streamType: StreamType,
        mixBoysGirls: boolean,
        joinedStudents: Array<StudentSet> = [],
        separatedStudents: Array<StudentSet> = []) => {

        this.calculateTotalScore(students, streamType);

        if (!mixBoysGirls) {
            this.groupByMixAbilityInternal(classes, students);
        } else {
            var femaleStudents = Enumerable.From(students).Where(s => (s.gender === "F")).Select(s => s).ToArray();
            var maleStudents = Enumerable.From(students).Where(s => (s.gender === "F")).Select(s => s).ToArray();

            if (femaleStudents.length < maleStudents.length) {
                this.groupByMixAbilityInternal(classes, femaleStudents);
                this.groupByMixAbilityInternal(classes, maleStudents, true);
            } else {
                this.groupByMixAbilityInternal(classes, maleStudents);
                this.groupByMixAbilityInternal(classes, femaleStudents, true);
            }
        }
        this.handleJoinedStudents(classes, joinedStudents);
        this.handleSeparatedStudents(classes, separatedStudents);

    };


    private groupByMixAbilityInternal = (classes: Array<ClassDefinition>, students: Array<StudentClass>,
        orderReversed: boolean = false) => {
        var sortedStudents = orderReversed === false ?
            Enumerable.From(students).OrderByDescending(s => s.score).Select(s => s).ToArray() :
            Enumerable.From(students).OrderBy(s => s.score).Select(s => s).ToArray();

        var classCount = classes.length;
        var nextClass = new SearchClassContext(0, 0, classCount - 1, false);
        for (let i = 0; i < sortedStudents.length; i++) {
            const student = sortedStudents[i];
            student.classNo = nextClass.classNo + 1;
            classes[nextClass.classNo].students.push(student);
            nextClass = this.getNextClassToAddNewStudent(classes, nextClass);
        }
        return classes;
    };

    private getNextClassToAddNewStudent = (classes: Array<ClassDefinition>, context: SearchClassContext):
        SearchClassContext => {
        // this is the logic to get the next class
        // 1. Get the next available class 
        // 2. If the next class is the last class and then we need to ctart again from the last initial class no + 1
        //    This is will distribute the smarter students evently across all classes.

        var result = new SearchClassContext(-1, context.firstClassNo, context.lastClassNo, false);
        var nextClassNo: number;
        if (context.isLastClass) {
            nextClassNo = context.firstClassNo;
            result.lastClassNo = nextClassNo < classes.length ? context.firstClassNo : (classes.length - 1);
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
            if (result.lastClassNo === (classQueue[i].index - 1)) {
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

    private groupByStreamingInternal = (classes: Array<ClassDefinition>, students: Array<StudentClass>) => {
        var sortedStudents = Enumerable.From(students).OrderByDescending(s => s.score).Select(s => s).ToArray();
        var classNo = 0;
        var numberStudentsInClass = 0;
        for (let i = 0; i < sortedStudents.length; i++) {
            const student = sortedStudents[i];
            student.classNo = classNo + 1;
            classes[classNo].students.push(student);
            numberStudentsInClass++;
            if (classes[classNo].count <= numberStudentsInClass) {
                classNo++;
                numberStudentsInClass = 0;
            }
        }
        return classes;
    };
}

class StudentSet {
    students: Array<StudentClass> = [];
}

class ClassDefinition {
    constructor(public parent: BandDefinition, public index: number, public count: number) {
        this.uid = createUuid();
    }

    uid: string;
    name: string;
    students: Array<StudentClass> = [];
    average: number;
    boysCount: number;
    girlsCount: number;
    boysAverage: number;
    girlsAverage: number;

    get moreStudents(): number {
        return this.count - (this.students ? this.students.length : 0);
    }

    prepare = (name: string) => {
        switch (this.parent.bandType) {
            case BandType.None:
                this.name = name + " " + this.index;
                break;
            case BandType.Custom:
                this.name = name + " " + this.index +"/" + this.parent.bandNo;
                break;
            case BandType.Top:
                this.name = name + " " + "Top " + this.index;
                break;
            case BandType.Middle:
                this.name = name + " " + "Middle " + this.index;
                break;
            case BandType.Lowest:
                this.name = name + " " + "Lowest " + this.index;
                break;
            default: 
                this.name = name + " " + this.index;
                break;
        }
    }
}

class BandDefinition {
    constructor(public parent: ClassesDefinition,
        public bandNo: number,
        public bandName: string,
        public studentCount,
        public classCount: number = 1,
        public bandType = BandType.None,
        public streamType = StreamType.OverallAbilty,
        public groupType = GroupingMethod.Streaming,
        public mixBoysGirls: boolean = false) {

        this.uid = createUuid();
        this.setClassCount(classCount);
    }

    uid: string;
    students: Array<StudentClass> = [];
    classes: Array<ClassDefinition> = [];

    private groupHelper = new GroupingHelper();

    setClassCount = (classCount: number) => {
        this.classCount = classCount;
        this.calculateClassesSize(classCount);
    };
  
    calculateClassesAverage = (classes: Array<ClassDefinition>) => {
        for (let i = 0; i < classes.length; i++) {
            classes[i].average = Enumerable.From(classes[i].students).Average(x => x.score);
            classes[i].average = Enumerable.From(classes[i].students).Average(x => x.score);
            classes[i].average = Enumerable.From(classes[i].students).Average(x => x.score);
            classes[i].average = Enumerable.From(classes[i].students).Average(x => x.score);
        }
    };

    prepare = (name: string, students: Array<StudentClass> = null,
        joinedStudents : Array<StudentSet> = [],
        separatedStudents: Array<StudentSet> = []) => {
        if (students) {
            this.students = students;
        }
        switch (this.groupType) {
            case GroupingMethod.MixedAbility:
                this.groupHelper.groupByMixAbility(this.classes, this.students, this.streamType, this.mixBoysGirls, joinedStudents, separatedStudents);
                break;
            case GroupingMethod.Streaming:
                this.groupHelper.groupByStreaming(this.classes, this.students, this.streamType, this.mixBoysGirls);
                break;
            case GroupingMethod.Banding:
                break;
            case GroupingMethod.TopMiddleLowest:
                break;
            case GroupingMethod.Language:
                break;
            case GroupingMethod.CustomGroup:
                break;
        }

        this.groupHelper.handleJoinedStudents(this.classes, joinedStudents);
        this.groupHelper.handleSeparatedStudents(this.classes, separatedStudents);

        for (let i = 0; i < this.classes.length; i++) {
            this.classes[i].prepare(name);
        }
        this.calculateClassesAverage(this.classes);
    };

    private calculateClassesSize = (classCount: number) => {
        var studentInClass = Math.floor(this.studentCount / classCount);
        var remainingStudents = this.studentCount - (studentInClass * classCount);

        this.classes = [];
        for (let i = 0; i < classCount; i++) {
            this.classes.push(new ClassDefinition(this, i + 1, studentInClass + (remainingStudents > 0 ? 1 : 0)));
            remainingStudents--;
        }
    };
}


class BandSet {
    constructor(public parent: ClassesDefinition,
        public name: string,
        public studentCount: number,
        bandCount: number = 1,
        public bandType = BandType.None,
        public bandStreamType = BandStreamType.Streaming,
        public streamType = StreamType.OverallAbilty,
        public groupType = GroupingMethod.Streaming,
        public mixBoysGirls = false) {

        this.uid = createUuid();
        this.createBands(name, studentCount, bandCount, bandType, streamType, groupType, mixBoysGirls);
    }

    uid: string;
    students: Array<StudentClass> = [];
    bands: Array<BandDefinition>;

    // ReSharper disable once InconsistentNaming
    private _bankCount: number;
    get bandCount(): number {
        return this.bands ? this.bands.length : 0;
    }

    protected groupingHelper = new GroupingHelper();

    prepare = (name: string, students: Array<StudentClass>,
        joinedStudents: Array<StudentSet> = [],
        separatedStudents: Array<StudentSet> = []) => {
        this.students = students;
        if (this.bandCount === 1) {
            this.bands[0].students = this.students;
            this.bands[0].prepare(name, this.students, joinedStudents, separatedStudents);
            return;
        }
        var classes = this.convertToClasses(this);
        if (this.bandStreamType === BandStreamType.Streaming) {
            this.groupingHelper.groupByStreaming(classes,
                this.students,
                this.streamType,
                this.mixBoysGirls);
        } else {
            this.groupingHelper.groupByMixAbility(classes,
                this.students,
                this.streamType,
                this.mixBoysGirls);
        }

        this.groupingHelper.handleJoinedStudents(classes, joinedStudents);
        this.groupingHelper.handleSeparatedStudents(classes, separatedStudents);
        
        for (let i = 0; i < this.bands.length; i++) {
            this.bands[i].students = classes[i].students;
            this.bands[i].prepare(name, null, joinedStudents, separatedStudents);
        }
    }
 

    private createBands = (name: string,
        studentCount: number,
        bandCount: number,
        bandType: BandType,
        streamType = StreamType.OverallAbilty,
        groupType = GroupingMethod.Streaming,
        mixBoysGirls: boolean = false) => {

        var tmpBands = this.groupingHelper.calculateClassesSize(studentCount, bandCount);

        this.bands = [];
        for (let i = 0; i < bandCount; i++) {
            const bandNo = i + 1;
            const band = new BandDefinition(this.parent,
                bandNo,
                name + " " + bandNo,
                tmpBands[i],
                1,
                bandType,
                streamType,
                groupType,
                mixBoysGirls);

            this.bands.push(band);
        }
    };

    protected convertToClasses = (bandSet: BandSet): Array<ClassDefinition> => {
        var classes = new Array<ClassDefinition>();
        for (let i = 0; i < bandSet.bands.length; i++) {
            classes.push(new ClassDefinition(null, i + 1, bandSet.bands[i].studentCount));
        }
        return classes;
    };
}

class CustomBandSet extends BandSet {
    constructor(public parent: ClassesDefinition,
        public studentCount: number,
        public bandCount: number = 1,
        bandStreamType = BandStreamType.Streaming,
        bandType = BandType.None,
        streamType = StreamType.OverallAbilty,
        groupType = GroupingMethod.Streaming,
        mixBoysGirls: boolean = false) {
        super(parent, "Custom", studentCount, bandCount, bandType, bandStreamType, streamType, groupType, mixBoysGirls);
    }

    prepare = (name: string, students: Array<StudentClass>) => {
        this.students = students;
        var classes = this.convertToClasses(this);
        if (this.bandStreamType === BandStreamType.Streaming) {
            this.groupingHelper.groupByStreaming(classes,
                this.students,
                this.streamType,
                this.mixBoysGirls);
        } else {
            this.groupingHelper.groupByMixAbility(classes,
                this.students,
                this.streamType,
                this.mixBoysGirls);
        }

        this.bands[0].students = this.students;
        for (let i = 0; i < this.bands.length; i++) {
            this.bands[i].students = classes[i].students;
            this.bands[i].prepare(name);
        }
    }
}

class TopMiddleLowestBandSet extends BandSet {
    constructor(public parent: ClassesDefinition,
        public studentCount: number,
        public bandStreamType = BandStreamType.Streaming,
        bandType = BandType.None,
        streamType = StreamType.OverallAbilty,
        groupType = GroupingMethod.Streaming,
        mixBoysGirls: boolean = false) {
        super(parent, "TopMiddleLowest", studentCount, 3, BandType.Custom,
            bandStreamType, streamType, groupType, mixBoysGirls);

        this.bands[0].bandType = BandType.Top;
        this.bands[1].bandType = BandType.Middle;
        this.bands[2].bandType = BandType.Lowest;
    }
}

class ClassesDefinition {
    constructor(public testFile: TestFile) {
        this.uid = createUuid();
        this.groupGender = testFile.isUnisex ? Gender.All : (testFile.hasBoys ? Gender.Boys : Gender.Girls);
        this.testFile = testFile;

        this.students = new Array<StudentClass>();
        for (let i = 0; i < testFile.students.length; i++) {
            this.students.push(new StudentClass(testFile.students[i]));
        }
    }

    uid: string;
    students: Array<StudentClass>;
    groupName: string;
    groupGender: Gender;
    streamType: StreamType;
    customBands: BandSet;
    spreadBoysGirlsEqually = false;
    excludeLeavingStudent = false;

    get studentCount(): number {
        return this.students.length;
    }

    createBandSet = (name: string,
        studentCount: number,
        bandCount: number = 1,
        bandStreamType = BandStreamType.Streaming,
        bandType = BandType.None,
        streamType = StreamType.OverallAbilty,
        groupType = GroupingMethod.Streaming,
        mixBoysGirls = false): BandSet => {

        return new BandSet(this, name, studentCount, bandCount, bandType, bandStreamType, streamType, groupType, mixBoysGirls);
    };

    createCustomBandSet = (
        name: string, studentCount: number, bandCount: number): CustomBandSet => {
        return new CustomBandSet(this, studentCount, bandCount);
    }

    createTopMiddleBottomBandSet = (name: string,
        studentCount: number,
        bandCount: number = 1,
        bandStreamType = BandStreamType.Streaming,
        bandType = BandType.None,
        streamType = StreamType.OverallAbilty,
        groupType = GroupingMethod.Streaming,
        mixBoysGirls = false): TopMiddleLowestBandSet => {
        return new TopMiddleLowestBandSet(this, studentCount, bandStreamType, bandType
        , streamType, groupType, mixBoysGirls);
    };
}