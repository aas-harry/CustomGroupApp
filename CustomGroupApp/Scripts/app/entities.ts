var subjectTypes = [
    { Subject: "Unknown", Index: 0, IsAchievement: false, IsAbility: false },
    { Subject: "Genab", Index: 1, IsAchievement: false, IsAbility: true },
    { Subject: "Verbal", Index: 2, IsAchievement: false, IsAbility: true },
    { Subject: "NonVerbal", Index: 3, IsAchievement: false, IsAbility: true },
    { Subject: "MathReasoning", Index: 4, IsAchievement: false, IsAbility: true },
    { Subject: "MathPerformance", Index: 5, IsAchievement: true, IsAbility: false },
    { Subject: "Reading", Index: 6, IsAchievement: true, IsAbility: false },
    { Subject: "Writing", Index: 7, IsAchievement: true, IsAbility: false },
    { Subject: "Spelling", Index: 8, IsAchievement: true, IsAbility: false },
    { Subject: "Ravens", Index: 9, IsAchievement: false, IsAbility: true }
];

class Subject {
    index: number = 0;
    subject: string = "";
    isAchievement: boolean = false;
    isAbility: boolean = false;
}

class User {
    id: number;
    role: number;
    name: string;
    email: string;
    schools: Array<School>;
    currentSchool: School;
    isInternalUser: boolean;
    greeting = () => {
        return "Hi " + this.name;
    };
}

class School {
    id: number;
    name: string;
    scode: number;
    isMainSchool: boolean = false;

}

class TestFile {
    school: School = new School();
    fileNumber: number;
    grade: number;
    category: string;
    testDate: Date;
    testYear: number;
    studentCount: number;
    published: Date;
    subjectTypes: Array<Subject>[];
    students: Array<Student>;
    isUnisex: boolean;
    hasBoys: boolean = false;
    hasGirls: boolean = false;
    isCoopSchoolTest: boolean;


    description = () => {
        if (this.fileNumber === 1015049) {
            return this.fileNumber + " " + this.category + " Ravens";
        }
        return this.fileNumber + " " + this.category;
    };

    clear = () => {
        this.fileNumber = undefined;
        this.grade = undefined;
        this.category = undefined;
        this.testDate = undefined;
        this.testYear = undefined;
        this.studentCount = undefined;
        this.published = undefined;
        this.subjectTypes = [];
        this.students = [];
    };

    setStudents = (data: Array<any>) => {
        this.students = [];
        this.hasGirls = false;
        this.hasBoys = false;

        data.forEach((s: any) => {
            this.students.push(new Student(s));
            if (! this.hasBoys && s.Sex === "M") {
                this.hasBoys = true;
            }
            if (!this.hasGirls && s.Sex === "F") {
                this.hasGirls = true;
            }
        });

        this.studentCount = this.students.length;
        this.isUnisex = this.hasGirls && this.hasBoys;
    };
}

class RangeScore {
    range = () => {
        return this.low + "-" + this.high;
    };

    constructor(public low: number, public high: number) {}
}

class Score {
    constructor(public raw: number, public stanine: number,
        public scaledScore: number, public score: number, public range: RangeScore, public naplan: number) { }
}

class Student {
    studentId: number;
    commonId: number;
    name: string;
    sex: string;
    dob: Date;
    speak: string;
    liveInAus: string;
    ca: number;
    serialno: number;

    genab: Score;
    verbal: Score;
    nonverbal: Score;
    mathPerformance: Score;
    mathReasoning: Score;
    reading: Score;
    writing: Score;
    spelling: Score;
    raven: Score;

    constructor(r: any) {
        this.studentId = r.Id;
        this.commonId = r.GlobalStudentId;
        this.name = r.Name;
        this.sex = r.Sex;
        this.dob = r.Dob;
        this.speak = r.Speak;
        this.liveInAus = r.Live_in_as;
        this.ca = r.Ca;

        this.genab = new Score(r.Genab, r.Iqs, r.t_genab, r.Sgenab, new RangeScore(r.Iq1, r.Iq2), null);
        this.verbal = new Score(r.Verb, r.Vis, r.t_verbal, r.Sverb, new RangeScore(r.Vil, r.Vih), null);
        this.nonverbal = new Score(r.Nverb, r.Nvis, r.t_nverbal, r.Snverb, new RangeScore(r.Nvil, r.Nvih), null);
        this.mathPerformance = new Score(r.Prs, r.Pst, r.t_pst, r.Smath, null, r.NpiMath);
        this.reading = new Score(r.Rrs, r.Rst, r.t_rst, r.Sread, null, r.NpiRead);
        this.spelling = new Score(r.Srs, r.Sst, r.t_sst, r.Sspell, null, null);
        this.writing = new Score(r.Wrs, r.Wrt, r.t_wr, r.Swrit, null, r.NpiWrit);
        this.raven = new Score(r.Raven, r.Iqs2, r.Tmst, null, new RangeScore(r.Iq12, r.Iq22), null);

        this.serialno = r.snow;
    }

    overallAbilityScore = (): number => {
        var total = 0;
        total += this.genab.scaledScore ? this.genab.scaledScore : 0;
        total += this.mathPerformance.scaledScore ? this.mathPerformance.scaledScore : 0;
        total += this.reading.scaledScore ? this.reading.scaledScore : 0;
        total += this.writing.scaledScore ? this.writing.scaledScore : 0;
        return total;
    }
    mathsAchievementScore = (): number => {
        return this.mathPerformance.scaledScore ? this.mathPerformance.scaledScore : 0;
    }
    englishScore = (): number => {
        var total = 0;
        total += this.verbal.scaledScore ? this.verbal.scaledScore : 0;
        total += this.reading.scaledScore ? this.reading.scaledScore : 0;
        total += this.writing.scaledScore ? this.writing.scaledScore : 0;
        return total;
    }
}




