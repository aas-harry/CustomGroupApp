namespace CustomGroupApp.Models
{
    public class PreallocatedClassStudent
    {
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Class { get; set; }
        public int? StudentId { get; set; }
        public string Name { get { return Lastname.ToUpper() + " " + Firstname; } }

    }
}