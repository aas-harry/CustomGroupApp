using System.EnterpriseServices.Internal;

namespace CustomGroupApp.Models
{
    public class CustomGroupSet
    {
        public int GroupSetId { get; set; }
        public int TestNumber { get; set; }
        public string Name { get; set; }
        public int[] Students { get; set; }
    }
}