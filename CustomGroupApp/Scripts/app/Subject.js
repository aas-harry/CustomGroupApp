var SubjectInfo = (function () {
    function SubjectInfo(subject, index, isAchievement, isAbility) {
        this.subject = subject;
        this.index = index;
        this.isAchievement = isAchievement;
        this.isAbility = isAbility;
    }
    return SubjectInfo;
}());
var SubjectType;
(function (SubjectType) {
    SubjectType[SubjectType["Unknown"] = 0] = "Unknown";
    SubjectType[SubjectType["Genab"] = 1] = "Genab";
    SubjectType[SubjectType["Verbal"] = 2] = "Verbal";
    SubjectType[SubjectType["NonVerbal"] = 3] = "NonVerbal";
    SubjectType[SubjectType["MathReasoning"] = 4] = "MathReasoning";
    SubjectType[SubjectType["MathPerformance"] = 5] = "MathPerformance";
    SubjectType[SubjectType["Reading"] = 6] = "Reading";
    SubjectType[SubjectType["Writing"] = 7] = "Writing";
    SubjectType[SubjectType["Spelling"] = 8] = "Spelling";
    SubjectType[SubjectType["Ravens"] = 9] = "Ravens";
    SubjectType[SubjectType["MathQr"] = 10] = "MathQr";
})(SubjectType || (SubjectType = {}));
var GenabSubject = (function () {
    function GenabSubject() {
        this.getScore = function (student) {
            return student.genab;
        };
        this.name = "General Reasoning";
        this.subject = SubjectType.Genab;
        this.hasRangeScore = true;
        this.hasNaplanScore = false;
        this.hasCorrelationScore = true;
        this.isTested = false;
    }
    return GenabSubject;
}());
var VerbalSubject = (function () {
    function VerbalSubject() {
        this.getScore = function (student) {
            return student.verbal;
        };
        this.name = "Verbal Reasoning";
        this.subject = SubjectType.Verbal;
        this.hasRangeScore = true;
        this.hasNaplanScore = false;
        this.hasCorrelationScore = true;
        this.isTested = false;
    }
    return VerbalSubject;
}());
var NonVerbalSubject = (function () {
    function NonVerbalSubject() {
        this.getScore = function (student) {
            return student.verbal;
        };
        this.name = "Non Verbal Reasoning";
        this.subject = SubjectType.NonVerbal;
        this.hasRangeScore = true;
        this.hasNaplanScore = false;
        this.hasCorrelationScore = true;
        this.isTested = false;
    }
    return NonVerbalSubject;
}());
var MathReasoningSubject = (function () {
    function MathReasoningSubject() {
        this.getScore = function (student) {
            return student.mathReasoning;
        };
        this.name = "Maths Reasoning";
        this.subject = SubjectType.MathReasoning;
        this.hasRangeScore = false;
        this.hasNaplanScore = true;
        this.hasCorrelationScore = true;
        this.isTested = false;
    }
    return MathReasoningSubject;
}());
var MathPerformanceSubject = (function () {
    function MathPerformanceSubject() {
        this.getScore = function (student) {
            return student.mathPerformance;
        };
        this.name = "Maths Performance";
        this.subject = SubjectType.MathPerformance;
        this.hasRangeScore = false;
        this.hasNaplanScore = true;
        this.hasCorrelationScore = false;
        this.isTested = false;
    }
    return MathPerformanceSubject;
}());
var ReadingSubject = (function () {
    function ReadingSubject() {
        this.getScore = function (student) {
            return student.reading;
        };
        this.name = "Reading Comprehension";
        this.subject = SubjectType.Reading;
        this.hasRangeScore = false;
        this.hasNaplanScore = true;
        this.hasCorrelationScore = false;
        this.isTested = false;
    }
    return ReadingSubject;
}());
var SpellingSubject = (function () {
    function SpellingSubject() {
        this.getScore = function (student) {
            return student.spelling;
        };
        this.name = "Spelling";
        this.subject = SubjectType.Spelling;
        this.hasRangeScore = false;
        this.hasNaplanScore = false;
        this.hasCorrelationScore = false;
        this.isTested = false;
    }
    return SpellingSubject;
}());
var WritingSubject = (function () {
    function WritingSubject() {
        this.getScore = function (student) {
            return student.writing;
        };
        this.name = "Writing Comprehension";
        this.subject = SubjectType.Writing;
        this.hasRangeScore = false;
        this.hasNaplanScore = true;
        this.hasCorrelationScore = false;
        this.isTested = false;
    }
    return WritingSubject;
}());
var RavenSubject = (function () {
    function RavenSubject() {
        this.getScore = function (student) {
            return student.raven;
        };
        this.name = "Ravens SPM";
        this.subject = SubjectType.Ravens;
        this.hasRangeScore = false;
        this.hasNaplanScore = true;
        this.hasCorrelationScore = false;
        this.isTested = false;
    }
    return RavenSubject;
}());
//# sourceMappingURL=Subject.js.map