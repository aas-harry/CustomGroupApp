class SubjectInfo {
    constructor(public subject: ISubject,
        public index: number,
        public isAchievement: boolean,
        public isAbility: boolean) {
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
    subject: SubjectType;
    getScore(student: Student);
    isTested: boolean;
    hasRangeScore: boolean;
    hasNaplanScore: boolean;
    hasCorrelationScore: boolean;
}

class GenabSubject implements ISubject{
    getScore = (student: Student): Score => {
        return student.genab;
    }

    name = "General Reasoning";
    subject = SubjectType.Genab;
    hasRangeScore = true;
    hasNaplanScore = false;
    hasCorrelationScore = true;
    isTested = false;
}

class VerbalSubject implements ISubject {
    getScore = (student: Student): Score => {
        return student.verbal;
    }

    name = "Verbal Reasoning";
    subject = SubjectType.Verbal;
    hasRangeScore = true;
    hasNaplanScore = false;
    hasCorrelationScore = true;
    isTested = false;
}

class NonVerbalSubject implements ISubject {
    getScore = (student: Student): Score => {
        return student.verbal;
    }

    name = "Non Verbal Reasoning";
    subject = SubjectType.NonVerbal;
    hasRangeScore = true;
    hasNaplanScore = false;
    hasCorrelationScore = true;
    isTested = false;
}

class MathReasoningSubject implements ISubject {
    getScore = (student: Student): Score => {
        return student.mathReasoning;
    }

    name = "Maths Reasoning";
    subject = SubjectType.MathReasoning;
    hasRangeScore = false;
    hasNaplanScore = true;
    hasCorrelationScore = true;
    isTested = false;
}

class MathPerformanceSubject implements ISubject {
    getScore = (student: Student): Score => {
        return student.mathPerformance;
    }

    name = "Maths Performance";
    subject = SubjectType.MathPerformance;
    hasRangeScore = false;
    hasNaplanScore = true;
    hasCorrelationScore: boolean = false;
    isTested = false;
}

class ReadingSubject implements ISubject {
    getScore = (student: Student): Score => {
        return student.reading;
    }

    name = "Reading Comprehension";
    subject = SubjectType.Reading;
    hasRangeScore = false;
    hasNaplanScore = true;
    hasCorrelationScore = false;
    isTested = false;
}

class SpellingSubject implements ISubject {
    getScore = (student: Student): Score => {
        return student.spelling;
    }

    name = "Spelling";
    subject = SubjectType.Spelling;
    hasRangeScore = false;
    hasNaplanScore = false;
    hasCorrelationScore = false;
    isTested = false;
}

class WritingSubject implements ISubject {
    getScore = (student: Student): Score => {
        return student.writing;
    }

    name = "Writing Comprehension";
    subject = SubjectType.Writing;
    hasRangeScore = false;
    hasNaplanScore = true;
    hasCorrelationScore = false;
    isTested = false;
}

class RavenSubject implements ISubject {
    getScore = (student: Student): Score => {
        return student.raven;
    }

    name = "Ravens SPM";
    subject = SubjectType.Ravens;
    hasRangeScore = false;
    hasNaplanScore = true;
    hasCorrelationScore = false;
    isTested = false;
}