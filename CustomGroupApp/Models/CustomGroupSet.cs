﻿using System.EnterpriseServices.Internal;

namespace CustomGroupApp.Models
{
    public class CustomGroupSet
    {
        public class ClassItem
        {
            public int[] Students { get; set; }
        }
        public int TestNumber { get; set; }
        public string Name { get; set; }
        public int[][] Classes { get; set; }
    }
}