using System.Collections.Generic;

namespace CustomGroupApp.Models
{
    public class TestViewModel
    {
        public Test Test { get; set; }
        public IEnumerable<Result> Results { get; set; }
    }
}