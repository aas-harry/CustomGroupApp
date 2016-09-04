var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GroupType;
(function (GroupType) {
    GroupType[GroupType["Unknown"] = 0] = "Unknown";
    GroupType[GroupType["MixedAbility"] = 1] = "MixedAbility";
    GroupType[GroupType["Streaming"] = 2] = "Streaming";
    GroupType[GroupType["Banding"] = 3] = "Banding";
    GroupType[GroupType["TopMiddleLowest"] = 4] = "TopMiddleLowest";
    GroupType[GroupType["Language"] = 5] = "Language";
    GroupType[GroupType["CustomGroup"] = 6] = "CustomGroup";
})(GroupType || (GroupType = {}));
var SearchDirection;
(function (SearchDirection) {
    SearchDirection[SearchDirection["Forward"] = 0] = "Forward";
    SearchDirection[SearchDirection["Backward"] = 1] = "Backward";
})(SearchDirection || (SearchDirection = {}));
var Gender;
(function (Gender) {
    Gender[Gender["All"] = 0] = "All";
    Gender[Gender["Girls"] = 1] = "Girls";
    Gender[Gender["Boys"] = 2] = "Boys";
})(Gender || (Gender = {}));
var BandType;
(function (BandType) {
    BandType[BandType["None"] = 0] = "None";
    BandType[BandType["Custom"] = 1] = "Custom";
    BandType[BandType["Top"] = 2] = "Top";
    BandType[BandType["Middle"] = 3] = "Middle";
    BandType[BandType["Lowest"] = 4] = "Lowest";
})(BandType || (BandType = {}));
var StreamType;
(function (StreamType) {
    StreamType[StreamType["None"] = 0] = "None";
    StreamType[StreamType["OverallAbilty"] = 1] = "OverallAbilty";
    StreamType[StreamType["English"] = 1] = "English";
    StreamType[StreamType["MathsAchievement"] = 2] = "MathsAchievement";
})(StreamType || (StreamType = {}));
var BandStreamType;
(function (BandStreamType) {
    BandStreamType[BandStreamType["None"] = 0] = "None";
    BandStreamType[BandStreamType["Streaming"] = 1] = "Streaming";
    BandStreamType[BandStreamType["Parallel"] = 2] = "Parallel";
})(BandStreamType || (BandStreamType = {}));
function createUuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}
var SummaryClass = (function () {
    function SummaryClass() {
    }
    return SummaryClass;
}());
var StudentClass = (function () {
    function StudentClass(s) {
        this.s = s;
        this.source = s;
        this.name = s.name;
        this.gender = s.sex;
        this.score = s.genab.raw + s.mathPerformance.raw + s.reading.raw + s.spelling.raw;
    }
    return StudentClass;
}());
var SearchClassContext = (function () {
    function SearchClassContext(classNo, firstClassNo, lastClassNo, isLastClass) {
        this.classNo = classNo;
        this.firstClassNo = firstClassNo;
        this.lastClassNo = lastClassNo;
        this.isLastClass = isLastClass;
    }
    return SearchClassContext;
}());
var ClassDefinition = (function () {
    function ClassDefinition(parent, index, count) {
        this.parent = parent;
        this.index = index;
        this.count = count;
        this.students = [];
        this.uid = createUuid();
        this.students = new Array();
    }
    Object.defineProperty(ClassDefinition.prototype, "moreStudents", {
        get: function () {
            return this.count - (this.students ? this.students.length : 0);
        },
        enumerable: true,
        configurable: true
    });
    return ClassDefinition;
}());
var BandDefinition = (function () {
    function BandDefinition(parent, bandNo, bandName, bandType) {
        var _this = this;
        if (bandType === void 0) { bandType = BandType.None; }
        this.parent = parent;
        this.bandNo = bandNo;
        this.bandName = bandName;
        this.bandType = bandType;
        this.classes = [];
        this.students = [];
        this.setClassCount = function (classCount, studentCount) {
            _this.classes = _this.calculateClassesSize(_this, studentCount, classCount);
        };
        this.calculateTotalScore = function (students) {
            if (_this.streamType === StreamType.OverallAbilty) {
                _this.setOveralAbilityScore(students);
            }
            if (_this.streamType === StreamType.English) {
                _this.setEnglishScore(students);
            }
            if (_this.streamType === StreamType.MathsAchievement) {
                _this.setMathAchievementScore(students);
            }
        };
        this.setOveralAbilityScore = function (students) {
            for (var i = 0; i < students.length; i++) {
                students[i].score = students[i].source.overallAbilityScore();
            }
        };
        this.setEnglishScore = function (students) {
            for (var i = 0; i < students.length; i++) {
                students[i].score = students[i].source.englishScore();
            }
        };
        this.setMathAchievementScore = function (students) {
            for (var i = 0; i < students.length; i++) {
                students[i].score = students[i].source.mathsAchievementScore();
            }
        };
        this.distributeStudents = function (groupType, streamType, mixBoysGirls) {
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
        this.calculateAverage = function (classes) {
            for (var i = 0; i < classes.length; i++) {
                classes[i].average = Enumerable.From(classes[i].students).Average(function (x) { return x.score; });
            }
        };
        this.groupByMixAbility = function (students, mixBoysGirls) {
            _this.calculateTotalScore(students);
            if (!mixBoysGirls) {
                _this.classes = _this.groupByMixAbilityInternal(students, true);
                return;
            }
            var femaleClasses = _this.groupByMixAbilityInternal(Enumerable.From(students)
                .Where(function (s) { return (s.gender === "F"); }).Select(function (s) { return s; }).ToArray(), false);
            var maleClasses = _this.groupByMixAbilityInternal(Enumerable.From(students)
                .Where(function (s) { return (s.gender === "M"); }).Select(function (s) { return s; }).ToArray(), false);
            var index = _this.classCount - 1;
            for (var i = 0; i < _this.classCount; i++) {
                if (i < femaleClasses.length) {
                    _this.classes[i].students = (_this.classes[i].students.concat(femaleClasses[i].students));
                }
                if (index < maleClasses.length) {
                    for (var j = 0; j < maleClasses[index].students.length; j++) {
                        maleClasses[index].students[j].classNo = i + 1;
                    }
                    _this.classes[i].students = (_this.classes[i].students.concat(maleClasses[index].students));
                }
                index--;
            }
        };
        this.groupByStreaming = function (students, mixBoysGirls) {
            _this.calculateTotalScore(students);
            if (!mixBoysGirls) {
                _this.classes = _this.groupByStreamingInternal(students, true);
                return;
            }
            var femaleStudents = Enumerable.From(students).Where(function (s) { return (s.gender === "F"); }).Select(function (s) { return s; }).ToArray();
            var maleStudents = Enumerable.From(students).Where(function (s) { return (s.gender === "F"); }).Select(function (s) { return s; }).ToArray();
            var maleClasses = _this.groupByStreamingInternal(maleStudents, false);
            var femaleClasses = _this.groupByStreamingInternal(femaleStudents, false);
            if (femaleStudents.length < maleStudents.length) {
                for (var i = 0; i < _this.classCount; i++) {
                    if (i < femaleClasses.length) {
                        for (var j = 0; j < femaleClasses[i].students.length; j++) {
                            if (_this.classes[i].count <= _this.classes[i].students.length) {
                                break;
                            }
                            femaleClasses[i].students[j].flag = 1;
                            _this.classes[i].students.push(femaleClasses[i].students[j]);
                        }
                    }
                }
            }
            for (var i = 0; i < _this.classCount; i++) {
                if (i < femaleClasses.length) {
                    _this.classes[i].students = (_this.classes[i].students.concat(femaleClasses[i].students));
                }
                if (i < maleClasses.length) {
                    _this.classes[i].students = (_this.classes[i].students.concat(maleClasses[i].students));
                }
            }
        };
        this.groupByMixAbilityInternal = function (students, allStudents) {
            var classes = allStudents ? _this.classes : _this.calculateClassesSize(_this, students.length, _this.classCount);
            var sortedStudents = Enumerable.From(students).OrderByDescending(function (s) { return s.score; }).Select(function (s) { return s; }).ToArray();
            var nextClass = new SearchClassContext(0, 0, _this.classCount - 1, false);
            for (var i = 0; i < sortedStudents.length; i++) {
                var student = sortedStudents[i];
                student.classNo = nextClass.classNo + 1;
                student.bandNo = _this.bandNo;
                classes[nextClass.classNo].students.push(student);
                nextClass = _this.getNextClassToAddNewStudent(classes, nextClass);
            }
            return classes;
        };
        this.getNextClassToAddNewStudent = function (classes, context) {
            // this is the logic to get the next class
            // 1. Get the next available class 
            // 2. If the next class is the last class and then we need to ctart again from the last initial class no + 1
            //    This is will distribute the smarter students evently across all classes.
            var result = new SearchClassContext(-1, context.firstClassNo, context.lastClassNo, false);
            var nextClassNo;
            if (context.isLastClass) {
                nextClassNo = context.firstClassNo;
                result.lastClassNo = nextClassNo < classes.length ? context.firstClassNo : (classes.length - 1);
                result.firstClassNo = nextClassNo < classes.length ? (nextClassNo + 1) : 0;
            }
            else {
                nextClassNo = context.classNo;
            }
            // get the class in the right order to pick up
            var classQueue = [];
            for (var i = nextClassNo + 1; i < classes.length; i++) {
                classQueue.push(classes[i]);
            }
            for (var i = 0; i <= nextClassNo; i++) {
                classQueue.push(classes[i]);
            }
            for (var i = 0; i < classQueue.length; i++) {
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
        this.groupByStreamingInternal = function (students, allStudents) {
            var classes = allStudents ? _this.classes : _this.calculateClassesSize(_this, students.length, _this.classCount);
            var sortedStudents = Enumerable.From(students).OrderByDescending(function (s) { return s.score; }).Select(function (s) { return s; }).ToArray();
            var classNo = 0;
            var numberStudentsInClass = 0;
            for (var i = 0; i < sortedStudents.length; i++) {
                var student = sortedStudents[i];
                student.classNo = classNo + 1;
                student.bandNo = _this.bandNo;
                classes[classNo].students.push(student);
                numberStudentsInClass++;
                if (classes[classNo].count <= numberStudentsInClass) {
                    classNo++;
                    numberStudentsInClass = 0;
                }
            }
            return classes;
        };
        this.calculateClassesSize = function (bandDefnition, totalStudents, classCount) {
            var studentInClass = Math.floor(totalStudents / classCount);
            var remainingStudents = totalStudents - (studentInClass * classCount);
            var classes = new Array();
            for (var i = 0; i < classCount; i++) {
                classes.push(new ClassDefinition(bandDefnition, i + 1, studentInClass + (remainingStudents > 0 ? 1 : 0)));
                remainingStudents--;
            }
            return classes;
        };
        this.uid = createUuid();
        this.mixBoysGirls = false;
        this.streamType = StreamType.OverallAbilty;
        this.students = new Array();
    }
    Object.defineProperty(BandDefinition.prototype, "studentCount", {
        get: function () {
            return this.students ? this.students.length : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BandDefinition.prototype, "classCount", {
        get: function () {
            return this.classes ? this.classes.length : 0;
        },
        enumerable: true,
        configurable: true
    });
    return BandDefinition;
}());
var BandSet = (function () {
    function BandSet(parent, name) {
        var _this = this;
        this.parent = parent;
        this.name = name;
        this.createBands = function (name, bandCount) {
            _this.bands = [];
            _this.count = bandCount;
            // Create a temporary banddefinition to calculate the band sizes
            var tempBand = new BandDefinition(_this.parent, 1, "Custom", BandType.Custom);
            var classes = tempBand.calculateClassesSize(tempBand, _this.students.length, bandCount);
            for (var i = 0; i < bandCount; i++) {
                _this.bands.push(_this.convertFromClasses(classes[i], i + 1));
            }
        };
        this.createBandClasses = function (bandStreamType, mixBoysGirls) {
            if (!bandStreamType) {
                bandStreamType = _this.bandStreamType;
            }
            if (!mixBoysGirls) {
                mixBoysGirls = _this.mixBoysGirls;
            }
            _this.bandStreamType = bandStreamType;
            _this.mixBoysGirls = mixBoysGirls;
            // Create a temporary banddefinition to calculate the band sizes
            //for (let i = 0; i < this.count; i++) {
            //    var tempBand = new BandDefinition(this.parent, 1, "Custom", BandType.Custom);
            //    tempBand.classes = this.bands[i].
            //    tempBand.groupByStreaming(this.students, mixBoysGirls);
            //    this.bands[i].students = tempBand.classes[i].students;
            //}
            for (var i = 0; i < _this.bands.length; i++) {
                _this.bands[i].groupByMixAbility(_this.bands[i].students, _this.mixBoysGirls);
            }
        };
        this.convertToClasses = function (band) {
            //let classDefintion = new ClassDefinition(band, 1, b)
            return null;
        };
        this.convertFromClasses = function (classDefinition, bandNo) {
            var bandDefinition = new BandDefinition(_this.parent, bandNo, "Band " + bandNo);
            bandDefinition.classes.push(classDefinition);
            return bandDefinition;
        };
        this.students = parent.students;
        this.bandStreamType = BandStreamType.Streaming;
        this.mixBoysGirls = true;
    }
    Object.defineProperty(BandSet.prototype, "students", {
        get: function () {
            return this.parent && this.parent.students ? this.parent.students : new Array();
        },
        enumerable: true,
        configurable: true
    });
    return BandSet;
}());
var TopMiddleLowestBandSet = (function (_super) {
    __extends(TopMiddleLowestBandSet, _super);
    function TopMiddleLowestBandSet(parent) {
        _super.call(this, parent, "TopMiddleLowest");
        this.parent = parent;
        this.bands = [];
        this.count = 3;
        this.bands.push(new BandDefinition(this.parent, 1, "Top", BandType.Top));
        this.bands.push(new BandDefinition(this.parent, 2, "Middle", BandType.Middle));
        this.bands.push(new BandDefinition(this.parent, 3, "Lowest", BandType.Lowest));
    }
    return TopMiddleLowestBandSet;
}(BandSet));
var ClassesDefinition = (function () {
    function ClassesDefinition(testFile) {
        this.spreadBoysGirlsEqually = false;
        this.excludeLeavingStudent = false;
        this.uid = createUuid();
        this.groupType = GroupType.MixedAbility;
        this.groupGender = testFile.isUnisex ? Gender.All : (testFile.hasBoys ? Gender.Boys : Gender.Girls);
        this.testInfo = testFile;
        this.singleBand = new BandDefinition(this, 1, "Class", BandType.None);
        this.singleBand.classCount = 1;
        this.singleBand.classes = [new ClassDefinition(this.singleBand, 1, testFile.studentCount)];
        this.topMiddleLowestBands = new TopMiddleLowestBandSet(this);
        this.customBands = new BandSet(this, "Custom Bands");
        this.students = new Array();
        for (var i = 0; i < testFile.students.length; i++) {
            this.students.push(new StudentClass(testFile.students[i]));
        }
    }
    return ClassesDefinition;
}());
