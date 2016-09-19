using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CustomGroupApp.Models
{
    public class StudentLanguage
    {
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Pref1 { get; set; }
        public string Pref2 { get; set; }
        public string Pref3 { get; set; }

        public string Name { get { return Lastname.ToUpper() + " " + Firstname; } }
    }
}