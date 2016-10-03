using System.Collections.Generic;

namespace CustomGroupApp.Models
{
    public class CustomGroupViewModel
    {
        public Test Test { get; set; }
        public IEnumerable<Result> Results { get; set; }
        public IEnumerable<StudentLanguagePref> StudentLanguages { get; set; }
        public IEnumerable<GroupSet> GroupSets { get; set; }
    }
}