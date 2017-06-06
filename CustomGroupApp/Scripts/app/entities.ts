enum ReportType {
    None = 0,
    StudentResults = 1,
    SchoolStudentRecord = 2,
    NationalProgressIndex = 3,
    StudentMathsSkillsProfile = 4,
    StudentMathsSkillsProfileList = 5,
    StudentMathsSkillsProfileTable = 6,
    StudentReadingSkillsProfile = 7,
    StudentReadingSkillsProfileList = 8,
    StudentReadingSkillsProfileTable = 9,
    WritingCriteria = 10,
    StudentWritingCriteria = 11,
    StudentMarkedWritingScript = 12,
    StudentCareerProfile = 13,
    StudentDetails = 14,
    StudentPortfolio = 15
}

enum AnswerType {
    NotAttempted = 0,
    Correct = 1,
    Incorrect = 2
}

enum TestCategory {
    None = 0,
    Placement = 1,
    Scholarship = 2,
    GandT = 3,
    Nwpa = 4
}

enum MeanType {
    School = 0,
    State = 1,
    National = 2
}

enum TestType {
    Aas = 0,
    Naplan = 1
}

class TestInfo {
    testNumber: number;
    testDate: Date;
    testYear: number;
    grade: number;
    studentCount: number;
    type: TestType;
    category: TestCategory;
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
        return `Hi ${this.name}`;
    };
}

class School {
    id: number;
    name: string;
    scode: number;
    isMainSchool = false;
}

class WritingQuestion {
    title: string;
    description: string;
    code: string;
    answers: Array<string>;
    sampleDistributions: Array<number>;
    schoolAverage: number;

    constructor(writingQuestion: any) {
        this.title = writingQuestion.Title;
        this.description = writingQuestion.Description;
        this.code = writingQuestion.Code;
        this.answers = writingQuestion.Answers;
        this.sampleDistributions = writingQuestion.SampleDistributions;
    }
}

class Question {
    constructor(public seq: number,
        public description: string,
        public strand: string,
        public difficulty: string,
        public index: number) {

        this.expandDifficulty();
    }

    private expandDifficulty = () => {
        switch (this.difficulty) {
            case "L":
                this.difficulty = "Low";
                break;
            case "H":
                this.difficulty = "High";
                break;
            case "I":
                this.difficulty = "Intermediate";
                break;
        }
    }
}

class TestFile {
    school = new School();
    fileNumber: number;
    grade: number;
    semester: number;
    category: string;
    testDate: Date;
    testYear: number;
    studentCount: number;
    published: Date;
    students: Array<Student> = [];
    customGroups: Array<ClassDefinition> = [];
    testHistory: Array<TestInfo> = [];
    pastTestResults: Array<SubjectPerformanceScore> = [];

    // Flags
    hasBoys = false;
    hasGirls = false;
    isUnisex: boolean;
    isCoopSchoolTest: boolean;
    hasWritingCriteria: boolean;
    hasCustomGroups: boolean;
    hasStudentLanguagePrefs: boolean;
    hasCareerDetails: boolean;
    hasNaplanResults: boolean;
    hasMathsQuestions: boolean;
    hasReadingQuestions: boolean;
    hasStudentPastResults: boolean;
    hasPastTestResults: boolean;
    hasStudentIds: boolean;

    // Skill Profiles
    mathsQuestionSetId: number;
    readingQuestionSetId: number;
    mathsQuestions: Array<Question> = [];
    readingQuestions: Array<Question> = [];

    subjectsTested: Array<ISubject>;
    meanScores: Array<NaplanMeanScore> = [];
    stanineTables = new StanineTables();
    allSubjects = new Array<SubjectInfo>();
    writingCriteria = new WritingCriteria();

    displayTestDate: string;
    get yearLevel(): string {
        return `${this.grade} / ${this.testYear}`;
    }
    description = () => {
        if (this.fileNumber === 1015049) {
            return this.fileNumber + " " + this.category + " Ravens";
        }
        return this.fileNumber + " " + this.category;
    };

    set = (test: any, school: any, results: any, languages: any, customGroupSets: any = [],
        stanineTables: any, testHistory: any) => {

        this.clear();
        this.initSubjects(test);

        this.fileNumber = test.Testnum;
        this.grade = test.Grade;
        this.category = test.Category;
        this.testDate = new Date(parseInt(test.Testdate.substr(6)));
        this.testYear = this.testDate.getFullYear();
        this.mathsQuestionSetId = test.MathProfileId;
        this.readingQuestionSetId = test.ReadProfileId;
        this.setStudents(results, languages);
        this.setStudentLanguagePrefs(languages, this.students);
        this.setCustomGroups(customGroupSets, this.students);
        this.stanineTables.setStanines(stanineTables);
        this.setTestHistory(testHistory);
        if (school) {
            this.school.name = school.Name;
            this.school.id = school.Id;
            this.school.scode = test.Scode;
            this.school.isMainSchool = school.IsMainSchool;
        }


    }

    initSubjects(test: any) {
        this.allSubjects = [];
        this.allSubjects.push(new SubjectInfo(null, 0, 0, false, false));
        this.allSubjects.push(new SubjectInfo(new GenabSubject(), 1, test.Nq_genab, false, true));
        this.allSubjects.push(new SubjectInfo(new VerbalSubject(), 2, test.Nq_verbal, false, true));
        this.allSubjects.push(new SubjectInfo(new NonVerbalSubject(), 3, test.Nq_nonverb, false, true));
        this.allSubjects.push(new SubjectInfo(new RavenSubject(), 9, 60, false, true));
        this.allSubjects.push(new SubjectInfo(new MathReasoningSubject(), 4, test.Type === "2" ? 34 : 35, false, true));
        this.allSubjects.push(new SubjectInfo(new MathPerformanceSubject(), 5, test.Nq_maths, true, false));
        this.allSubjects.push(new SubjectInfo(new ReadingSubject(), 6, test.Nq_read, true, false));
        this.allSubjects.push(new SubjectInfo(new SpellingSubject(), 7, test.Nq_spell, true, false));
        this.allSubjects.push(new SubjectInfo(new WritingSubject(), 8, 35, true, false));
    }

    clear = () => {
        this.fileNumber = undefined;
        this.grade = undefined;
        this.category = undefined;
        this.testDate = undefined;
        this.testYear = undefined;
        this.studentCount = undefined;
        this.published = undefined;
        this.students = [];
        this.meanScores = [];
        this.hasWritingCriteria = false;
        this.hasStudentLanguagePrefs = false;
        this.hasNaplanResults = false;
        this.hasMathsQuestions = false;
        this.hasReadingQuestions = false;
        this.hasCareerDetails = false;
        this.hasPastTestResults = false;
        this.hasBoys = false;
        this.hasGirls = false;
        this.isCoopSchoolTest = false;
        this.customGroups = [];
    };

    setCareerDetails = (items: any) => {
        const studentLookup = Enumerable.From(this.students).ToDictionary(s => s.studentId, s => s);
        for (let item of items) {
            if (studentLookup.Contains(item.Id)) {
                const student = studentLookup.Get(item.Id);
                student.careers.careers = Enumerable.From(item.StudentCareers).Select(s => new Career(s)).ToArray();
                student.careers.careerAwareness = item.CareerAwareness;
                student.workCharacteristics = Enumerable.From(item.WorkCharacteristics)
                    .Select(s => new WorkCharacteristic(s)).ToArray();
            }
        }
        this.hasCareerDetails = true;
    }

    setWritingCriterias = (writingTask: string, writingScores: any, writingQuestions: any, schoolScoreDistributions: any) => {
        this.writingCriteria.clear();
        const studentLookup = Enumerable.From(this.students).ToDictionary(s => s.studentId, s => s);
        for (let score of writingScores) {
            if (studentLookup.Contains(score.StudentId)) {
                studentLookup.Get(score.StudentId).writingCriteria = new StudentWritingCriteria(score);
            }
        }

        const questions = new Array<WritingQuestion>();
        for (let wq of  writingQuestions) {
            questions.push(new WritingQuestion(wq));
        }
        const lookup = Enumerable.From(questions).ToDictionary(x => x.code, x => x);
        for (let code of writingTask === "P" ? this.writingCriteria.persuasiveQuestionsOrder : this.writingCriteria.narativeQuestionsOrder)
        {
            if (lookup.Contains(code)) {
                this.writingCriteria.questions.push(lookup.Get(code));
            } else {
                this.writingCriteria.questions.push(new WritingQuestion({
                    Code: code,
                    Title: "Unknown",
                    Description: "",
                    Asnwers: [],
                    SampleDistributions: []
                }));
            }
        }

        for (let i = 0; i < questions.length; i++) {
            questions[i].schoolAverage = Enumerable.From(this.students).Average(s => s.writingCriteria.scores[i]);
        }

        this.hasWritingCriteria = true;
    }

    setNaplanResults = (data: any) => {
        const tmpNaplanResults = new Array<NaplanScore>();
        for (let i = 0; i < data.NaplanResults.length; i++) {
            tmpNaplanResults.push(new NaplanScore(data.NaplanResults[i]));
        }
        const naplanResults = Enumerable.From(tmpNaplanResults).GroupBy(s => s.studentId).ToArray();
        const studentLookup = Enumerable.From(this.students).ToDictionary(s => s.studentId, s => s);
        for (let g of naplanResults) {
            if (studentLookup.Contains(g.Key())) {
                studentLookup.Get(g.Key()).naplanResults = g.source;
            }    
        }

        this.meanScores = [];
        for (let i = 0; i < data.MeanScores.length; i++) {
            const meanScore = new NaplanMeanScore();
            meanScore.type = data.MeanScores[i].TestType;
            meanScore.source = data.MeanScores[i].Source;
            meanScore.year = data.MeanScores[i].Year;
            meanScore.testNumber = data.MeanScores[i].TestNumber;
            meanScore.reading = data.MeanScores[i].Reading;
            meanScore.numeracy = data.MeanScores[i].Numeracy;
            meanScore.writing = data.MeanScores[i].Writing;

            this.meanScores.push(meanScore);
        }
        this.hasNaplanResults = true;
    }

    setTestHistory = (data: any) => {
        this.testHistory = [];
        if (!data) {
            return;
        }
        for (let item of data) {
            const testInfo = new TestInfo();
            testInfo.testNumber = item.TestNumber;
            testInfo.testYear = item.TestYear;
            testInfo.category = item.TestNumber;
            testInfo.type = item.Source;
            testInfo.grade = item.Grade;
            testInfo.studentCount = item.Tested;
            this.testHistory.push(testInfo);
        }
    }

    setPastTestResults = (data: any) => {
        this.pastTestResults = [];
        for (let item of data) {
            const result = new SubjectPerformanceScore(item.Subject, item.TestNumber, item.TestDate);
            result.lowCount = item.LowCount;
            result.lowPct = item.LowPct;
            result.avgCount = item.AvgCount;
            result.avgPct = item.AvgPct;
            result.highCount = item.HighCount;
            result.highPct = item.HighPct;
            this.pastTestResults.push(result);
        }
        this.hasPastTestResults = true;
    }

    setCustomGroups = (data: any, students: Array<Student>) => {
        if (students === null) {
            students = this.students;
        }
        this.customGroups = [];
        var studentDict = Enumerable.From(students).ToDictionary(x => x.studentId, x => x);
        for (let item of data) {
            if (item.GroupSetId > 0) {
                const classItem = new ClassDefinition(null, 0, 0);
                for (let id of item.Students) {
                    if (studentDict.Contains(id)) {
                        classItem.students.push(new StudentClass(studentDict.Get(id)));
                    }
                }
                classItem.count = classItem.students.length;
                classItem.name = item.Name;
                classItem.groupSetid = item.GroupSetId;
                classItem.streamType = item.Streaming;
                this.customGroups.push(classItem);
            }
        }

        this.hasCustomGroups = this.customGroups.length > 0;
    }

    addCustomGroup = (item: any): ClassDefinition => {
        var studentDict = Enumerable.From(this.students).ToDictionary(x => x.studentId, x => x);
        const classItem = new ClassDefinition(null, 0, 0);
        for (let id of item.Students) {
            if (studentDict.Contains(id)) {
                classItem.students.push(new StudentClass(studentDict.Get(id)));
            }
        }
        classItem.count = classItem.students.length;
        classItem.name = item.Name;
        classItem.groupSetid = item.GroupSetId;
        classItem.streamType = item.Streaming;
        this.customGroups.push(classItem);
        return classItem;
    }

    setStudentLanguagePrefs = (langPrefs: Array<any>, students: Array<Student> = null) => {
        if (!langPrefs || langPrefs.length === 0) {
            return;
        }
        if (!students) {
            students = this.students;
        }
        var enumerable = Enumerable.From(langPrefs);

        students.forEach((student: Student) => {
            var languagePrefs = enumerable.FirstOrDefault(null, s => s.StudentId === student.studentId);

            if (languagePrefs != null) {
                if (languagePrefs.Pref1) {
                    student.languagePrefs.push(languagePrefs.Pref1);
                }
                if (languagePrefs.Pref2) {
                    student.languagePrefs.push(languagePrefs.Pref2);
                }
                if (languagePrefs.Pref3) {
                    student.languagePrefs.push(languagePrefs.Pref3);
                }
            }
        });

        this.hasStudentLanguagePrefs = true;
    }

    setSchoolGroup = (studentGroups: Array<any>, students: Array<Student> = null) => {
        if (!studentGroups || studentGroups.length === 0) {
            return;
        }
        if (!students) {
            students = this.students;
        }
        var lookup = Enumerable.From(studentGroups).ToDictionary(x => x.StudentId, x => x.Group);

        students.forEach((student: Student) => {
            if (lookup.Contains(student.studentId)) {
                student.schoolGroup = lookup.Get(student.studentId);
            } else {
                student.schoolGroup = "";
            }
        });
    }

    setMathsQuestions = (data: any) => {
        this.mathsQuestions = [];
        for (let q of data) {
            this.mathsQuestions.push(new Question(q.QuestionNo, q.Description, q.Strand, q.Difficulty, q.StrandIndex));
        }
        this.hasMathsQuestions = true;
    }
    setReadingQuestions = (data: any) => {
        this.readingQuestions = [];
        for (let q of data) {
            this.readingQuestions.push(new Question(q.QuestionNo, q.Description, q.Strand, q.Difficulty, q.StrandIndex));
        }
        this.hasReadingQuestions = true;
    }
    setStudents = (data: Array<any>, langPrefs: Array<any> = []) => {
        this.students = [];
        this.hasGirls = false;
        this.hasBoys = false;
        this.hasStudentLanguagePrefs = langPrefs && langPrefs.length > 0;
        var enumerable = Enumerable.From(langPrefs);

        Enumerable.From(data).OrderBy(x=>x.Name).ForEach((s: any) => {
            const student = new Student(s);
            this.students.push(student);
            if (! this.hasBoys && s.Sex === "M") {
                this.hasBoys = true;
            }
            if (!this.hasGirls && s.Sex === "F") {
                this.hasGirls = true;
            }
            if (this.hasStudentLanguagePrefs) {
                var languagePrefs = enumerable.FirstOrDefault(null, s => s.StudentId === student.studentId);
                if (languagePrefs != null) {
                    if (languagePrefs.Pref1) {
                        student.languagePrefs.push(languagePrefs.Pref1);
                    }
                    if (languagePrefs.Pref2) {
                        student.languagePrefs.push(languagePrefs.Pref2);
                    }
                    if (languagePrefs.Pref3) {
                        student.languagePrefs.push(languagePrefs.Pref3);
                    }
                }
            }
        });

        this.hasStudentIds = Enumerable.From(this.students).Any(s => s.schoolStudentId !== "");
        this.studentCount = this.students.length;
        this.isUnisex = this.hasGirls && this.hasBoys;

        this.subjectsTested = [];
        const sampleStudents = Enumerable.From(this.students).Take(30).ToArray();
        for (let item of this.allSubjects) {
            if (!item.subject) {
                continue;
            }
            if (Enumerable.From(sampleStudents).Count(student => {
                var score = item.subject.getScore(student);
                if (! score) {
                    return false;
                }
                    return score.stanine ? score.stanine > 1 : false;
                }
            ) > 5) {
                item.subject.isTested = true;
                item.subject.summary.set(this.students);
                this.subjectsTested.push(item.subject);

            }
        }
    };

    filterTestByGroup = (classItem: ClassDefinition): Array<Student> => {
        return this.filterTest(Enumerable.From(classItem.students).Select(s => s.studentId).ToArray());
    }

    filterByGender = (gender: Gender): Array<Student> => {
        if (!this.students || this.students.length === 0) {
            return [];
        }

        if (gender === Gender.Girls) {
            return Enumerable.From(this.students).Where(s => s.sex === "F").ToArray();
        }
        if (gender === Gender.Boys) {
            return Enumerable.From(this.students).Where(s => s.sex === "M").ToArray();
        }
        return this.students;
    }

    filterTest = (filtered: Array<number>): Array<Student> => {
        if (! this.students || this.students.length === 0) {
            return [];
        }
        const studentFilter = Enumerable.From(filtered).ToDictionary(x => x, x => x);
        return Enumerable.From(this.students).Where(s => studentFilter.Contains(s.studentId)).ToArray();
    }
}

class RangeScore {
    range = () => {
        return this.low + "-" + this.high;
    };

    get mid(): number {
        return (this.high + this.low) / 2;
    }
    constructor(public low: number, public high: number) {}
}

class NaplanMeanScore {
    type: MeanType;
    year: number;
    testNumber: number;
    source: TestType;
    numeracy: number;
    reading: number;
    writing: number;  
}

class NaplanScore {
    studentId: number;
    testNumber: number;
    source: TestType;
    grade: number;
    testDate: Date;
    testYear: number;
    numeracy: number;
    reading: number;
    writing: number;
    constructor(data: any) {
        this.set(data);
    }

    set = (data: any) => {
        this.studentId = data.Id;
        this.testNumber = data.TestNumber;
        this.source = data.Source;
        this.grade = data.Grade;
        this.testYear = data.TestYear;
        this.testDate = data.TestDate ? new Date(parseInt(data.TestDate.substr(6))) : undefined;
        this.numeracy = data.Numeracy;
        this.reading = data.Reading;
        this.writing = data.Writing;
    }
}

class StudentAnswer {
    seq: number;
    description: string;
    strand: string;
    difficulty: string;
    index: number;

    constructor(public question: Question, public answer: AnswerType) {
        this.seq = question.seq;
        this.description = question.description;
        this.strand = question.strand;
        this.difficulty = question.difficulty;
        this.index = question.index;
    }
}

class StrandSummary {
    count: number;
    correctAnswers = 0;
    incorrectAnswers = 0;
    attemptedQuestions = 0;
    notAttemptedQuestions = 0;
    index = 0;
    studentAnswers: Array<StudentAnswer> = [];

    constructor(public strand: string, studentAnswers: Array<StudentAnswer>) {
        this.studentAnswers = studentAnswers;
        this.count = studentAnswers.length;
        this.index = studentAnswers.length > 0 ? studentAnswers[0].index : 0;

        for (let s of studentAnswers) {
            if (s.answer === AnswerType.Correct) {
                this.correctAnswers++;
                this.attemptedQuestions++;
            }
            if (s.answer == AnswerType.Incorrect) {
                this.incorrectAnswers++;
                this.attemptedQuestions++;
            }
            if (s.answer == AnswerType.NotAttempted) {
                this.notAttemptedQuestions++;
            }
        }
    }
}

class WritingCriteria {
    taskType: string;
    questions = new Array<WritingQuestion>();
    schoolScoreDistributions = new Array<number>();

    narativeQuestionsOrder = ["WRNARDEV", "WRTHMDEV", "WRVOCAB", "WRSENSTR", "WRSYNTEN", "WRPUNCT", "WRSPELL"];
    persuasiveQuestionsOrder = ["WRGENRE", "WRARGS", "WRRHTDEV", "WRSENSTR", "WRSYNTEN", "WRPUNCT", "WRSPELL"];

    clear = () => {
        this.taskType = undefined;
        this.questions = [];
        this.schoolScoreDistributions = [];
    }
}

class StudentWritingCriteria {
    scores: Array<number>;
    serialno: number;
    hasMarkedWritingScript: boolean;
    markedWritingScriptFile: string;

    constructor(data: any) {
        this.scores = [];
        this.scores.push(data.Score1);
        this.scores.push(data.Score2);
        this.scores.push(data.Score3);
        this.scores.push(data.Score4);
        this.scores.push(data.Score5);
        this.scores.push(data.Score6);
        this.scores.push(data.Score7);
        this.hasMarkedWritingScript = data.HasWritingScript,
            this.markedWritingScriptFile = data.WritingScript,
        this.serialno = data.Serialno;
    }
}

class Career {
    code: string;
    description: string;
    value: number;
    notes: string;
    constructor(data: any) {
        this.code = data.CareerCode;
        this.description = data.Description;
        this.value = data.Value;
        this.notes = this.getNotes(this.description);
    }

    private getNotes = (desc: string): string => {
        switch (desc) {
            case "Realistic":
                return "Work which is generally manual or practical.";

            case "Investigative":
                return "Work which involves mathematics, science or research.";

            case "Artistic":
                return "Work which is creative and artistic.";

            case "Social":
                return "Work which is involves a lot of personal contact.";

            case "Enterprising":
                return "Work which has an emphasis on business and sales.";

            case "Conventional":
                return "Work which is administrative or clerical.";
        }
        return "Unknown Type";
    }
}

class StudentCareer {
    // ReSharper disable once InconsistentNaming
    private _careers = new Array<Career>();

    get careers(): Array<Career> {
        return this._careers;
    };
    set careers(val: Array<Career>) {
        this._careers = val;
        this.hasCareerData = (val && val.length > 0 && val[0].value > 0);
    }

    careerAwareness: string;
    hasCareerData: boolean;

    getCareerPrefs = (): Array<Career> => {
        if (! this.careerPrefs) {
            this.careerPrefs = Enumerable.From(this.careers).OrderByDescending(x => x.value).Take(3).ToArray();
        }
        return this.careerPrefs;
    }


    private careerPrefs: Array<Career>;

}

class WorkCharacteristic {
    code: number;
    description: string;
    value: number;
    constructor(data: any) {
        this.code = data.WorkCharacteristicType;
        this.value = data.Value;
        this.description = this.convertCode(this.code);
    }

    private convertCode = (code: number): string => {
        switch (code) {
            case 1:
                return "Management";
            case 2:
                return "Independence";
            case 3:
                return "JobSecurity";
            case 4:
                return "SelfDevelopment";
           
        }
        return "Unknown Type";
    }
}


class ScoreProfile {
    count = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    attemptedQuestions = 0;
    notAttemptedQuestions = 0;
    answers: Array<AnswerType> = [];
    hasProfile = false;

    constructor(answers: string) {
        if (answers) {
            this.hasProfile = true;
            for (let i = 0; i < answers.length; i++) {
                if (answers[i] === ".") {
                    this.notAttemptedQuestions++;
                    this.answers.push(AnswerType.NotAttempted);
                } else {
                    this.attemptedQuestions++;
                    if (answers[i] === "*") {
                        this.answers.push(AnswerType.Correct);
                        this.correctAnswers++;
                    } else {
                        this.answers.push(AnswerType.Incorrect);
                        this.incorrectAnswers++;
                    }
                }
                this.count++;
            }
        }
    }

    getStudentAnswers = (questions: Array<Question>): Array<StudentAnswer> => {
        var studentAnswers = new Array<StudentAnswer>();
        for (let q of questions) {
            const index = q.seq - 1;
            const answer = index < this.answers.length ? this.answers[index] : AnswerType.NotAttempted;
            studentAnswers.push(new StudentAnswer(q, answer));
        }
        return studentAnswers;
    }

    getStrandSummary = (studentAnswers: Array<StudentAnswer>): Array<StrandSummary> => {
        return Enumerable.From(studentAnswers)
            .GroupBy(s => s.strand)
            .Select(strand => new StrandSummary(strand.Key(), strand.source))
            .ToArray();
    }

}

class Score {
    scoreProfile : ScoreProfile;
  
    constructor(public raw: number,
        public stanine: number,
        public scaledScore: number,
        public score: number,
        public range: RangeScore,
        public naplan: number,
        public answers: string) {

        this.scoreProfile = new ScoreProfile(answers);
    }
}

class Student {
    studentId: number;
    schoolStudentId: string;
    commonId: number;
    name: string;
    sex: string;
    dob: Date;
    speak: string;
    liveInAus: string;
    bornInAus: string;
    ca: number;
    serialno: number;
    notes: string;

    genab: Score;
    verbal: Score;
    nonverbal: Score;
    mathPerformance: Score;
    mathReasoning: Score;
    mathQr: Score;
    reading: Score;
    writing: Score;
    spelling: Score;
    raven: Score;
    writingCriteria: StudentWritingCriteria;
    careers = new StudentCareer();
    workCharacteristics: Array<WorkCharacteristic> = [];
    schoolGroup: string;
    naplanResults: Array<NaplanScore> = [];
    languagePrefs: Array<string> = [];

    get hasLanguagePrefs(): boolean {
        return this.languagePrefs && this.languagePrefs.length > 0;
    }
    get hasSchoolStudentId(): boolean {
        return this.schoolStudentId && this.schoolStudentId !== "";
    }

    constructor(r: any) {
        this.studentId = r.Id;
        this.commonId = r.GlobalStudentId;
        this.schoolStudentId = r.Student_id;
        this.name = r.Name;
        this.sex = r.Sex;
        this.dob = new Date(parseInt(r.Dob.substr(6)));
        this.speak = this.languageSpeak(r.Speak);
        this.liveInAus = this.liveInAust(r.Live_in_as);
        this.bornInAus = this.bornInAust(r.Live_in_as);
        this.ca = r.Ca;
        this.notes = r.Notes;

        this.genab = new Score(r.Genab, r.Iqs, r.T_genab, r.S_genab, new RangeScore(r.Iq1, r.Iq2), null, r.Genabcor);
        this.verbal = new Score(r.Verb, r.Vis, r.T_verbal, r.S_verbal, new RangeScore(r.Vil, r.Vih), null, null);
        this.nonverbal = new Score(r.Nverb, r.Nvis, r.T_nverbal, r.S_nonverb, new RangeScore(r.Nvil, r.Nvih), null, null);
        this.mathPerformance = new Score(r.Prs, r.Pst, r.T_pst, r.S_mathper, null, r.Npi_Math, r.Mathcor);
        this.mathQr = new Score(r.Qr, null, null, null, null, null, null);
        this.reading = new Score(r.Rrs, r.Rst, r.T_rst, r.S_reading, null, r.Npi_Read, r.Readcor);
        this.spelling = new Score(r.Srs, r.Sst, r.T_sst, r.S_spelling, null, null, r.Spellcor);
        this.writing = new Score(r.NewWr, r.Wrt, r.T_wr, r.S_written, null, r.Npi_Writing, null);
        this.writing.scoreProfile.correctAnswers = r.NewWr;
        this.raven = new Score(r.Raven, r.Iqs2, r.T_mst, null, new RangeScore(r.Iq12, r.Iq22), null, new Array(65 + 1).join(" "));

        this.serialno = r.Serialno;
        this.schoolGroup = "";
    }

    get dobString(): string {
        return kendo.toString(this.dob, "d");
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
    mathsAchievemenQrScore = (): number => {
        var total = 0;
        total += this.mathPerformance.raw ? this.mathPerformance.raw : 0;
        total += this.mathQr.raw ? this.mathQr.raw : 0;
        return total;
    }


    englishScore = (): number => {
        var total = 0;
        total += this.verbal.scaledScore ? this.verbal.scaledScore : 0;
        total += this.reading.scaledScore ? this.reading.scaledScore : 0;
        total += this.writing.scaledScore ? this.writing.scaledScore : 0;
        return total;
    }


    private liveInAust = (val: string, shortDesc = false): string => {
        if (! val) {
            return "";
        }

        const years = parseInt(val);
        switch (years) {
        case 1:
            return shortDesc ? "< 2" : "Less than 2 years";

        case 3:
            return shortDesc ? "< 4" : "Less than 4 years";

        case 5:
            return shortDesc ? "< 6" : "Less than 6 years";

        case 7:
            return shortDesc ? "> 6" : "More than 6 years";
        default:
            return "";
        }
    }

    private bornInAust = (val: string): string => {
        if (! val) {
            return "Yes";
        }

        const years = parseInt(val);
        return years === 0 ? "Yes" : "No";
    }

    private languageSpeak = (speak: string, shortDesc = true): string => {
        if (!speak) {
            return "";
        }

        switch (speak) {
        case "A":
            return shortDesc ? "Always" : "Always Spoken";

        case "S":
            return shortDesc ? "Sometimes" : "Sometimes Spoken";

        default:
            return shortDesc ? "" : "Never Spoken";
        }
    }
}