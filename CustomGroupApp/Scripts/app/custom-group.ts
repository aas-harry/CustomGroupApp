﻿enum GroupingMethod {
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

    groupByStreaming = (classes: Array<ClassDefinition>,
        students: Array<StudentClass>,
        streamType: StreamType,
        mixBoysGirls: boolean) => {

        this.calculateTotalScore(students, streamType);

        if (!mixBoysGirls) {
            this.groupByStreamingInternal(classes, students);
            return;
        }

        var femaleStudents = Enumerable.From(students).Where(s => (s.gender === "F")).Select(s => s).ToArray();
        var maleStudents = Enumerable.From(students).Where(s => (s.gender === "F")).Select(s => s).ToArray();

        if (femaleStudents.length < maleStudents.length) {
            this.groupByStreamingInternal(classes, femaleStudents);
            this.groupByStreamingInternal(classes, maleStudents);
        } else {
            this.groupByStreamingInternal(classes, maleStudents);
            this.groupByStreamingInternal(classes, femaleStudents);
        }
    };

    groupByMixAbility = (classes: Array<ClassDefinition>,
        students: Array<StudentClass>,
        streamType: StreamType,
        mixBoysGirls: boolean) => {

        this.calculateTotalScore(students, streamType);

        if (!mixBoysGirls) {
            this.groupByMixAbilityInternal(classes, students);
            return;
        }

        var femaleStudents = Enumerable.From(students).Where(s => (s.gender === "F")).Select(s => s).ToArray();
        var maleStudents = Enumerable.From(students).Where(s => (s.gender === "F")).Select(s => s).ToArray();

        if (femaleStudents.length < maleStudents.length) {
            this.groupByMixAbilityInternal(classes, femaleStudents);
            this.groupByMixAbilityInternal(classes, maleStudents, true);
        } else {
            this.groupByMixAbilityInternal(classes, maleStudents);
            this.groupByMixAbilityInternal(classes, femaleStudents, true);
        }
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

class ClassDefinition {
    constructor(public parent: BandDefinition, public index: number, public count: number) {
        this.uid = createUuid();
    }

    uid: string;
    students: Array<StudentClass> = [];
    average: number;

    get moreStudents(): number {
        return this.count - (this.students ? this.students.length : 0);
    }
}

class BandDefinition {
    constructor(public parent: ClassesDefinition,
        public bandNo: number,
        public bandName: string,
        public studentCount,
        public classCount: number = 1,
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
    distributeStudents = (groupType: GroupingMethod, streamType: StreamType, mixBoysGirls: boolean) => {
        switch (groupType) {
        case GroupingMethod.MixedAbility:
            break;
        case GroupingMethod.Streaming:
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
    };
     
    calculateClassesAverage = (classes: Array<ClassDefinition>) => {
        for (let i = 0; i < classes.length; i++) {
            classes[i].average = Enumerable.From(classes[i].students).Average(x => x.score);
        }
    };

    prepare = (students: Array<StudentClass>) => {
        this.students = students;
        switch (this.groupType) {
            case GroupingMethod.MixedAbility:
                this.groupHelper.groupByMixAbility(this.classes, this.students, this.streamType, this.mixBoysGirls);
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
        public bandStreamType = BandStreamType.Streaming,
        public streamType = StreamType.OverallAbilty,
        public groupType = GroupingMethod.Streaming,
        public mixBoysGirls = false) {

        this.uid = createUuid();
        this.createBands(name, studentCount, bandCount, streamType, groupType, mixBoysGirls);
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

    prepare = (students: Array<StudentClass>) => {
        this.students = students;
        this.bands[0].students = this.students;
        this.bands[0].prepare(this.students);
    }
 

    private createBands = (name: string,
        studentCount: number,
        bandCount: number,
        streamType = StreamType.OverallAbilty,
        groupType = GroupingMethod.Streaming,
        mixBoysGirls: boolean = false) => {

        var tmpBands = this.groupingHelper.calculateClassesSize(studentCount, bandCount);

        this.bands = [];
        for (let i = 0; i < bandCount; i++) {
            const bandNo = i + 1;
            const band = new BandDefinition(this.parent,
                bandNo,
                `Band ${bandNo}`,
                tmpBands[0],
                1,
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
        streamType = StreamType.OverallAbilty,
        groupType = GroupingMethod.Streaming,
        mixBoysGirls: boolean = false) {
        super(parent, "Custom", studentCount, bandCount, bandStreamType, streamType, groupType, mixBoysGirls);
    }

    prepare = (students: Array<StudentClass>) => {
        this.students = students;
        this.bands[0].students = this.students;
        for (let i = 0; i < this.bands.length; i++) {
            this.bands[i].prepare(this.students);
        }
    }
}

class TopMiddleLowestBandSet extends BandSet {
    constructor(public parent: ClassesDefinition, public studentCount: number, public bandStreamType: BandStreamType = BandStreamType.Streaming) {
        super(parent, "TopMiddleLowest", studentCount, 3, bandStreamType);
    }

    prepare = (students: Array<StudentClass>) => {
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
    };
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
        streamType = StreamType.OverallAbilty,
        groupType = GroupingMethod.Streaming,
        mixBoysGirls = false): BandSet => {

        return new BandSet(this, name, studentCount, bandCount, bandStreamType, streamType, groupType, mixBoysGirls);
    };

    createCustomBandSet = (name: string, studentCount: number, bandCount: number): CustomBandSet => {
        return new CustomBandSet(this, studentCount, bandCount);
    }

    createTopMiddleBottomBandSet = (studentCount: number): TopMiddleLowestBandSet => {
        return new TopMiddleLowestBandSet(this, studentCount);
    };
}