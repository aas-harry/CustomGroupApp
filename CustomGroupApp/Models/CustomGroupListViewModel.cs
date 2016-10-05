using System.Collections.Generic;

namespace CustomGroupApp.Models
{
    public class CustomGroupListViewModel
    {
        public Test Test { get; set; }
        public IEnumerable<Result> Results { get; set; }
        public IEnumerable<CustomGroupSet> CustomGroupSets { get; set; }
    }
}