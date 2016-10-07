using System.Collections;
using System.Collections.Generic;

namespace CustomGroupApp.Models
{
    public class ClassDefinition
    {
        public int ClassNo { get; set; }
        public string Name { get; set; }
        public IList<Result> Students { get; set; }
    }
}