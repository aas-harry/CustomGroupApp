class SubjectInfo {
    constructor(public subject: ISubject,
        public index: number,
        public count: number,
        public isAchievement: boolean,
        public isAbility: boolean) {
        if (subject) {
            subject.count = count;
        }
    }
}

class SubjectSummary {
    subject: ISubject;
    stanineAverage: number;
    rawScoreAverage: number;
    naplanAverage: number;

    constructor(subject: ISubject) {
        this.subject = subject;
    }

    set = (students: Array<Student>) => {
        var scores = Enumerable.From(students).Select(s => this.subject.getScore(s)).ToArray();
        this.stanineAverage = Enumerable.From(scores).Average(s => s.stanine);
        this.rawScoreAverage = Enumerable.From(scores).Average(s => this.subject.getRawScore(s));

        if (this.subject.hasNaplanScore) {
            this.naplanAverage = Enumerable.From(scores).Average(s => s.naplan);
        }
    }
}

enum SubjectType {
    Unknown = 0,
    Genab = 1,
    Verbal = 2,
    NonVerbal = 3,
    MathReasoning = 4,
    MathPerformance = 5,
    Reading = 6,
    Writing = 7,
    Spelling = 8,
    Ravens = 9,
    MathQr = 10
}

interface ISubject {
    name: string;
    count: number;
    subject: SubjectType;
    summary: SubjectSummary;
    getScore(student: Student): Score;
    getRawScore(score: Score): number;
    isTested: boolean;
    hasRangeScore: boolean;
    hasNaplanScore: boolean;
    hasCorrelationScore: boolean;
}


class GenabSubject implements ISubject{
    getScore = (student: Student): Score => {
        return student.genab;
    }

    getRawScore = (score: Score): number => {
        return score.range.mid;
    }

    name = "General Reasoning";
    count = 0;
    subject = SubjectType.Genab;
    
    hasRangeScore = true;
    hasNaplanScore = false;
    hasCorrelationScore = true;
    isTested = false;
    summary = new SubjectSummary(this);
}

class VerbalSubject implements ISubject {
    getScore = (student: Student): Score => {
        return student.verbal;
    }

    name = "Verbal Reasoning";
    count = 0;
    subject = SubjectType.Verbal;
    getRawScore = (score: Score): number => {
        return score.range.mid;
    }
    hasRangeScore = true;
    hasNaplanScore = false;
    hasCorrelationScore = true;
    isTested = false;
    summary = new SubjectSummary(this);
}

class NonVerbalSubject implements ISubject {
    getScore = (student: Student): Score => {
        return student.nonverbal;
    }

    name = "Non Verbal Reasoning";
    count = 0;
    getRawScore = (score: Score): number => {
        return score.range.mid;
    }
    subject = SubjectType.NonVerbal;
    hasRangeScore = true;
    hasNaplanScore = false;
    hasCorrelationScore = true;
    isTested = false;
    summary = new SubjectSummary(this);
}

class MathReasoningSubject implements ISubject {
    getScore = (student: Student): Score => {
        return student.mathReasoning;
    }

    getRawScore = (score: Score): number => {
        return score.range.mid;
    }
    name = "Maths Reasoning";
    count = 0;
    subject = SubjectType.MathReasoning;
    hasRangeScore = false;
    hasNaplanScore = true;
    hasCorrelationScore = true;
    isTested = false;
    summary = new SubjectSummary(this);
}

class MathPerformanceSubject implements ISubject {
    getScore = (student: Student): Score => {
        return student.mathPerformance;
    }

    name = "Maths Performance";
    count = 0;
    getRawScore = (score: Score): number => {
        return score.raw;
    }
    subject = SubjectType.MathPerformance;
    hasRangeScore = false;
    hasNaplanScore = true;
    hasCorrelationScore: boolean = false;
    isTested = false;
    summary = new SubjectSummary(this);
}

class ReadingSubject implements ISubject {
    getScore = (student: Student): Score => {
        return student.reading;
    }

    name = "Reading Comprehension";
    count = 0;
    getRawScore = (score: Score): number => {
        return score.raw;
    }
    subject = SubjectType.Reading;
    hasRangeScore = false;
    hasNaplanScore = true;
    hasCorrelationScore = false;
    isTested = false;
    summary = new SubjectSummary(this);
}

class SpellingSubject implements ISubject {
    getScore = (student: Student): Score => {
        return student.spelling;
    }

    name = "Spelling";
    count = 0;
    getRawScore = (score: Score): number => {
        return score.raw;
    }
    subject = SubjectType.Spelling;
    hasRangeScore = false;
    hasNaplanScore = false;
    hasCorrelationScore = false;
    isTested = false;
    summary = new SubjectSummary(this);
}

class WritingSubject implements ISubject {
    getScore = (student: Student): Score => {
        return student.writing;
    }

    name = "Writing Comprehension";
    count = 0;
    getRawScore = (score: Score): number => {
        return score.raw;
    }
    subject = SubjectType.Writing;
    hasRangeScore = false;
    hasNaplanScore = true;
    hasCorrelationScore = false;
    isTested = false;
    summary = new SubjectSummary(this);
}

class RavenSubject implements ISubject {
    getScore = (student: Student): Score => {
        return student.raven;
    }

    name = "Ravens SPM";
    getRawScore = (score: Score): number => {
        return score.raw;
    }
    count = 0;
    subject = SubjectType.Ravens;
    hasRangeScore = false;
    hasNaplanScore = true;
    hasCorrelationScore = false;
    isTested = false;
    summary = new SubjectSummary(this);
}