namespace CustomGroupApp.Models
{
    public class StanineTable
    {
        public SubjectType Subject { get; set; }
        public short[] Stanines { get; set; }
    }
}

public enum SubjectType
{
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

